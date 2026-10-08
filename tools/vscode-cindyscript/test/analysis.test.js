"use strict";
/**
 * Tests for lib/analysis.js.
 *
 *     node --test tools/vscode-cindyscript/test/analysis.test.js
 *
 * Uses node's own test runner, no packages needed.
 */

const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const { Index, scan, syntaxError, LineMap } = require("../lib/analysis");

const SRC = path.resolve(__dirname, "../../../src/cindyscript");
const LINT = { lint: true, externals: [] };


// ==========================================================================
// Helpers
// ==========================================================================
/** Index with the given {file: text}. */
function indexOf(files) {
    const index = new Index();
    for (const [file, text] of Object.entries(files)) index.set(file, text, file);
    return index;
}

/** Messages of one file's problems, optionally only those with a code. */
function messages(index, file, code) {
    return index.diagnostics(file, LINT).filter(d => !code || d.code === code).map(d => d.message);
}


// ==========================================================================
// Syntax errors
// ==========================================================================
test("syntax: valid code has no error", () => {
    assert.strictEqual(syntaxError("f(a) := a + 1;\nx = f(2);", new LineMap("")), null);
});

test("syntax: error with its position", () => {
    const text = "x = 1;\nz = 1 +* 2;";
    const err = syntaxError(text, new LineMap(text));
    assert.match(err.message, /prefix/);
    assert.deepStrictEqual(new LineMap(text).position(err.start), { line: 1, character: 7 });
});

test("syntax: unbalanced bracket points at the opening one", () => {
    const text = "a = 1;\nb = (1 + 2;\nc = 3;";
    const err = syntaxError(text, new LineMap(text));
    assert.deepStrictEqual(new LineMap(text).position(err.start), { line: 1, character: 4 });
});

test("syntax: error is reported as diagnostic", () => {
    const index = indexOf({ a: "x = [1, 2;" });
    const [d] = index.diagnostics("a", LINT);
    assert.strictEqual(d.severity, "error");
    assert.strictEqual(d.code, "syntax");
});


// ==========================================================================
// Scanning
// ==========================================================================
test("scan: definitions keep name, arity, parameters and doc comment", () => {
    const s = scan("/** Draws a label. **/\ndraw label(coord, text) := (\n\tdrawtext(coord, text);\n);");
    const [def] = s.definitions;
    assert.strictEqual(def.key, "drawlabel$2");
    assert.strictEqual(def.name, "draw label");
    assert.deepStrictEqual(def.params, ["coord", "text"]);
    assert.strictEqual(def.doc, "Draws a label.");
});

test("scan: modifiers do not count as arguments", () => {
    const [call] = scan("drawtext([0,0], \"a\", color->red, size->3);").calls;
    assert.strictEqual(call.key, "drawtext$2");
});

test("scan: commas inside nested brackets and |...| do not split arguments", () => {
    const [call] = scan("f([1, 2], |a, b|, g(3, 4));").calls;
    assert.strictEqual(call.key, "f$3");
});

test("scan: no arguments", () => {
    assert.strictEqual(scan("f();").calls[0].key, "f$0");
});

test("scan: names ignore case and blanks", () => {
    assert.strictEqual(scan("Draw  Label(1);").calls[0].key, "drawlabel$1");
});

test("scan: methods of objects", () => {
    const s = scan('new Thing(c) := (\n\to = {};\n\to:"draw" := fill(c);\n\to;\n);');
    assert.deepStrictEqual(s.methods.map(m => m.name), ["draw"]);
});

test("scan: sections of the framework", () => {
    const s = scan("// ===== //\n// Debug //\n// ===== //\nx = 1;\n// C.1 | Atom\ny = 2;\n// --- helpers ---\n");
    assert.deepStrictEqual(s.sections.map(x => [x.title, x.level]), [["Debug", 1], ["C.1 | Atom", 2], ["helpers", 3]]);
});


// ==========================================================================
// Warnings
// ==========================================================================
test("lint: unknown function", () => {
    const index = indexOf({ a: "f(1);" });
    assert.match(messages(index, "a", "unknown-function")[0], /Unknown function "f"/);
});

test("lint: functions of other files and built-ins are known", () => {
    const index = indexOf({ a: "helper(x) := x;", b: "helper(1); drawtext([0,0], \"a\"); regional(a, b, c);" });
    assert.deepStrictEqual(messages(index, "b"), []);
});

test("lint: wrong number of arguments", () => {
    const index = indexOf({ a: "f(a, b) := a;\nf(1);" });
    assert.match(messages(index, "a", "unknown-function")[0], /not defined with 1 argument, only with 2/);
});

test("lint: external functions are known", () => {
    const index = indexOf({ a: "divomathSendResult();" });
    assert.deepStrictEqual(index.diagnostics("a", { lint: true, externals: ["divomath send result"] }), []);
});

test("lint: multiple assignment", () => {
    const index = indexOf({ a: "[a, b] = [7, 9];" });
    assert.strictEqual(messages(index, "a", "multiple-assignment").length, 1);
});

test("lint: list on the right side is fine", () => {
    const index = indexOf({ a: "x = [7, 9]; y = x_1 == [1]_1;" });
    assert.deepStrictEqual(messages(index, "a"), []);
});

test("lint: variable shadowing a modifier", () => {
    const index = indexOf({ a: "size = 3;\nf() := (regional(color); color->red);\nf();" });
    assert.strictEqual(messages(index, "a", "shadows-modifier").length, 2);
});

test("lint: can be switched off, syntax errors stay", () => {
    const index = indexOf({ a: "f(1);\nx = (;" });
    const found = index.diagnostics("a", { lint: false, externals: [] });
    assert.deepStrictEqual(found.map(d => d.code), ["syntax"]);
});

test("lint: a new definition removes the warning in another file", () => {
    const index = indexOf({ a: "f(1);", b: "" });
    assert.strictEqual(messages(index, "a").length, 1);
    assert.strictEqual(index.set("b", "f(x) := x;"), true);
    assert.deepStrictEqual(messages(index, "a"), []);
});


// ==========================================================================
// Navigation
// ==========================================================================
test("navigation: definition and hover across files", () => {
    const index = indexOf({ defs: "/** Adds one. **/\ninc(x) := x + 1;", use: "y = inc(2);" });
    const offset = "y = in".length;

    const [loc] = index.definitionsAt("use", offset);
    assert.strictEqual(loc.file, "defs");
    assert.deepStrictEqual(loc.start, { line: 1, character: 0 });

    const hover = index.hover("use", offset);
    assert.match(hover, /inc\(x\)/);
    assert.match(hover, /Adds one\./);
});

test("navigation: outline nests functions in sections and methods in functions", () => {
    const index = indexOf({ a: '// A | Classes\nnew Thing(c) := (\n\to = {};\n\to:"draw" := c;\n\to;\n);\n// B | Init\nx = 1;' });
    const [classes, init] = index.symbols("a");
    assert.strictEqual(classes.name, "A | Classes");
    assert.strictEqual(classes.children[0].name, "new Thing");
    assert.strictEqual(classes.children[0].children[0].name, "draw");
    assert.strictEqual(init.name, "B | Init");
});


// ==========================================================================
// The real sources
// ==========================================================================
test("sources: every script parses without error", () => {
    for (const event of fs.readdirSync(SRC)) {
        for (const file of fs.readdirSync(path.join(SRC, event))) {
            const text = fs.readFileSync(path.join(SRC, event, file), "utf8");
            const err = syntaxError(text, new LineMap(text));
            assert.strictEqual(err, null, event + "/" + file + ": " + (err && err.message));
        }
    }
});
