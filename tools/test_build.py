#!/usr/bin/env python3
"""
Tests for tools/build.py.

Usage:

    python3 tools/test_build.py

Every test copies tools/ and src/ into a temporary folder and builds there,
so src/BUILD and out/ of the repo stay untouched. The tests run on the real
sources; error cases come from damaging the copy on purpose.
"""

import base64
import json
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
import urllib.parse
import zipfile

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent

# The module under test, for its constants and small helpers.
# No __pycache__ next to it, that would only clutter the repo.
sys.dont_write_bytecode = True
sys.path.insert(0, str(REPO_ROOT / "tools"))
import build


# ==========================================================================
# Helpers
# ==========================================================================
# --- 1. Read the sources without going through build.py. ---
def expected_scripts(src):
    """Return {event: script} as the build should assemble it.

    Read straight from manifest and files, in the layout of Cinderella's
    HTML export: label as comment, source, a lone ";".
    """

    manifest = json.loads((src / build.SRC_MANIFEST).read_text(encoding="utf-8"))
    scripts = {}

    for event, labels in manifest.items():
        chunks = [(label, (src / build.SRC_SCRIPTS / event / (label + build.SCRIPT_EXT))
                   .read_bytes().decode("utf-8")) for label in labels]
        scripts[event] = "\n" + "".join("//%s\n%s\n;\n" % chunk for chunk in chunks) + "\n"

    return scripts


# --- 2. All files below a folder. ---
def tree(folder):
    """Return {relative path: bytes} of all files below folder."""
    return {p.relative_to(folder).as_posix(): p.read_bytes()
            for p in sorted(folder.rglob("*")) if p.is_file()}


# --- 3. Change a .cdy the way Cinderella would. ---
def rewrite_cdy(path, change):
    """Rewrite the archive in place.

    change(name, data) returns the new (name, data) of an entry, or None to
    leave it out. Returning the arguments unchanged keeps the entry.
    """

    with zipfile.ZipFile(path) as z:
        entries = [(i.filename, z.read(i.filename)) for i in z.infolist()]
        comment = z.comment

    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.comment = comment
        for name, data in entries:
            new = change(name, data)
            if new:
                z.writestr(*new)


# --- 4. Name of a sub script inside the archive. ---
def archive_name(event, n, label):
    return "private/de.cinderella/scripts/%s/%d/%s.cs" % (event, n, build.java_url_encode(label))


# ==========================================================================
# Sandbox
# ==========================================================================
class Sandbox(unittest.TestCase):
    """Copy of tools/ and src/ in a temporary folder, removed after each test."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = pathlib.Path(self.tmp.name)

        shutil.copytree(REPO_ROOT / "tools", self.root / "tools",
                        ignore=shutil.ignore_patterns("__pycache__"))
        shutil.copytree(REPO_ROOT / build.SRC_DIR, self.root / build.SRC_DIR)

        self.src = self.root / build.SRC_DIR
        self.out = self.root / build.OUT_DIR
        self.manifest = json.loads((self.src / build.SRC_MANIFEST).read_text(encoding="utf-8"))

    def tearDown(self):
        self.tmp.cleanup()

    def run_build(self, *args):
        """Run the copied build.py with args, return the finished process."""
        return subprocess.run([sys.executable, str(self.root / "tools" / "build.py"), *args],
                              capture_output=True, text=True)

    def build(self, *args):
        """Run a build that has to succeed."""
        r = self.run_build(*args)
        self.assertEqual(r.returncode, 0, r.stderr)
        return r

    def build_fails(self, message, *args):
        """Run a build that has to fail with message, without counting it."""
        before = (self.src / build.SRC_BUILD).read_text(encoding="utf-8")
        r = self.run_build(*args)
        self.assertNotEqual(r.returncode, 0, r.stdout)
        self.assertIn(message, r.stderr)
        self.assertEqual((self.src / build.SRC_BUILD).read_text(encoding="utf-8"), before)
        return r

    def script_file(self, event, label):
        return self.src / build.SRC_SCRIPTS / event / (label + build.SCRIPT_EXT)

    def first_script(self):
        """Return (event, label) of the first sub script in the manifest."""
        event = next(iter(self.manifest))
        return event, self.manifest[event][0]

    def write_manifest(self):
        (self.src / build.SRC_MANIFEST).write_text(json.dumps(self.manifest, indent=2), encoding="utf-8")


# ==========================================================================
# Building
# ==========================================================================
class BuildTest(Sandbox):

    def test_writes_all_outputs_and_counts(self):
        before = int((self.src / build.SRC_BUILD).read_text(encoding="utf-8"))
        self.build()

        for name in [build.OUT_HTML, build.OUT_CDYJS, build.OUT_CDY, build.FREEHAND_URL]:
            self.assertTrue((self.out / name).is_file(), name)

        # Counter and stamps
        after = int((self.src / build.SRC_BUILD).read_text(encoding="utf-8"))
        self.assertEqual(after, before + 1)
        self.assertTrue((self.out / build.OUT_HTML).read_text(encoding="utf-8")
                        .startswith("<!-- build %d | " % after))
        self.assertIn("// ***build %d | " % after, (self.out / build.OUT_CDYJS).read_text(encoding="utf-8"))

    def test_scripts_complete_and_in_order(self):
        self.build()
        html = (self.out / build.OUT_HTML).read_text(encoding="utf-8")
        cdyjs = (self.out / build.OUT_CDYJS).read_text(encoding="utf-8")
        blocks = dict(re.findall(r'<script id="cs(\w+)" type="text/x-cindyscript">(.*?)</script>', html, re.S))

        for event, script in expected_scripts(self.src).items():
            key = build.EVENT_MAP[event]
            self.assertEqual(blocks[key], script, event)
            self.assertIn("`%s`" % build.esc_template_literal(script), cdyjs, event)

    def test_images_embedded_and_copied(self):
        self.build()
        html = (self.out / build.OUT_HTML).read_text(encoding="utf-8")
        cdyjs = (self.out / build.OUT_CDYJS).read_text(encoding="utf-8")
        embedded = dict(re.findall(r'"([^"]+)": "data:[^;]+;base64,([^"]+)"', html))
        images = tree(self.src / build.SRC_IMAGES)

        self.assertEqual(sorted(embedded), sorted(images))
        self.assertEqual(tree(self.out / build.OUT_IMAGES), images)
        for name, data in images.items():
            self.assertEqual(base64.b64decode(embedded[name]), data, name)
            self.assertIn('"%s": "%s%s"' % (name, build.DEFAULT_IMG_BASE, name), cdyjs)

    def test_no_placeholder_left(self):
        self.build()
        html = (self.out / build.OUT_HTML).read_text(encoding="utf-8")
        for field in build.TEMPLATE_FIELDS:
            self.assertNotIn("{{%s}}" % field, html)

    def test_cdy_round_trip(self):
        self.build()
        copy = self.root / "src-copy"
        self.build("unpack", str(self.out / build.OUT_CDY), "--src", str(copy), "--force")

        for folder in [build.SRC_SCRIPTS, build.SRC_IMAGES]:
            self.assertEqual(tree(copy / folder), tree(self.src / folder), folder)
        for name in [build.SRC_MANIFEST, build.SRC_CONSTRUCTION]:
            self.assertEqual((copy / name).read_bytes(), (self.src / name).read_bytes(), name)

    def test_cdy_layout_like_cinderella(self):
        self.build()
        with zipfile.ZipFile(self.out / build.OUT_CDY) as z:
            names = z.namelist()
            self.assertEqual(z.comment, build.CDY_COMMENT)

        self.assertEqual(names[:2], ["private/de.cinderella/construction.cdy",
                                     "private/de.cinderella/certificate.bin"])
        for event, labels in self.manifest.items():
            for n, label in enumerate(labels):
                self.assertIn(archive_name(event, n, label), names)


class BuildErrorTest(Sandbox):

    def test_file_not_in_manifest(self):
        event, _ = self.first_script()
        self.script_file(event, "[FUN] stray").write_text("// stray\n", encoding="utf-8")
        self.build_fails("file, but not in the manifest")

    def test_manifest_entry_without_file(self):
        self.script_file(*self.first_script()).unlink()
        self.build_fails("in the manifest, but no file")

    def test_forbidden_character_in_label(self):
        event, label = self.first_script()
        self.script_file(event, label).rename(self.script_file(event, label + "*"))
        self.manifest[event][0] = label + "*"
        self.write_manifest()
        self.build_fails("contains '*'")

    def test_label_used_twice(self):
        event, label = self.first_script()
        self.manifest[event].append(label.upper())
        self.write_manifest()
        self.build_fails("used twice")

    def test_invalid_manifest(self):
        (self.src / build.SRC_MANIFEST).write_text("{", encoding="utf-8")
        self.build_fails("is no valid JSON")

    def test_missing_placeholder(self):
        path = self.src / build.SRC_TEMPLATE
        path.write_text(path.read_text(encoding="utf-8").replace("{{images}}", "{}"), encoding="utf-8")
        self.build_fails("has to contain {{images}} exactly once")

    def test_closing_script_tag_in_script(self):
        path = self.script_file(*self.first_script())
        path.write_text(path.read_text(encoding="utf-8") + "// </script>\n", encoding="utf-8")
        self.build_fails("contains '</script'")

    def test_reserved_field_in_config(self):
        path = self.src / build.SRC_CONFIG
        config = json.loads(path.read_text(encoding="utf-8"))
        config["ports"] = []
        path.write_text(json.dumps(config), encoding="utf-8")
        self.build_fails("must not contain ports")


# ==========================================================================
# Changes made in Cinderella
# ==========================================================================
class CinderellaGuardTest(Sandbox):

    def change_in_cinderella(self):
        """Append a line to the first sub script of the built .cdy, return the line."""
        event, label = self.first_script()
        target, line = archive_name(event, 0, label), "// changed in Cinderella\n"
        rewrite_cdy(self.out / build.OUT_CDY,
                    lambda name, data: (name, data + line.encode("utf-8") if name == target else data))
        return line

    def test_changed_cdy_blocks_build(self):
        self.build()
        self.change_in_cinderella()
        self.build_fails("was changed since the last build")

    def test_unpack_takes_changes_over(self):
        self.build()
        line = self.change_in_cinderella()

        # --force: the sandbox is no git repository
        self.build("unpack", "--force")
        self.build()
        self.assertIn(line, (self.out / build.OUT_HTML).read_text(encoding="utf-8"))

    def test_force_throws_changes_away(self):
        self.build()
        line = self.change_in_cinderella()
        self.build("--force")
        self.assertNotIn(line, (self.out / build.OUT_HTML).read_text(encoding="utf-8"))


# ==========================================================================
# Unpacking
# ==========================================================================
class UnpackTest(Sandbox):

    def setUp(self):
        super().setUp()
        self.build()
        self.cdy = self.out / build.OUT_CDY

    def unpack(self, *args):
        return self.build("unpack", "--force", *args).stdout

    def test_second_run_changes_nothing(self):
        self.assertIn("no changes", self.unpack())

    def test_save_stamp_is_ignored(self):
        def restamp(name, data):
            if name.endswith("construction.cdy"):
                lines = data.decode("utf-8").split("\n")
                data = "\n".join(l.split(":")[0] + ": somewhere else" if l.startswith(build.VOLATILE_HEADERS)
                                 else l for l in lines).encode("utf-8")
            return name, data

        rewrite_cdy(self.cdy, restamp)
        self.assertIn("no changes", self.unpack())

    def test_detects_changed_and_removed_files(self):
        event, label = self.first_script()
        dropped_event = "Init"
        dropped = self.manifest[dropped_event][-2]
        image = sorted(tree(self.src / build.SRC_IMAGES))[0]

        def change(name, data):
            if name == archive_name(dropped_event, len(self.manifest[dropped_event]) - 2, dropped):
                return None
            if name == "resources/images/" + image:
                return None
            if name == archive_name(event, 0, label):
                return name, data + b"// changed\n"
            return name, data

        rewrite_cdy(self.cdy, change)
        out = self.unpack()

        self.assertIn("changed  %s/%s/%s%s" % (build.SRC_SCRIPTS, event, label, build.SCRIPT_EXT), out)
        self.assertIn("removed  %s/%s/%s%s" % (build.SRC_SCRIPTS, dropped_event, dropped, build.SCRIPT_EXT), out)
        self.assertIn("removed  %s/%s" % (build.SRC_IMAGES, image), out)
        self.assertIn("changed  %s" % build.SRC_MANIFEST, out)
        self.assertFalse(self.script_file(dropped_event, dropped).exists())

        manifest = json.loads((self.src / build.SRC_MANIFEST).read_text(encoding="utf-8"))
        self.assertNotIn(dropped, manifest[dropped_event])

    def test_rejects_unsafe_label(self):
        before = tree(self.src)
        with zipfile.ZipFile(self.cdy, "a") as z:
            z.writestr("private/de.cinderella/scripts/Init/99/%5BVAM*%5D+x.cs", "// x\n")

        r = self.run_build("unpack", "--force")
        self.assertNotEqual(r.returncode, 0)
        self.assertIn("contains '*'", r.stderr)
        self.assertEqual(tree(self.src), before)

    def test_rejects_label_used_twice(self):
        event, label = self.first_script()
        with zipfile.ZipFile(self.cdy, "a") as z:
            z.writestr(archive_name(event, 99, label), "// twice\n")

        r = self.run_build("unpack", "--force")
        self.assertNotEqual(r.returncode, 0)
        self.assertIn("used twice", r.stderr)

    @unittest.skipUnless(shutil.which("git"), "needs git")
    def test_refuses_uncommitted_changes(self):
        def git(*args):
            subprocess.run(["git", "-c", "user.name=test", "-c", "user.email=test@example.invalid",
                            "-c", "commit.gpgsign=false", *args],
                           cwd=self.root, capture_output=True, check=True)

        git("init", "-q")
        git("add", build.SRC_DIR)
        git("commit", "-q", "-m", "sources")

        path = self.script_file(*self.first_script())
        path.write_text(path.read_text(encoding="utf-8") + "// local change\n", encoding="utf-8")

        r = self.run_build("unpack")
        self.assertNotEqual(r.returncode, 0)
        self.assertIn("uncommitted changes", r.stderr)
        self.assertIn("// local change", path.read_text(encoding="utf-8"))


# ==========================================================================
# Names inside the archive
# ==========================================================================
class NameEncodingTest(unittest.TestCase):

    def test_matches_cinderella(self):
        # Pairs as Cinderella writes them (Java's URLEncoder)
        for label, encoded in [("[FUN] Divomath", "%5BFUN%5D+Divomath"),
                               ("[FUN] Math-like", "%5BFUN%5D+Math-like"),
                               ("[_VAM] doublenumberline", "%5B_VAM%5D+doublenumberline"),
                               ("a*b.c", "a*b.c"),
                               ("a~b", "a%7Eb"),
                               ("ä", "%C3%A4")]:
            self.assertEqual(build.java_url_encode(label), encoded, label)

    def test_every_label_decodes_back(self):
        manifest = json.loads((REPO_ROOT / build.SRC_DIR / build.SRC_MANIFEST).read_text(encoding="utf-8"))
        for labels in manifest.values():
            for label in labels:
                self.assertEqual(urllib.parse.unquote_plus(build.java_url_encode(label)), label)


if __name__ == "__main__":
    unittest.main()
