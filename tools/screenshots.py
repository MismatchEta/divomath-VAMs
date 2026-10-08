#!/usr/bin/env python3
"""
Screenshot comparison for the divoVAM widgets.

Opens out/divoVAM.html once per widget in a headless Firefox, takes a
screenshot and compares it pixel by pixel with a stored reference. Meant as
a last look before an upload: did a change alter a widget it should not have?

Usage:

    python3 tools/screenshots.py save       store references, e.g. right after an upload
    python3 tools/screenshots.py compare    compare the current build with them

compare keeps a differing shot as <widget>.new.png next to its reference, so
both can be looked at side by side. Exit code 1 if anything differs.

Needs Firefox and an internet connection (the page loads CindyJS from
cindyjs.org). Widgets that animate on their own can differ from shot to shot.

Options:
    --html FILE       page to open (default: out/divoVAM.html)
    --vam A,B         widgets to shoot (default: every "[VAM] <name>" script in src/manifest.json)
    --query Q         extra URL parameters, e.g. "rect=classic" or "full&draw"
    --dir DIR         where the references are kept (default: .local/screenshots)
    --size W,H        browser window in px (default: 900,560)
    --firefox PATH    Firefox binary (default: firefox on the PATH)
"""

import argparse
import json
import pathlib
import re
import shutil
import struct
import subprocess
import sys
import tempfile
import zlib

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent

# Defaults, relative to the repo root
DEFAULT_HTML = "out/divoVAM.html"
DEFAULT_DIR = ".local/screenshots"
DEFAULT_SIZE = "900,560"
MANIFEST = "src/manifest.json"

# Finished widgets only, "[_VAM]" marks work in progress
VAM_LABEL = re.compile(r"^\[VAM\] (\S+)$")

# Seconds Firefox gets for one shot
TIMEOUT = 120


# ==========================================================================
# Taking screenshots
# ==========================================================================
# --- 1. Which widgets. ---
def widgets_from_manifest():
    """Return the names of all finished widgets, in manifest order."""

    manifest = json.loads((REPO_ROOT / MANIFEST).read_text(encoding="utf-8"))

    names = []
    for labels in manifest.values():
        for label in labels:
            m = VAM_LABEL.match(label)
            if m:
                names.append(m.group(1))

    return names


# --- 2. File name of a shot. ---
def shot_name(vam, query):
    """Return the base file name for a widget, including the extra URL parameters."""

    # Without extra parameters just the widget
    if not query:
        return vam

    # Keep the parameters readable, but safe as a file name
    return "%s__%s" % (vam, re.sub(r"[^A-Za-z0-9=,.-]+", "_", query))


# --- 3. One screenshot. ---
def shoot(firefox, profile, url, target, size):
    """Take a screenshot of url with headless Firefox. Return True on success."""

    # Remove old shot, so a failed run can not pass for a fresh one
    target.unlink(missing_ok=True)

    # Own profile and --no-remote: does not touch a Firefox that is already open
    try:
        subprocess.run([firefox, "--headless", "--no-remote", "--profile", str(profile),
                        "--window-size=%s" % size, "--screenshot", str(target), url],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=TIMEOUT)
    except subprocess.TimeoutExpired:
        return False

    return target.is_file()


# ==========================================================================
# Comparing PNG files
# ==========================================================================
# --- 1. Read the pixels of a PNG. ---
def png_pixels(path):
    """Return (width, height, bytes per pixel, rows) with the PNG filters undone.

    Only what Firefox writes is supported: 8 bit RGB or RGBA, not interlaced.
    """

    data = path.read_bytes()

    # No PNG signature --> exit.
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        sys.exit("ERROR: %s is no PNG file." % path)

    # Walk through the chunks, collect header and image data
    pos, idat, header = 8, [], None
    while pos < len(data):
        length, kind = struct.unpack(">I4s", data[pos:pos + 8])
        body = data[pos + 8:pos + 8 + length]
        if kind == b"IHDR":
            header = struct.unpack(">IIBBBBB", body)
        elif kind == b"IDAT":
            idat.append(body)
        pos += 12 + length

    width, height, depth, colortype, _, _, interlace = header

    # Anything else than Firefox' output --> exit.
    if depth != 8 or colortype not in (2, 6) or interlace:
        sys.exit("ERROR: %s uses a PNG format this script does not read." % path)

    bpp = 3 if colortype == 2 else 4
    stride = width * bpp
    raw = zlib.decompress(b"".join(idat))

    # Undo the filter of every row (PNG spec, section 9)
    rows, prev = [], bytearray(stride)
    for y in range(height):
        start = y * (stride + 1)
        kind, line = raw[start], bytearray(raw[start + 1:start + 1 + stride])

        if kind == 1:   # Sub
            for i in range(bpp, stride):
                line[i] = (line[i] + line[i - bpp]) & 255
        elif kind == 2: # Up
            for i in range(stride):
                line[i] = (line[i] + prev[i]) & 255
        elif kind == 3: # Average
            for i in range(stride):
                left = line[i - bpp] if i >= bpp else 0
                line[i] = (line[i] + (left + prev[i]) // 2) & 255
        elif kind == 4: # Paeth
            for i in range(stride):
                a = line[i - bpp] if i >= bpp else 0
                b = prev[i]
                c = prev[i - bpp] if i >= bpp else 0
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                line[i] = (line[i] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255

        rows.append(bytes(line))
        prev = line

    return width, height, bpp, rows


# --- 2. Compare two shots. ---
def compare(reference, shot):
    """Return None if both images show the same pixels, else a description."""

    # Same bytes --> same pixels, no need to decode.
    if reference.read_bytes() == shot.read_bytes():
        return None

    w1, h1, bpp1, rows1 = png_pixels(reference)
    w2, h2, bpp2, rows2 = png_pixels(shot)

    # Different size --> nothing to compare pixel by pixel.
    if (w1, h1) != (w2, h2):
        return "size %dx%d instead of %dx%d" % (w2, h2, w1, h1)

    # Count differing pixels and where they are
    count, xs, ys = 0, [], []
    for y, (r1, r2) in enumerate(zip(rows1, rows2)):
        if r1 == r2 and bpp1 == bpp2:
            continue
        for x in range(w1):
            if r1[x * bpp1:x * bpp1 + 3] != r2[x * bpp2:x * bpp2 + 3]:
                count += 1
                xs.append(x)
                ys.append(y)

    # Only the alpha channel or the encoding differs
    if not count:
        return None

    return "%d pixels (%.2f %%) in x %d..%d, y %d..%d" % (
        count, 100.0 * count / (w1 * h1), min(xs), max(xs), min(ys), max(ys))


# ==========================================================================
# Main
# ==========================================================================
def main():
    # Parse args.
    ap = argparse.ArgumentParser(description="screenshot comparison of the divoVAM widgets")
    ap.add_argument("mode", choices=["save", "compare"],
                    help="save: store references, compare: compare with them")
    ap.add_argument("--html", default=str(REPO_ROOT / DEFAULT_HTML), help="page to open")
    ap.add_argument("--vam", default=None, help="widgets to shoot, e.g. thales,strapwork")
    ap.add_argument("--query", default="", help='extra URL parameters, e.g. "rect=classic"')
    ap.add_argument("--dir", default=str(REPO_ROOT / DEFAULT_DIR), help="where the references are kept")
    ap.add_argument("--size", default=DEFAULT_SIZE, help="browser window in px, e.g. 900,560")
    ap.add_argument("--firefox", default=shutil.which("firefox"), help="Firefox binary")
    a = ap.parse_args()

    # Setup path names.
    html, folder = pathlib.Path(a.html).resolve(), pathlib.Path(a.dir)

    # Check what is needed, else --> exit.
    if not html.is_file():
        sys.exit("File not found: %s - run tools/build.py first." % html)
    if not a.firefox:
        sys.exit("ERROR: Firefox not found, pass it with --firefox PATH.")
    if not re.match(r"^\d+,\d+$", a.size):
        sys.exit("ERROR: --size needs two numbers, e.g. 900,560")

    vams = a.vam.split(",") if a.vam else widgets_from_manifest()
    query = a.query.lstrip("?&")
    folder.mkdir(parents=True, exist_ok=True)

    print("%s: %s" % (a.mode, html))
    problems = 0

    # One profile for the whole run, removed afterwards
    with tempfile.TemporaryDirectory() as profile:
        for vam in vams:
            name = shot_name(vam, query)
            reference, fresh = folder / (name + ".png"), folder / (name + ".new.png")
            url = html.as_uri() + "?vam=" + vam + ("&" + query if query else "")

            # --- save: the shot becomes the reference ---
            if a.mode == "save":
                ok = shoot(a.firefox, profile, url, reference, a.size)
                fresh.unlink(missing_ok=True)
                print("  %-16s %s" % (vam, "saved" if ok else "FAILED"))
                problems += not ok
                continue

            # --- compare: shoot next to the reference ---
            if not reference.is_file():
                print("  %-16s no reference, run save first" % vam)
                problems += 1
                continue

            if not shoot(a.firefox, profile, url, fresh, a.size):
                print("  %-16s FAILED" % vam)
                problems += 1
                continue

            difference = compare(reference, fresh)

            # Same --> the new shot is not needed.
            if difference is None:
                fresh.unlink()
                print("  %-16s same" % vam)
            else:
                print("  %-16s DIFFERENT: %s  ->  %s" % (vam, difference, fresh))
                problems += 1

    # Print some results.
    print("  references in %s" % folder)
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
