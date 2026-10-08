#!/usr/bin/env python3
"""
divoVAM build script.

Builds all deliverables from the source tree in src/ into ./out:

    out/divoVAM.html          standalone page     ->  upload to abako.dzlm.de
    out/freehand-drawing.js   pen overlay         ->  upload next to the HTML
    out/divoVAM.cdyjs         module form         ->  upload to divomath
    out/img/                  icons of the cdyjs  ->  upload to divomath's image folder
    out/divoVAM.cdy           Cinderella file     ->  by-product, to open in Cinderella

Usage:

    python3 tools/build.py

Every build increases the counter in src/BUILD and stamps the number into
the header of the HTML and the cdyjs.

Options:
    --out DIR         output directory (default: out)
    --img-base URL    base URL for the images in the cdyjs
    --rect A,B,C,D    visibleRect written into the cdyjs
    --force           build even if out/divoVAM.cdy was changed in Cinderella

Unpacking:

    python3 tools/build.py unpack [divoVAM.cdy]

copies scripts, construction and images of a .cdy into src/ (see "Source
tree" below) and removes what the archive no longer contains. Without a file
it unpacks out/divoVAM.cdy, the way back after changing it in Cinderella.
Refuses to run while src/ has uncommitted changes, unless --force is given.
"""

import argparse
import base64
import datetime
import hashlib
import json
import pathlib
import re
import subprocess
import sys
import urllib.parse
import zipfile

# Fixed output names
OUT_DIR = "out"                         # relative to the repo root
OUT_HTML = "divoVAM.html"
OUT_CDYJS = "divoVAM.cdyjs"
OUT_CDY = "divoVAM.cdy"
OUT_IMAGES = "img"
OUT_CDY_HASH = ".divoVAM.cdy.sha256"    # fingerprint of the .cdy the last build wrote

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

# Fields of src/cindyjs.json the cdyjs leaves out ("use" is not supported there)
CDYJS_SKIP_FIELDS = ["use"]

# Fields the build writes itself, so src/cindyjs.json must not contain them
RESERVED_FIELDS = ["scripts", "ports", "images"]

# Freehand drawing overlay, activated with ?draw
# The tool is a self contained JS overlay: it puts a second canvas on top of
# #CSCanvas and draws there. Deployed as a separate file next to the HTML.
FREEHAND_SRC = "src/js/freehand-drawing.js"   # relative to the repo root
FREEHAND_URL = "freehand-drawing.js"          # how the HTML references it

# Source tree, relative to the repo root
REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC_DIR = "src"
SRC_MANIFEST = "manifest.json"
SRC_CONFIG = "cindyjs.json"
SRC_TEMPLATE = "template.html"
SRC_BUILD = "BUILD"
SRC_CONSTRUCTION = "construction.cdy"
SRC_SCRIPTS = "cindyscript"         # one folder per Cinderella event
SRC_IMAGES = "resources/images"
SCRIPT_EXT = ".cindyscript"         # ".cs" inside the archive

# Placeholders in src/template.html, written as {{name}}
TEMPLATE_FIELDS = ["build", "scripts", "config", "images"]

# Media types of the images, needed for the data URIs in the HTML
IMAGE_TYPES = {
    ".png"  : "image/png",
    ".jpg"  : "image/jpeg",
    ".jpeg" : "image/jpeg",
    ".gif"  : "image/gif",
}

# What a .cdy written by the build carries besides the sources. Cinderella
# writes "[B@<hex>" into certificate.bin (a Java byte array printed by
# mistake) and never reads it back, so any content does.
CDY_COMMENT = (b"Construction created with Cinderella (http://cinderella.de)\n"
               b"Created with Cinderella - see http://cinderella.de")
CDY_CERTIFICATE = b"[B@0\n"

# Characters Windows does not allow in file names. Script labels become file
# names, so they must not contain any of these.
FORBIDDEN_CHARS = '<>:"/\\|?*'

# Header lines of construction.cdy that change on every save, even when the
# construction itself did not. Ignored when comparing.
VOLATILE_HEADERS = ("//Cindy-", "//Created on:", "//For:")


# ==========================================================================
# Files and names
# ==========================================================================
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


# --- 2. Check all script names of a manifest or an archive. ---
def name_problems(events):
    """Return the problems of {event: [label, ...]} as file names, empty if none."""

    problems = []

    for event, labels in events.items():
        reason = unsafe_name(event)
        if reason:
            problems.append("%s: %s" % (event, reason))

        # Labels that only differ in case end up as the same file on
        # case insensitive file systems (Windows, macOS)
        seen = set()
        for label in labels:
            reason = unsafe_name(label)
            if reason:
                problems.append("%s / %s: %s" % (event, label, reason))
            elif label.lower() in seen:
                problems.append("%s / %s: used twice" % (event, label))
            seen.add(label.lower())

    return problems


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

    # Bytes, not text: keeps line endings exactly as they are
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)


# --- 4. Remove files that are not wanted (anymore). ---
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


# ==========================================================================
# Reading the source tree
# ==========================================================================
# The source tree holds one plain text file per Cinderella sub script:
#
#     src/manifest.json                              order of the sub scripts
#     src/cindyscript/<event>/<label>.cindyscript    one per sub script
#     src/cindyjs.json                               CindyJS settings
#     src/template.html                              the standalone page
#     src/construction.cdy                           Cinderella construction
#     src/resources/images/<name>                    images
#     src/js/freehand-drawing.js                     pen overlay
#     src/BUILD                                      build counter
#
# Event folders and labels are the ones Cinderella shows. The label doubles
# as the file name, so the manifest only has to hold the order.

# --- 1. Read the scripts in manifest order. ---
def read_scripts(src):
    """Return {event: [(label, source), ...]} in the order of the manifest.

    Exits if manifest and files disagree: a script missing in the manifest
    would silently be left out, a listed one without file breaks the build.
    """

    path = src / SRC_MANIFEST

    # Load manifest, exit if it is no valid JSON.
    try:
        manifest = json.loads(path.read_text(encoding="utf-8"))
    except ValueError as e:
        sys.exit("ERROR: %s is no valid JSON: %s" % (path, e))

    # Has to map every event to a list of labels, else --> exit.
    if not (isinstance(manifest, dict) and all(
            isinstance(labels, list) and all(isinstance(l, str) for l in labels)
            for labels in manifest.values())):
        sys.exit("ERROR: %s has to map every event to a list of labels." % path)

    problems = name_problems(manifest)
    events, listed = {}, set()

    # Every listed script needs a file
    for event, labels in manifest.items():
        chunks = []
        for label in labels:
            file = src / SRC_SCRIPTS / event / (label + SCRIPT_EXT)
            listed.add(file)
            if not file.is_file():
                problems.append("in the manifest, but no file: %s" % file.relative_to(src))
                continue
            chunks.append((label, file.read_bytes().decode("utf-8")))
        events[event] = chunks

    # Every script file needs to be listed
    for file in sorted((src / SRC_SCRIPTS).rglob("*" + SCRIPT_EXT)):
        if file not in listed:
            problems.append("file, but not in the manifest: %s" % file.relative_to(src))

    # Any problems --> exit.
    if problems:
        sys.exit("ERROR: manifest and scripts disagree:\n  " + "\n  ".join(problems))

    return events


# --- 2. Read the CindyJS settings. ---
def read_config(src):
    """Return the settings in src/cindyjs.json as dict, in file order."""

    path = src / SRC_CONFIG

    # Load config, exit if it is no valid JSON.
    try:
        config = json.loads(path.read_text(encoding="utf-8"))
    except ValueError as e:
        sys.exit("ERROR: %s is no valid JSON: %s" % (path, e))

    # Has to be an object, else --> exit.
    if not isinstance(config, dict):
        sys.exit("ERROR: %s has to hold a JSON object." % path)

    # Fields the build writes itself would appear twice --> exit.
    clash = [f for f in RESERVED_FIELDS if f in config]
    if clash:
        sys.exit("ERROR: %s must not contain %s, the build writes them itself."
                 % (path, ", ".join(clash)))

    return config


# --- 3. Read the images. ---
def read_images(src):
    """Return {file name: bytes} of all images, sorted by name. Hidden files are skipped."""

    folder = src / SRC_IMAGES
    images, problems = {}, []

    # No folder --> no images.
    if not folder.is_dir():
        return images

    for path in sorted(folder.iterdir()):
        if path.name.startswith(".") or not path.is_file():
            continue

        # Unknown type --> can not become a data URI.
        if path.suffix.lower() not in IMAGE_TYPES:
            problems.append("%s: unknown image type" % path.name)
            continue

        images[path.name] = path.read_bytes()

    # Any problems --> exit.
    if problems:
        sys.exit("ERROR: in %s:\n  %s" % (folder, "\n  ".join(problems)))

    return images


# --- 4. Get the next build number. ---
def next_build_number(src):
    """Return the number in src/BUILD plus one."""

    path = src / SRC_BUILD

    try:
        return int(path.read_text(encoding="utf-8").strip()) + 1
    except ValueError:
        sys.exit("ERROR: %s has to hold a single number." % path)


# ==========================================================================
# Assembling the scripts for CindyJS
# ==========================================================================
# --- 1. Join the sub scripts of one event. ---
def assemble(chunks):
    """Return the sub scripts of one event as a single script.

    Same layout Cinderella uses in its HTML export: every sub script is
    preceded by its label as a comment and followed by a lone ";", so a sub
    script without a closing ";" can not run into the next one.
    """
    return "\n" + "".join("//%s\n%s\n;\n" % (label, source) for label, source in chunks) + "\n"


# --- 2. One script per CindyJS event. ---
def cindyjs_scripts(events):
    """Return {cdyjs key: script} for all events CindyJS knows."""

    scripts = {}

    for event, chunks in events.items():
        # Get CindyJS event name from Cinderella event name
        key = EVENT_MAP.get(event)

        # If CindyJS does not know the event print WARNING and continue
        if key is None:
            print("  WARNING: CindyJS has no event '%s' - only in the .cdy" % event)
            continue

        scripts[key] = assemble(chunks)

    return scripts


# ==========================================================================
# Writing JS
# ==========================================================================
# --- 1. Object keys. ---
def js_key(key):
    """Return key as JS object key, without quotes where possible."""
    return key if re.match(r"^[A-Za-z_$][A-Za-z0-9_$]*$", key) else json.dumps(key, ensure_ascii=False)


# --- 2. Values. ---
def js_literal(value, indent="") -> str:   # annotated: the type checker can not infer it through the recursion
    """Return value as JS source in the style of Cinderella's export.

    Objects get one entry per line, lists stay on one line, everything else
    is written as JSON (which is valid JS).
    """

    if isinstance(value, dict):
        if not value:
            return "{}"
        inner = indent + "  "
        entries = ["%s%s: %s" % (inner, js_key(k), js_literal(v, inner)) for k, v in value.items()]
        return "{\n" + ",\n".join(entries) + "\n" + indent + "}"

    if isinstance(value, list):
        return "[" + ", ".join(js_literal(v, indent) for v in value) + "]"

    return json.dumps(value, ensure_ascii=False)


# --- 3. Escape all the things. ---
def esc_template_literal(s):
    """Escape for a JS template literal."""
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


# ==========================================================================
# Building the standalone HTML
# ==========================================================================
def build_html(template, scripts, config, images, stamp):
    """Return src/template.html with its placeholders filled in."""

    # Every placeholder has to be there exactly once, else --> exit.
    for field in TEMPLATE_FIELDS:
        if template.count("{{%s}}" % field) != 1:
            sys.exit("ERROR: %s has to contain {{%s}} exactly once." % (SRC_TEMPLATE, field))

    # A script containing "</script" would end its block early --> exit.
    for key, source in scripts.items():
        if "</script" in source.lower():
            sys.exit("ERROR: the %s script contains '</script', which would end it early in the HTML." % key)

    # Script blocks, one per event. CindyJS finds them through scripts: "cs*".
    blocks = "\n".join('<script id="cs%s" type="text/x-cindyscript">%s</script>' % (key, source)
                       for key, source in scripts.items())

    # Settings from src/cindyjs.json, one field per line, each followed by a comma
    fields = "\n".join("  %s: %s," % (js_key(field), js_literal(value, "  "))
                       for field, value in config.items())

    # Images as data URIs, so the page needs no image files next to it
    entries = ['    "%s": "data:%s;base64,%s"' % (name, IMAGE_TYPES[pathlib.Path(name).suffix.lower()],
                                                   base64.b64encode(data).decode("ascii"))
               for name, data in images.items()]
    images_js = "{\n" + ",\n".join(entries) + "\n  }"

    values = {"build": stamp, "scripts": blocks, "config": fields, "images": images_js}

    # Replace in one pass, so a placeholder inside a script stays untouched
    return re.sub(r"\{\{(\w+)\}\}",
                  lambda m: values.get(m.group(1), m.group(0)), template)


# ==========================================================================
# Building cdyjs file for use in divomath
# ==========================================================================
def build_cdyjs(scripts, config, icons, img_base, rect, stamp):
    out = ["() => ({ // ***build %s***" % stamp]

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

    # --- settings from src/cindyjs.json ----------------------------------
    for field, value in config.items():
        if field in CDYJS_SKIP_FIELDS:
            continue
        out.append("%s: %s," % (js_key(field), js_literal(value)))

    # --- ports and images ------------------------------------------------
    out.append("ports: [{")
    out.append('  id: "CSCanvas",')
    out.append("  transform: [{visibleRect: [%s]}]," % ", ".join(str(v) for v in rect))
    out.append('  background: "rgb(255,255,255)"')
    out.append("}],")
    out.append("images: {")
    out.append(",\n".join('    "%s": "%s%s"' % (i, img_base, i) for i in icons))
    out.append("  }")

    out.append("});")
    return "\n".join(out)


# ==========================================================================
# Building the Cinderella file
# ==========================================================================
# --- 1. Encode names like Cinderella does. ---
def java_url_encode(name):
    """Return name encoded like Java's URLEncoder, which Cinderella uses for labels.

    Letters, digits and ".-*_" stay, space becomes "+", every other byte of
    the UTF-8 encoding becomes %XX. Python's quote_plus differs in "~" and "*".
    """

    out = []
    for b in name.encode("utf-8"):
        c = chr(b)
        if b < 128 and (c.isalnum() or c in ".-*_"):
            out.append(c)
        elif c == " ":
            out.append("+")
        else:
            out.append("%%%02X" % b)

    return "".join(out)


# --- 2. Write the archive. ---
def build_cdy(path, events, construction, images):
    """Write the sources as Cinderella archive, laid out the way Cinderella does it."""

    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.comment = CDY_COMMENT

        # Construction and certificate first, like Cinderella
        z.writestr("private/de.cinderella/construction.cdy", construction)
        z.writestr("private/de.cinderella/certificate.bin", CDY_CERTIFICATE)

        # Sub scripts, numbered by their position within the event. Cinderella
        # leaves the event folder as it is and only encodes the label.
        for event, chunks in events.items():
            for n, (label, source) in enumerate(chunks):
                name = "private/de.cinderella/scripts/%s/%d/%s.cs" % (event, n, java_url_encode(label))
                z.writestr(name, source.encode("utf-8"))

        # Images last
        for name, data in images.items():
            z.writestr("resources/images/" + name, data)


# --- 3. Notice changes made in Cinderella. ---
def fingerprint(path):
    """Return the SHA-256 of a file."""
    return hashlib.sha256(path.read_bytes()).hexdigest()


def cdy_changed(out_dir):
    """True if the .cdy in out_dir is not the one the last build wrote."""

    cdy, stored = out_dir / OUT_CDY, out_dir / OUT_CDY_HASH

    # No .cdy --> nothing that could get lost.
    if not cdy.is_file():
        return False

    # A .cdy without fingerprint did not come from the build, so it counts as changed
    return not stored.is_file() or stored.read_text(encoding="utf-8").strip() != fingerprint(cdy)


def remember_cdy(out_dir):
    """Store the fingerprint of the .cdy in out_dir as the one the build knows."""
    (out_dir / OUT_CDY_HASH).write_text(fingerprint(out_dir / OUT_CDY) + "\n", encoding="utf-8")


# ==========================================================================
# Unpacking a .cdy into the source tree
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


# --- 2. Strip the save stamp from construction.cdy. ---
def strip_volatile(text):
    """Return the lines of construction.cdy without the ones that change on every save."""
    return [l for l in text.splitlines() if not l.startswith(VOLATILE_HEADERS)]


# --- 3. Ask git about uncommitted work. ---
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


# --- 4. Unpack. ---
def unpack(cdy_path, src):
    """Mirror the archive into the source tree. Return the list of changes."""

    archive = read_archive(cdy_path)

    # No construction --> probably not a Cinderella file.
    if archive["construction"] is None:
        sys.exit("ERROR: no construction.cdy inside the archive - not a Cinderella file?")

    # Labels become file names. Find the ones that would not work on every
    # platform or would end up as the same file.
    problems = name_problems({event: [label for label, _ in chunks]
                              for event, chunks in archive["events"].items()})

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


# --- 5. Command line for unpacking. ---
def unpack_main(argv):
    # Parse args.
    ap = argparse.ArgumentParser(prog="build.py unpack",
                                 description="copy scripts, construction and images of a .cdy into src/")
    ap.add_argument("cdy", nargs="?", default=str(REPO_ROOT / OUT_DIR / OUT_CDY),
                    help="Cinderella file to unpack (default: out/divoVAM.cdy)")
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

    # The .cdy of a build is taken over now, so the next build may replace it.
    if cdy_path.name == OUT_CDY and (cdy_path.parent / OUT_CDY_HASH).is_file():
        remember_cdy(cdy_path.parent)

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
    ap.add_argument("--out", default=str(REPO_ROOT / OUT_DIR),
                    help="output directory (default: out/ in the repo)")
    ap.add_argument("--img-base", default=DEFAULT_IMG_BASE, help="base URL for the icons")
    ap.add_argument("--rect", default=None, help="visibleRect for the cdyjs, e.g. 0,18,24,0")
    ap.add_argument("--force", action="store_true",
                    help="build even if out/divoVAM.cdy was changed in Cinderella")
    a = ap.parse_args()

    # Setup path names.
    src, out_dir = REPO_ROOT / SRC_DIR, pathlib.Path(a.out)
    freehand = REPO_ROOT / FREEHAND_SRC

    # Check if files exist, else --> exit.
    for p in [src / SRC_MANIFEST, src / SRC_CONFIG, src / SRC_TEMPLATE,
              src / SRC_CONSTRUCTION, src / SRC_BUILD, freehand]:
        if not p.is_file():
            sys.exit("File not found: %s" % p)

    # Try rect configuration.
    rect = DIVOMATH_RECT
    if a.rect:
        try:
            rect = [float(x) if "." in x else int(x) for x in a.rect.split(",")]
            if len(rect) != 4:
                raise ValueError
        except ValueError:
            sys.exit("ERROR: --rect needs four numbers, e.g. 0,18,24,0")

    # Changes made in Cinderella would be overwritten --> exit.
    if not a.force and cdy_changed(out_dir):
        sys.exit("ERROR: %s was changed since the last build (in Cinderella?).\n"
                 "Take the changes over into src/ with:  python3 tools/build.py unpack\n"
                 "or throw them away with --force." % (out_dir / OUT_CDY))

    # Read the sources.
    events = read_scripts(src)
    scripts = cindyjs_scripts(events)
    config = read_config(src)
    images = read_images(src)
    template = (src / SRC_TEMPLATE).read_text(encoding="utf-8")
    construction = (src / SRC_CONSTRUCTION).read_bytes()

    # One stamp for every output of this build.
    build_no = next_build_number(src)
    now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3]
    stamp = "%d | %sZ" % (build_no, now)

    # Build. Everything that can fail runs before the first file is written.
    html = build_html(template, scripts, config, images, stamp)
    cdyjs = build_cdyjs(scripts, config, list(images), a.img_base, rect, stamp)

    # Write to files.
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / OUT_HTML).write_bytes(html.encode("utf-8"))
    (out_dir / FREEHAND_URL).write_bytes(freehand.read_bytes())
    (out_dir / OUT_CDYJS).write_bytes(cdyjs.encode("utf-8"))

    # Icons for divomath, without leftovers of earlier builds
    img_dir, keep = out_dir / OUT_IMAGES, set()
    for name, data in images.items():
        keep.add(img_dir / name)
        write_if_changed(img_dir / name, data, [])
    remove_others(img_dir, keep, None, [])

    build_cdy(out_dir / OUT_CDY, events, construction, images)
    remember_cdy(out_dir)

    # Count the build only once everything is written.
    (src / SRC_BUILD).write_text("%d\n" % build_no, encoding="utf-8")

    # Print some results.
    print("build %d" % build_no)
    print("  html  : %s" % (out_dir / OUT_HTML))
    print("  plus  : %s" % FREEHAND_URL)
    print("  cdyjs : %s" % (out_dir / OUT_CDYJS))
    print("  scripts : %s" % ", ".join(sorted(scripts)))
    print("  img   : %s/  (%d icons)" % (img_dir, len(images)))
    print("  cdy   : %s" % (out_dir / OUT_CDY))


if __name__ == "__main__":
    main()
