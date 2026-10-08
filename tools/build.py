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

Unpacking:

    python3 tools/build.py unpack divoVAM.cdy

copies scripts, construction and images of a .cdy into src/ (see "Source
tree" below) and removes what the archive no longer contains. Refuses to run
while src/ has uncommitted changes, unless --force is given.
"""

import argparse
import datetime
import json
import pathlib
import re
import subprocess
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
    "wide"      : [-6.285577682895096, 25.03577551661606, 31.42788841447548, 2.9190648900224683],
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

# Freehand drawing overlay, activated with ?draw
# The tool is a self contained JS overlay: it puts a second canvas on top of
# #CSCanvas and draws there. Deployed as a separate file next to the HTML.
FREEHAND_SRC = "src/js/freehand-drawing.js"   # relative to the repo root
FREEHAND_URL = "freehand-drawing.js"          # how the HTML references it

# Source tree, relative to the repo root
REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC_DIR = "src"
SRC_MANIFEST = "manifest.json"
SRC_CONSTRUCTION = "construction.cdy"
SRC_SCRIPTS = "cindyscript"         # one folder per Cinderella event
SRC_IMAGES = "resources/images"
SCRIPT_EXT = ".cindyscript"         # ".cs" inside the archive

# Characters Windows does not allow in file names. Script labels become file
# names, so they must not contain any of these.
FORBIDDEN_CHARS = '<>:"/\\|?*'

# Header lines of construction.cdy that change on every save, even when the
# construction itself did not. Ignored when comparing.
VOLATILE_HEADERS = ("//Cindy-", "//Created on:", "//For:")

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
      /* html.divo-full #CSCanvas {{ width: 100vw; height: 100vh; }} <-- dead, since CindyJS sets divStylewidth from port which now always exists */

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

# --- 2b. Build the freehand drawing overlay, if requested. ---
def freehand_block():
    """Return the <script> block for the freehand drawing overlay.

    The tool itself lives in a separate file that has to be uploaded next to
    the HTML. Only its CONFIGURATION is generated here, so it can be steered
    from the URL:

        ?draw               switch it on
        ?drawpen=4          pen width in px
        ?drawerase=20       side length of the eraser square in px
        ?drawpos=0.4,0.05   menu bar position, relative to the canvas
        ?drawdir=right      direction the menu bar unfolds in
        ?drawmoveable       let the user drag the menu bar around

    The tool script is only fetched when ?draw is present, so the feature
    costs nothing when it is not used.
    """
    return """
<script>
/* {marker}: freehand drawing overlay, active with ?draw */
(function () {{
    var q = new URLSearchParams(window.location.search);
    if (!q.has("draw")) return;

    var pos = (q.get("drawpos") || "0.4,0.05").split(",").map(Number);
    if (pos.length !== 2 || pos.some(isNaN)) pos = [0.4, 0.05];

    window.CONFIGURATION = {{
        mode: "website",
        elementID: "CSCanvas",
        penSize: Number(q.get("drawpen")) || 4,
        eraserSize: Number(q.get("drawerase")) || 20,
        startLocation: {{
            x_absolute: undefined, y_absolute: undefined,
            x_relative: pos[0], y_relative: pos[1]
        }},
        menubar: {{
            moveable: q.has("drawmoveable"),
            direction: q.get("drawdir") || "right"
        }}
    }};

    var s = document.createElement("script");
    s.src = "{url}";
    document.body.appendChild(s);
}})();
</script>
""".format(marker=MARKER, url=FREEHAND_URL)

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

    # Freehand drawing overlay, right before </body> so #CSCanvas exists
    text = text.replace("</body>", freehand_block() + "</body>", 1)

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
def read_archive(path):
    """Return the parts of a Cinderella archive as a dict:

        events        {event folder: [(label, source), ...]}, sub scripts in
                      their order, events in the order of the archive
        construction  text of construction.cdy (None if missing)
        images        {file name: bytes}
    """

    parts, images, construction = {}, {}, None

    with zipfile.ZipFile(path) as z:
        for name in z.namelist(): # Iterate over all files from table of contents of zip file

            # Parse construction
            if name == "private/de.cinderella/construction.cdy":
                construction = z.read(name).decode("utf-8")
                continue

            # Parse images and fill dict "images" with icon names and data
            if name.startswith("resources/images/") and not name.endswith("/"):
                images[name.rsplit("/", 1)[1]] = z.read(name)
                continue

            # Find script file
            m = re.match(r"private/de\.cinderella/scripts/([^/]+)/(\d+)/(.+)\.cs$", name)

            # If none found continue
            if not m:
                continue

            # Decode URL since Cinderella encodes special chars
            event = urllib.parse.unquote_plus(m.group(1))

            # Get scripts label
            label = urllib.parse.unquote_plus(m.group(3))

            # Add scripts to parts dict (if key doesnt exist starts with empty dict as default entry)
            # The number folder is the position of the sub script within its event
            parts.setdefault(event, {})[int(m.group(2))] = (label, z.read(name).decode("utf-8"))

    # Fold items from parts to ordered lists for every event
    events = {event: [chunks[i] for i in sorted(chunks)] for event, chunks in parts.items()}

    return {"events": events, "construction": construction, "images": images}


def read_cdy(path):
    """Return ({key: source}, [icon file names]) from the Cinderella archive."""

    archive = read_archive(path)
    scripts = {}

    for event, chunks in archive["events"].items():
        # Get CindyJS event name from Cinderella event name
        key = EVENT_MAP.get(event)

        # If Cinderella event not found in dict print WARNING and continue
        if key is None:
            print("  WARNING: unknown event folder '%s' - skipped" % event)
            continue

        # Concatenate the sub scripts in order, each preceded by its name as a
        # comment - same layout Cinderella uses in its HTML export.
        scripts[key] = "\n".join("//%s\n%s" % (label, src) for label, src in chunks)

    return scripts, sorted(archive["images"])


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
# Unpacking a .cdy into the source tree
# ==========================================================================
# The source tree holds one plain text file per Cinderella sub script:
#
#     src/manifest.json                              order of the sub scripts
#     src/construction.cdy                           copied verbatim
#     src/cindyscript/<event>/<label>.cindyscript    one per sub script
#     src/resources/images/<name>                    images of the archive
#
# Event folders and labels are the ones Cinderella shows. The label doubles
# as the file name, so the manifest only has to hold the order.

# --- 1. Check if a name works as a file name everywhere. ---
def unsafe_name(name):
    """Return why name can not be a file name on every platform, else None."""

    # Characters Windows refuses, plus control characters
    bad = sorted({c for c in name if c in FORBIDDEN_CHARS or ord(c) < 32})
    if bad:
        return "contains %s" % " ".join(repr(c) for c in bad)

    # Windows silently drops these, so two names could end up the same
    if name != name.rstrip(" ."):
        return "ends with a space or a dot"

    return None


# --- 2. Strip the save stamp from construction.cdy. ---
def strip_volatile(text):
    """Return the lines of construction.cdy without the ones that change on every save."""
    return [l for l in text.splitlines() if not l.startswith(VOLATILE_HEADERS)]


# --- 3. Write a file only if its content changed. ---
def write_if_changed(path, data, changes):
    """Write bytes to path unless it already holds them, note what happened in changes."""

    # Same content --> nothing to do.
    if path.is_file():
        if path.read_bytes() == data:
            return
        changes.append(("changed", path))
    else:
        changes.append(("added", path))

    # Bytes, not text: keeps line endings exactly as they are in the archive
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)


# --- 4. Remove files the archive does not contain (anymore). ---
def remove_others(folder, keep, suffix, changes):
    """Delete files below folder that are not in keep, then empty folders.

    With a suffix only files ending in it are considered, so stray files of
    an editor next to the scripts survive.
    """

    # Folder does not exist yet --> nothing to remove.
    if not folder.is_dir():
        return

    # Remove files first...
    for path in sorted(p for p in folder.rglob("*") if p.is_file()):
        if path in keep or (suffix and path.suffix != suffix):
            continue
        path.unlink()
        changes.append(("removed", path))

    # ...then folders left empty, deepest first
    dirs = sorted((p for p in folder.rglob("*") if p.is_dir()),
                  key=lambda p: len(p.parts), reverse=True)
    for path in dirs:
        if not any(path.iterdir()):
            path.rmdir()


# --- 5. Ask git about uncommitted work. ---
def uncommitted(paths):
    """Return git's short status lines for paths, None if git can not tell."""

    try:
        r = subprocess.run(["git", "status", "--porcelain", "--"] + [str(p) for p in paths],
                           cwd=REPO_ROOT, capture_output=True, text=True)
    except OSError:
        return None

    # Not a repository or folder outside of it
    if r.returncode != 0:
        return None

    return r.stdout.splitlines()


# --- 6. Unpack. ---
def unpack(cdy_path, src):
    """Mirror the archive into the source tree. Return the list of changes."""

    archive = read_archive(cdy_path)

    # No construction --> probably not a Cinderella file.
    if archive["construction"] is None:
        sys.exit("ERROR: no construction.cdy inside the archive - not a Cinderella file?")

    # Labels become file names. Find the ones that would not work on every
    # platform or would end up as the same file (case insensitive file systems).
    problems = []
    for event, chunks in archive["events"].items():
        seen = set()
        for name in [event] + [label for label, _ in chunks]:
            reason = unsafe_name(name)
            if reason:
                problems.append("%s / %s: %s" % (event, name, reason))
            elif name.lower() in seen:
                problems.append("%s / %s: used twice" % (event, name))
            seen.add(name.lower())

    for name in archive["images"]:
        reason = unsafe_name(name)
        if reason:
            problems.append("image %s: %s" % (name, reason))

    # Any problems --> exit, nothing has been written yet.
    if problems:
        sys.exit("ERROR: these names can not be used as file names, rename them in Cinderella:\n  "
                 + "\n  ".join(problems))

    changes = []

    # --- scripts and their order ---
    scripts, keep, manifest = src / SRC_SCRIPTS, set(), {}

    for event, chunks in archive["events"].items():
        manifest[event] = [label for label, _ in chunks]

        for label, source in chunks:
            path = scripts / event / (label + SCRIPT_EXT)
            keep.add(path)
            write_if_changed(path, source.encode("utf-8"), changes)

    remove_others(scripts, keep, SCRIPT_EXT, changes)

    # One label per line, so a reordering shows up as a readable diff
    text = json.dumps(manifest, indent=2, ensure_ascii=False) + "\n"
    write_if_changed(src / SRC_MANIFEST, text.encode("utf-8"), changes)

    # --- construction ---
    # Keep the old file if only the save stamp in its header differs,
    # otherwise every save in Cinderella would show up as a change.
    path = src / SRC_CONSTRUCTION
    if not (path.is_file() and strip_volatile(path.read_text(encoding="utf-8"))
            == strip_volatile(archive["construction"])):
        write_if_changed(path, archive["construction"].encode("utf-8"), changes)

    # --- images ---
    images, keep = src / SRC_IMAGES, set()

    for name, data in archive["images"].items():
        keep.add(images / name)
        write_if_changed(images / name, data, changes)

    remove_others(images, keep, None, changes)

    return changes


# --- 7. Command line for unpacking. ---
def unpack_main(argv):
    # Parse args.
    ap = argparse.ArgumentParser(prog="build.py unpack",
                                 description="copy scripts, construction and images of a .cdy into src/")
    ap.add_argument("cdy", help="Cinderella file to unpack, e.g. divoVAM.cdy")
    ap.add_argument("--src", default=str(REPO_ROOT / SRC_DIR),
                    help="source tree (default: src/ in the repo)")
    ap.add_argument("--force", action="store_true",
                    help="unpack even if src/ has uncommitted changes")
    a = ap.parse_args(argv)

    # Setup path names.
    cdy_path, src = pathlib.Path(a.cdy), pathlib.Path(a.src)

    # Check if file exists, else --> exit.
    if not cdy_path.is_file():
        sys.exit("File not found: %s" % cdy_path)

    # Unpacking overwrites and deletes files in src/. That is only safe while
    # everything it touches is committed, because then git can restore it.
    # Other files in src/ (e.g. js/) are none of its business.
    if not a.force:
        status = uncommitted([src / SRC_SCRIPTS, src / SRC_IMAGES,
                              src / SRC_MANIFEST, src / SRC_CONSTRUCTION])
        if status is None:
            sys.exit("ERROR: could not ask git about %s - use --force to unpack anyway." % src)
        if status:
            sys.exit("ERROR: %s has uncommitted changes, unpacking would overwrite them:\n  %s\n"
                     "Commit or stash them first, or use --force." % (src, "\n  ".join(status)))

    # Unpack.
    changes = unpack(cdy_path, src)

    # Print some results.
    print("unpack: %s -> %s" % (cdy_path, src))
    for what, path in changes:
        print("  %-8s %s" % (what, path.relative_to(src)))
    if not changes:
        print("  no changes")


# ==========================================================================
# Main
# ==========================================================================
def main():
    # "unpack" is a sub command, everything else is the regular build.
    if sys.argv[1:2] == ["unpack"]:
        return unpack_main(sys.argv[2:])

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

        # Copy the freehand tool next to the HTML so it can be uploaded together
        src = REPO_ROOT / FREEHAND_SRC
        if src.is_file():
            (out_dir / FREEHAND_URL).write_text(src.read_text(encoding="utf-8"),
                                                encoding="utf-8")
            print("  plus    : %s" % FREEHAND_URL)
        else:
            print("  note: %s not found, freehand drawing will not work" % FREEHAND_SRC)

        # Write to file.
        target.write_text(patched, encoding="utf-8")

        # Print some results.
        print("html  : %s%s" % (target, "" if changed else "  (export was already patched)"))
        print("  presets : %s (default: %s)" % (", ".join(RECT_PRESETS), DEFAULT_PRESET))


if __name__ == "__main__":
    main()