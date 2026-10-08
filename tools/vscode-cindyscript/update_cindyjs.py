#!/usr/bin/env python3
"""
Update the CindyJS parts of the CindyScript extension.

The extension checks scripts with the parser of CindyJS itself and has to
know which functions CindyJS has built in. Both come from the CindyJS sources
at the commit the page loads (cindyjs.org/dist/v0.8, see the header of its
Cindy.js). Run this again after switching to another CindyJS version:

    python3 tools/vscode-cindyscript/update_cindyjs.py [COMMIT]

Writes, next to this script:

    lib/Parser.js           the CindyJS parser, unchanged apart from a header
    lib/LICENSE-CindyJS     its license (Apache 2.0)
    lib/builtins.json       {name: [number of arguments]}, "*" for any number

and the list of built-ins inside syntaxes/cindyscript.tmLanguage.json.
Needs an internet connection (GitHub).
"""

import argparse
import json
import pathlib
import re
import sys
import urllib.request

HERE = pathlib.Path(__file__).resolve().parent

# Commit cindyjs.org/dist/v0.8 is built from (see the header of its Cindy.js)
DEFAULT_COMMIT = "f52f219b1f17269d569b46426b6cee57269e9aae"

# Where the sources come from
REPO = "CindyJS/CindyJS"
TREE_URL = "https://api.github.com/repos/%s/git/trees/%s?recursive=1"
RAW_URL = "https://raw.githubusercontent.com/%s/%s/%s"

# Output files, relative to this script
OUT_PARSER = "lib/Parser.js"
OUT_LICENSE = "lib/LICENSE-CindyJS"
OUT_BUILTINS = "lib/builtins.json"
GRAMMAR = "syntaxes/cindyscript.tmLanguage.json"

# Built-ins that steer the program flow. The grammar highlights them on their
# own, so they are left out of its list of other built-ins.
CONTROL = ["if", "while", "repeat", "forall", "apply", "select", "regional", "local", "release"]

# Helpers of the evaluator a script can not call by name (besides every name with "_")
INTERNAL = ["genlist", "genjson"]


# ==========================================================================
# Download
# ==========================================================================
# --- 1. One file. ---
def fetch(url):
    """Return the content of url as text."""

    # GitHub's API refuses requests without a User-Agent
    request = urllib.request.Request(url, headers={"User-Agent": "divoVAM update_cindyjs.py"})

    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            return response.read().decode("utf-8")
    except OSError as e:
        sys.exit("ERROR: could not download %s: %s" % (url, e))


# --- 2. All script sources of a commit. ---
def source_files(commit):
    """Return {path: text} of all .js and .ts files below src/ at commit."""

    tree = json.loads(fetch(TREE_URL % (REPO, commit)))

    # Unknown commit or rate limit --> exit.
    if "tree" not in tree:
        sys.exit("ERROR: no file tree for %s: %s" % (commit, tree.get("message", tree)))

    paths = [entry["path"] for entry in tree["tree"]
             if entry["type"] == "blob" and entry["path"].startswith("src/")
             and entry["path"].endswith((".js", ".ts"))]

    return {path: fetch(RAW_URL % (REPO, commit, path)) for path in sorted(paths)}


# ==========================================================================
# Built-in functions
# ==========================================================================
def builtins_from(sources):
    """Return {name: sorted list of argument counts, "*" for any number}.

    CindyJS registers its functions as evaluator.<name>$<arguments> and a few
    that take any number of arguments as evaluator.<name>. Some are created in
    loops by helper functions, those are collected by their helper's name.
    """

    functions = {}

    def add(name, arity):
        functions.setdefault(name.lower(), set()).add(arity)

    for text in sources.values():
        # evaluator.drawtext$2 = ...
        for name, arity in re.findall(r"evaluator\.([A-Za-z]\w*)\$(\d+)\s*=(?!=)", text):
            add(name, int(arity))

        # evaluator.regional = ...  (any number of arguments)
        for name in re.findall(r"evaluator\.([A-Za-z]\w*)\s*=(?!=)", text):
            add(name, "*")

        # genericListMathGen("sum", ...) creates sum$1 to sum$3
        for name in re.findall(r'genericListMathGen\("(\w+)"', text):
            for arity in (1, 2, 3):
                add(name, arity)

        # recursiveGen("abs") creates abs$1
        for name in re.findall(r'recursiveGen\("(\w+)"', text):
            add(name, 1)

    # Leave out what a script can not call
    for name in list(functions):
        if "_" in name or name in INTERNAL:
            del functions[name]

    # Numbers first, "*" last
    return {name: sorted(arities, key=lambda a: (a == "*", a if a != "*" else 0))
            for name, arities in sorted(functions.items())}


# ==========================================================================
# Writing the extension files
# ==========================================================================
# --- 1. Parser with a header. ---
def parser_with_header(text, commit):
    """Return Parser.js with a header saying where it comes from."""

    header = ("// CindyScript parser of CindyJS, unchanged apart from this header.\n"
              "// Source: https://github.com/%s/blob/%s/src/js/libcs/Parser.js\n"
              "// License: Apache License 2.0, see LICENSE-CindyJS next to this file.\n"
              "// Written by update_cindyjs.py - run that instead of editing this file.\n"
              % (REPO, commit))
    return header + text


# --- 2. Built-ins in the grammar. ---
def grammar_with_builtins(grammar, names):
    """Return the grammar text with the list of built-ins replaced.

    Only the "match" of the "builtins" entry changes, so the hand written
    formatting of the rest stays as it is.
    """

    # Longest first, so no name stops at a shorter one it starts with
    names = sorted((n for n in names if n not in CONTROL), key=lambda n: (-len(n), n))
    pattern = "(?i)(?<![\\p{L}\\p{N}'])(?:%s)(?=\\s*\\()" % "|".join(names)

    # The value as it has to appear inside the JSON file
    value = json.dumps(pattern, ensure_ascii=False)[1:-1]

    new, count = re.subn(r'("builtins":\s*\{[^{}]*?"match":\s*")[^"\n]*(")',
                         lambda m: m.group(1) + value + m.group(2), grammar, count=1, flags=re.S)

    # Entry not found --> exit.
    if count != 1:
        sys.exit("ERROR: no \"builtins\" entry with a \"match\" in %s" % GRAMMAR)

    # Still valid JSON, else --> exit.
    json.loads(new)

    return new


# ==========================================================================
# Main
# ==========================================================================
def main():
    # Parse args.
    ap = argparse.ArgumentParser(description="update the CindyJS parts of the CindyScript extension")
    ap.add_argument("commit", nargs="?", default=DEFAULT_COMMIT, help="CindyJS commit (default: the one of v0.8)")
    a = ap.parse_args()

    # Download.
    print("CindyJS %s" % a.commit)
    sources = source_files(a.commit)
    license_text = fetch(RAW_URL % (REPO, a.commit, "LICENSE"))

    # Parser missing --> exit.
    parser = sources.get("src/js/libcs/Parser.js")
    if parser is None:
        sys.exit("ERROR: src/js/libcs/Parser.js not found at %s" % a.commit)

    builtins = builtins_from(sources)

    # Write to files.
    (HERE / OUT_PARSER).parent.mkdir(parents=True, exist_ok=True)
    (HERE / OUT_PARSER).write_bytes(parser_with_header(parser, a.commit).encode("utf-8"))
    (HERE / OUT_LICENSE).write_bytes(license_text.encode("utf-8"))

    data = {"source": "https://github.com/%s/tree/%s" % (REPO, a.commit), "functions": builtins}
    (HERE / OUT_BUILTINS).write_bytes((json.dumps(data, indent=1) + "\n").encode("utf-8"))

    grammar = (HERE / GRAMMAR).read_text(encoding="utf-8")
    (HERE / GRAMMAR).write_bytes(grammar_with_builtins(grammar, builtins).encode("utf-8"))

    # Print some results.
    print("  sources   : %d files" % len(sources))
    print("  built-ins : %d functions" % len(builtins))
    print("  written   : %s, %s, %s, %s" % (OUT_PARSER, OUT_LICENSE, OUT_BUILTINS, GRAMMAR))


if __name__ == "__main__":
    main()
