#!/usr/bin/env python3
"""
divoVAM build script.

Takes a Cinderella construction plus its HTML export and produces both
deliverables in ./out:

    out/divoVAM.html   patched HTML  ->  upload to abako.dzlm.de
    out/divoVAM.cdyjs  module form   ->  upload to divomath

Usage:

    python3 build.py "divoVAM v6"

expects these files next to the script:

    divoVAM v6.cdy    saved from Cinderella  (source of all scripts)
    divoVAM v6.html   exported from Cinderella (source of the metadata)

Why two sources?
The HTML export omits some scripts, so the scripts are read from the .cdy
archive, which always holds the complete and current set. Everything else
(geometry, appearance, animation, ...) is taken from the HTML export, so no
hand maintained template is needed.

Options:
    --out DIR         output directory (default: out)
    --img-base URL    base URL for the images in the cdyjs
    --rect A,B,C,D    visibleRect written into the cdyjs
    --html-only       only build the patched HTML
    --cdyjs-only      only build the cdyjs
"""

import argparse
import datetime
import pathlib
import re
import sys
import urllib.parse
import zipfile

MARKER = "divoVAM-post-export-patch"
STALE_TOLERANCE = 60

# Fixed output names
OUT_HTML = "divoVAM.html"
OUT_CDYJS = "divoVAM.cdyjs"

# Rect presets selectable in the browser via ?rect=<name>
# order is [left, top, right, bottom]
RECT_PRESETS = {
    "divomath"  : [-0.27428199274629916, 18.50596739294148, 24.217486536011474, -0.40335587168573406],
    "classic"   : [-1.7258704824220432, 22.351088099515103, 36.49896464677728, 0.23437747292151204],
}
DEFAULT_PRESET = "divomath"

# Fixed viewport for divomath: it sizes the canvas itself, so no width/height
DIVOMATH_RECT = [0, 18, 24, 0]

# Where divomath loads the icons from
DEFAULT_IMG_BASE = "https://abako.dzlm.de/cindy/divomath/img/"

# Folder name inside the .cdy archive --> key in the cdyjs
EVENT_MAP = {
    "Draw"          : "draw",
    "Init"          : "init",
    "Tick"          : "tick",
    "Mouse down"    : "mousedown",
    "Mouse up"      : "mouseup",
    "Mouse drag"    : "mousedrag",
    "Mouse move"    : "mousemove",
    "Key typed"     : "keydown",
    "Mouse click"   : "mouseclick",
    "Move"          : "move",
    "Multi down"    : "multidown",
    "Multi drag"    : "multidrag",
    "Multi up"      : "multiup",
}

# Fields copied verbatim from the HTML export into the cdyjs, in this order.
# "scripts", "ports" and "images" are rebuilt, "use" is dropped (not supported).
COPY_FIELDS = ["defaultAppearance", "angleUnit", "geometry", "animation",
               "autoplay", "animcontrols", "csconsole", "cinderella"]


# ==========================================================================
# HTML patching
# ==========================================================================
# --- 1. Build CSS Block for <head> of html file. ---
HEAD_PATCH = """
    <!-- {marker}: pen input (iPadOS "Scribble" swallows pointer events) -->
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    
    <style type="text/css">

      html, body {{ overscroll-behavior: none; }}
      #CSCanvas, #CSCanvas canvas {{
        touch-action: none;
        -webkit-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }}

      /* only applies with ?full */
      html.divo-full, html.divo-full body {{ height: 100%; margin: 0; padding: 0; }}
      html.divo-full #CSCanvas {{ width: 100vw; height: 100vh; }}

    </style>
"""

# --- 2. Build JS to parse state of ?full and ?rect from URL list. ---
def js_prelude():
    """Return the JS snippet inserted before the CindyJS call.

    Reads ?full and ?rect from the URL and exposes two globals the patched
    ports block relies on:

        VAM_FULL    true if the canvas should fill the browser window
        VAM_RECT    the visibleRect to use, from a named preset in
                    RECT_PRESETS or from four comma separated numbers

    Invalid values fall back to the default preset, so a malformed URL
    cannot break the page. With ?full only the "divo-full" class is set on
    <html>; the actual sizing is left to CSS because this code runs inside
    <head>, where document.body does not exist yet.
    """

    presets = ",\n    ".join(
        '"%s": [%s]' % (k, ", ".join(repr(v) for v in vals))
        for k, vals in RECT_PRESETS.items()
    )
    return """
/* {marker}: layout and viewport selectable via URL
   ?full            -> canvas fills the browser window
   ?rect=classic    -> named preset
   ?rect=a,b,c,d    -> custom rect [left,top,right,bottom]                */

var VAM_Q = new URLSearchParams(window.location.search);
var VAM_FULL = VAM_Q.has("full");
var VAM_PRESETS = {{
    {presets}
}};
var VAM_RECT = VAM_PRESETS["{default}"];
(function () {{
    var r = VAM_Q.get("rect");
    if (!r) return;
    if (VAM_PRESETS[r]) {{ VAM_RECT = VAM_PRESETS[r]; return; }}
    var v = r.split(",").map(Number);
    if (v.length === 4 && v.every(function (n) {{ return !isNaN(n); }})) VAM_RECT = v;
}})();
if (VAM_FULL) {{
    /* This inline script runs inside <head>, where document.body does not
       exist yet. Sizing is therefore done by CSS through the "divo-full"
       class set on <html> (documentElement is already available). */
    document.documentElement.classList.add("divo-full");
    window.addEventListener("resize", function () {{ window.location.reload(); }});
}}
""".format(marker=MARKER, presets=presets, default=DEFAULT_PRESET)

# --- 3. Build html from above, change ports block to be adress visibleRect ---
def patch_html(text, build_no):
    """Add pen-input CSS and make layout/viewport selectable via URL."""

    # Add build number for html output
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3]
    text = text.replace("<!DOCTYPE html>",
                        "<!-- build %d | %sZ -->\n<!DOCTYPE html>" % (build_no, stamp), 1)

    # Check if already patched. If so, return
    if MARKER in text:
        return text, False

    # Contains this string? If not probably not a valid file.
    if '<meta charset="UTF-8">' not in text:
        sys.exit('ERROR: <meta charset="UTF-8"> not found - not a Cinderella export?')

    # Append HEAD_PATCH to <head>.
    text = text.replace('<meta charset="UTF-8">',
                        '<meta charset="UTF-8">\n' + HEAD_PATCH.format(marker=MARKER), 1)

    # No CindyJS --> exit.
    if "var cdy = CindyJS({" not in text:
        sys.exit("ERROR: CindyJS call not found.")

    # Append js_prelude() to CindyJS init.
    text = text.replace("var cdy = CindyJS({", js_prelude() + "\nvar cdy = CindyJS({", 1)

    # Look for ports.
    m = re.search(r"ports:\s*\[\{(.*?)\}\]", text, re.S)

    # No ports block found --> exit.
    if not m:
        sys.exit("ERROR: ports block not found.")

    # Get the whole ports block and rebuild it.
    block = m.group(1)

    new = re.sub(r"width:\s*[\d.]+",
                 "width: VAM_FULL ? window.innerWidth : 885", block, count=1)

    new = re.sub(r"height:\s*[\d.]+",
                 "height: VAM_FULL ? window.innerHeight : 519", new, count=1)

    new = re.sub(r"visibleRect:\s*\[[^\]]*\]", "visibleRect: VAM_RECT", new, count=1)

    if new == block:
        sys.exit("ERROR: could not rewrite the ports block.")

    return text[:m.start(1)] + new + text[m.end(1):], True


# ==========================================================================
# Building cdyjs file for use in divomath
# ==========================================================================
# --- 1. Read the archive ---
def read_cdy(path):
    """Return ({key: source}, [icon file names]) from the Cinderella archive."""

    parts, icons = {}, []

    with zipfile.ZipFile(path) as z:
        for info in z.infolist(): # Iterate over all files from table of contents of zip file
            name = info.filename

            # Parse images and fill list "icons" with icon names
            if name.startswith("resources/images/") and not name.endswith("/"):
                icons.append(name.rsplit("/", 1)[1])
                continue

            # Find script file
            m = re.match(r"private/de\.cinderella/scripts/([^/]+)/(\d+)/(.+)\.cs$", name)
            
            # If none found continue
            if not m:
                continue

            # Decode URL since Cinderella encodes special chars
            event = urllib.parse.unquote_plus(m.group(1))
            
            # Get CindyJS event name from Cinderella event name
            key = EVENT_MAP.get(event)

            # If Cinderella event not found in dict print WARNING and continue
            if key is None:
                print("  WARNING: unknown event folder '%s' - skipped" % event)
                continue
            
            # Get scripts label
            label = urllib.parse.unquote_plus(m.group(3))
            
            # Add scripts to parts dict (if key doesnt exist starts with empty dict as default entry)
            parts.setdefault(key, {})[int(m.group(2))] = (label, z.read(name).decode("utf-8"))

    scripts = {}

    # Fold items from parts to complete scripts for every type
    for key, chunks in parts.items():
        ordered = [chunks[i] for i in sorted(chunks)]
        # Concatenate the sub scripts in order, each preceded by its name as a
        # comment - same layout Cinderella uses in its HTML export.
        scripts[key] = "\n".join("//%s\n%s" % (label, src) for label, src in ordered)

    return scripts, sorted(icons)


# --- 2. Look for CindyJS() call in html text. ---
def cindyjs_object(html_text):
    """Return the CindyJS({...}) object literal as a string."""

    # Find CindyJS() call.
    i = html_text.find("var cdy = CindyJS({")

    # If not found -> exit.
    if i < 0:
        sys.exit("ERROR: CindyJS call not found in the HTML export.")

    # Determine index of starting position
    start = html_text.index("{", i)


    # Find matching closing bracket and return complete CindyJS Block
    depth, k = 0, start

    while k < len(html_text):
        if html_text[k] == "{":
            depth += 1
        elif html_text[k] == "}":
            depth -= 1
            if depth == 0:
                return html_text[start:k + 1]
        k += 1

    sys.exit("ERROR: CindyJS object literal is not balanced.")


# --- 3. From CindyJS() string, find 'field: <value>' ---
def field_from(obj_text, field):
    """Extract '<field>: <value>' from the object literal, brackets balanced."""

    # Find field which is indented by exactly 2 spaces
    # otherwise would find i.e. wrong "autoplay" field
    m = re.search(r"^  %s:\s*" % re.escape(field), obj_text, re.M)

    # Found nothing --> return
    if not m:
        return None

    # Get position after field name
    i = m.end()

    # instr = which symbol started a string, None otherwise
    # esc = last symbol was a backslash
    depth, k, instr, esc = 0, i, None, False

    # State machine to find last index of value
    while k < len(obj_text):
        ch = obj_text[k]
        if instr:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == instr:
                instr = None
        elif ch in "\"'":
            instr = ch
        elif ch in "{[":
            depth += 1
        elif ch in "}]":
            depth -= 1
        elif ch == "," and depth == 0:
            break
        elif ch == "\n" and depth == 0 and obj_text[i:k].strip():
            break
        k += 1

    value = obj_text[i:k].rstrip().rstrip(",")

    # The export indents one level deeper than the cdyjs expects.
    return "\n".join(l[2:] if l.startswith("  ") else l for l in value.split("\n"))


# --- 4. Escape all the things. ---
def esc_template_literal(s):
    """Escape for a JS template literal."""
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


# --- 5. Get build number from last cdyjs output (if any) and increment it by 1. ---
def next_build_number(out_file):
    """Continue the build counter of a previous run, start at 1 otherwise."""

    if out_file.is_file():
        m = re.search(r"// \*\*\*build (\d+) \|", out_file.read_text(encoding="utf-8"))
        if m:
            return int(m.group(1)) + 1

    return 1


def build_number_from_html(out_file):
    """Read the build number of a previous run from the patched HTML."""
    if out_file.is_file():
        m = re.search(r"<!-- build (\d+) \|", out_file.read_text(encoding="utf-8"))
        if m:
            return int(m.group(1)) + 1
    return 1


# --- 6. Build the cdyjs. ---
def build_cdyjs(html_text, scripts, icons, img_base, rect, build_no):
    obj = cindyjs_object(html_text)

    stamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3]

    out = ["() => ({ // ***build %d | %sZ***" % (build_no, stamp)]

    # --- scripts ---------------------------------------------------------
    out.append("scripts: {")
    keys = sorted(scripts)
    for n, key in enumerate(keys):
        out.append("    %s: " % key)
        out.append("`%s`%s" % (esc_template_literal(scripts[key]),
                               "," if n < len(keys) - 1 else ""))
        if n < len(keys) - 1:
            out.append("")
    out.append("},")

    # --- verbatim fields from the export ---------------------------------
    missing = []
    for field in COPY_FIELDS:
        value = field_from(obj, field)
        if value is None:
            missing.append(field)
            continue
        sep = "" if field == COPY_FIELDS[-1] else ","
        # ports/images are inserted separately below, keep the export order
        if field == "csconsole":
            out.append("ports: [{")
            out.append('  id: "CSCanvas",')
            out.append("  transform: [{visibleRect: [%s]}]," % ", ".join(str(v) for v in rect))
            out.append('  background: "rgb(255,255,255)"')
            out.append("}],")
        out.append("%s: %s%s" % (field, value, sep))
        if field == "csconsole":
            out.append("images: {")
            out.append(",\n".join('    "%s": "%s%s"' % (i, img_base, i) for i in icons))
            out.append("  },")

    out.append("});")
    return "\n".join(out), missing

# Check timestamps of files and warn if files stale
def warn_if_stale(cdy_path, html_path):
    """Warn if the .cdy predates the HTML export.

    Cinderella writes the export after saving, so an older .cdy means the
    construction was changed but not saved. The two outputs would then be
    built from different states without that being visible anywhere.
    """

    # Calc time difference between .html and .cdy
    delta = html_path.stat().st_mtime - cdy_path.stat().st_mtime

    # Print warning
    if delta > STALE_TOLERANCE:
        print("  WARNING: the .cdy is older than the export - save in Cinderella.")
    elif delta < STALE_TOLERANCE:
        print("  WARNING: the export is older than the .cdy - export again.")


# ==========================================================================
# Main
# ==========================================================================
def main():
    # Parse args.
    ap = argparse.ArgumentParser(description="divoVAM build")
    ap.add_argument("name", help='base name without extension, e.g. "divoVAM v6"')
    ap.add_argument("--out", default="out", help="output directory (default: out)")
    ap.add_argument("--img-base", default=DEFAULT_IMG_BASE, help="base URL for the icons")
    ap.add_argument("--rect", default=None, help="visibleRect for the cdyjs, e.g. 0,18,24,0")
    ap.add_argument("--html-only", action="store_true")
    ap.add_argument("--cdyjs-only", action="store_true")
    a = ap.parse_args()

    # Setup path names.
    base = pathlib.Path(a.name)
    html_path = base.with_suffix(".html")
    cdy_path = base.with_suffix(".cdy")
    out_dir = pathlib.Path(a.out)

    # Check if files exist, else --> exit.
    for p in [html_path] + ([] if a.html_only else [cdy_path]):
        if not p.is_file():
            sys.exit("File not found: %s" % p)

    # Warn if the construction was not saved before exporting.
    if not a.html_only:
        warn_if_stale(cdy_path, html_path)

    out_dir.mkdir(parents=True, exist_ok=True)
    html_raw = html_path.read_text(encoding="utf-8")

    # --- cdyjs ---
    if not a.html_only:

        # Try rect configuration.
        rect = DIVOMATH_RECT
        if a.rect:
            try:
                rect = [float(x) if "." in x else int(x) for x in a.rect.split(",")]
                if len(rect) != 4:
                    raise ValueError
            except ValueError:
                sys.exit("ERROR: --rect needs four numbers, e.g. 0,18,24,0")

        # Get the scripts.
        scripts, icons = read_cdy(cdy_path)
        if not scripts:
            sys.exit("ERROR: no scripts found inside the archive.")
        
        # Build.
        target = out_dir / OUT_CDYJS
        text, missing = build_cdyjs(html_raw, scripts, icons, a.img_base,
                                    rect, next_build_number(target))
        target.write_text(text, encoding="utf-8")

        # Print some results.
        print("cdyjs : %s" % target)
        print("  scripts : %s" % ", ".join(sorted(scripts)))
        print("  icons   : %d" % len(icons))
        if missing:
            print("  WARNING: fields missing in the export: %s" % ", ".join(missing))

    # --- html ---
    if not a.cdyjs_only:
        # Specifiy output path.
        target = out_dir / OUT_HTML

        # Patch.
        patched, changed = patch_html(html_raw, build_number_from_html(target))

        # Write to file.
        target.write_text(patched, encoding="utf-8")

        # Print some results.
        print("html  : %s%s" % (target, "" if changed else "  (export was already patched)"))
        print("  presets : %s (default: %s)" % (", ".join(RECT_PRESETS), DEFAULT_PRESET))


if __name__ == "__main__":
    main()