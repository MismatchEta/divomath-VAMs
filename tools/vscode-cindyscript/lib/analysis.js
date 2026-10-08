"use strict";
/**
 * Analysis of CindyScript files for the editor.
 *
 * - syntax errors, found by the parser of CindyJS itself (lib/Parser.js)
 * - warnings for common traps: unknown functions, multiple assignment,
 *   variables shadowing drawing modifiers
 * - an index of all function definitions across files, for outline, hover
 *   and go to definition
 *
 * Knows nothing about VS Code, so it can be tested with plain node (test/).
 * Positions are 0-based lines and characters in UTF-16 code units, like VS
 * Code's.
 */

const { Parser, Tokenizer } = require("./Parser");
const BUILTINS = require("./builtins.json").functions;

// Variable names that shadow the drawing modifiers of the same name
const SHADOWING = ["color", "size", "alpha", "font", "bold"];

// Operators that define a function: f(x) := ...
const DEFINE = [":=", "::="];

// Operators that mark a modifier: color->red
const MODIFIER = ["->", "→"];

// Section headings of the framework, e.g. "// C.1 | Atom: ..."
const RE_HEADING = /^\/\/\s*([A-Z](?:\.\d+[a-z]?)?)\s*\|\s*(.*?)\s*(?:\/\/)?\s*$/;

// Banner lines around a boxed heading, e.g. "// ========== //"
const RE_BANNER = /^\/\/\s*=+\s*(?:\/\/)?\s*$/;

// Small headings inside a section, e.g. "// --- text on a background box ---"
const RE_SUBHEADING = /^\/\/\s*-{3}\s*(.*?)\s*-*\s*$/;


// ==========================================================================
// Positions
// ==========================================================================
/** Turns offsets into lines and characters. */
class LineMap {
    constructor(text) {
        this.starts = [0];
        for (let i = 0; i < text.length; i++) {
            if (text.charCodeAt(i) === 10) this.starts.push(i + 1);
        }
    }

    position(offset) {
        // Binary search for the last line start <= offset
        let lo = 0, hi = this.starts.length - 1;
        while (lo < hi) {
            const mid = (lo + hi + 1) >> 1;
            if (this.starts[mid] <= offset) lo = mid; else hi = mid - 1;
        }
        return { line: lo, character: offset - this.starts[lo] };
    }

    range(start, end) {
        return { start: this.position(start), end: this.position(end) };
    }
}


// ==========================================================================
// Names
// ==========================================================================
/** Function names ignore case and spaces: "Draw Label" is "drawlabel". */
function functionKey(name) {
    return name.replace(/[ \t]+/g, "").toLowerCase();
}

/** Name as written, with runs of blanks reduced to one space. */
function displayName(raw) {
    return raw.replace(/[ \t]+/g, " ");
}

/** Argument counts CindyJS has built in for a name, empty if none. */
function builtinArities(key) {
    return Object.prototype.hasOwnProperty.call(BUILTINS, key) ? BUILTINS[key] : [];
}


// ==========================================================================
// Tokens
// ==========================================================================
/**
 * Split text into tokens with the tokenizer of CindyJS. Unlike its next(),
 * comments are kept, in a list of their own. Throws on text CindyJS can not
 * tokenize; the parser reports that as syntax error anyway.
 */
function tokenize(text) {
    const t = new Tokenizer(text);
    const tokens = [], comments = [];

    for (;;) {
        const tok = t.nextInternal();

        // Block comment: find its end, they may be nested (same as Tokenizer.next)
        if (tok.toktype === "START_COMMENT") {
            const re = /\*\/|\/\*/g;
            re.lastIndex = tok.start.pos + 2;
            let depth = 1;
            while (depth > 0) {
                const m = re.exec(text);
                if (!m) throw new Error("Unterminated comment");
                depth += m[0] === "/*" ? 1 : -1;
            }
            t.re.lastIndex = re.lastIndex;
            t.advanceTo(re.lastIndex);
            tok.end = t.curPos();
            tok.raw = tok.text = text.substring(tok.start.pos, tok.end.pos);
            tok.toktype = "COMMENT";
        }

        if (tok.toktype === "COMMENT") {
            comments.push(tok);
            continue;
        }
        if (tok.toktype === "WS") continue;

        tokens.push(tok);
        if (tok.toktype === "EOF") return { tokens, comments };
    }
}

/** True if tok is a bracket token with the given character. */
function isBracket(tok, ch) {
    return tok && tok.toktype === "BRA" && tok.text === ch;
}

/** True if tok is an operator token with one of the given texts. */
function isOp(tok, texts) {
    return tok && tok.toktype === "OP" && texts.includes(tok.text);
}

/**
 * Return for every token the index of its partner bracket, -1 otherwise.
 * "|" is its own partner (|x| is the absolute value): a "|" closes an open
 * "|", or opens a new one.
 */
function matchBrackets(tokens) {
    const partner = new Array(tokens.length).fill(-1);
    const pairs = { ")": "(", "]": "[", "}": "{" };
    const stack = [];

    tokens.forEach(function (tok, i) {
        if (tok.toktype !== "BRA") return;

        if (tok.text === "|") {
            const top = stack[stack.length - 1];
            if (top !== undefined && tokens[top].text === "|") {
                stack.pop();
                partner[i] = top;
                partner[top] = i;
            } else {
                stack.push(i);
            }
        } else if (pairs[tok.text]) {
            // Closing: pop until the matching opening, so one stray bracket does not shift everything
            for (let s = stack.length - 1; s >= 0; s--) {
                if (tokens[stack[s]].text === pairs[tok.text]) {
                    partner[i] = stack[s];
                    partner[stack[s]] = i;
                    stack.length = s;
                    break;
                }
            }
        } else {
            stack.push(i);
        }
    });

    return partner;
}

/**
 * Split the tokens between an opening bracket at open and its partner close
 * at the top level commas. Return the [first, last] token index of every
 * element; an empty pair of brackets has none.
 */
function splitElements(tokens, open, close, partner) {
    const elements = [];
    let first = open + 1;

    for (let i = open + 1; i < close; i++) {
        // Skip nested brackets as a whole
        if (partner[i] > i) {
            i = partner[i];
            continue;
        }
        if (isOp(tokens[i], [","])) {
            elements.push([first, i - 1]);
            first = i + 1;
        }
    }
    if (first < close || elements.length) elements.push([first, close - 1]);

    return elements;
}

/** True if the element starting at token index first is a modifier (name->value). */
function isModifierElement(tokens, first) {
    return tokens[first].toktype === "ID" && isOp(tokens[first + 1], MODIFIER);
}

/**
 * Index of the last token of a definition body starting after the ":=" at
 * define: up to a ";" or "," (both bind weaker than ":=") or the closing
 * bracket of the surrounding expression.
 */
function bodyEnd(tokens, define, partner) {
    let i = define + 1;
    while (i < tokens.length - 1) {
        const tok = tokens[i];
        if (partner[i] > i) {
            i = partner[i] + 1;
            continue;
        }
        if (isOp(tok, [";", ","])) break;
        if (tok.toktype === "BRA" && partner[i] >= 0 && partner[i] < i) break;
        i++;
    }
    return Math.max(define, i - 1);
}


// ==========================================================================
// Comments
// ==========================================================================
/** Comment text without its markers, stars and banner lines. */
function cleanComment(comments) {
    const lines = [];

    for (const c of comments) {
        let text = c.raw;
        if (text.startsWith("//")) {
            lines.push(text.replace(/^\/\/\s?/, ""));
            continue;
        }
        text = text.replace(/^\/\*+/, "").replace(/\*+\/$/, "");
        for (let line of text.split(/\r?\n/)) {
            // "* text" loses its star, other lines their leading blanks
            const starred = /^\s*\*+\s?/;
            line = starred.test(line) ? line.replace(starred, "") : line.trimStart();
            lines.push(line.replace(/\s*\*+\s*$/, "").trimEnd());
        }
    }

    // Drop empty lines at both ends
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();

    return lines.join("\n");
}

/**
 * The comment directly above a token: one block comment, or a run of line
 * comments on consecutive lines. Only blanks may separate it from the token.
 */
function commentAbove(text, comments, tok) {
    let i = comments.length - 1;
    while (i >= 0 && comments[i].end.pos > tok.start.pos) i--;
    if (i < 0) return "";

    // Only blanks and one line break between comment and token
    const gap = text.substring(comments[i].end.pos, tok.start.pos);
    if (!/^[ \t]*\r?\n[ \t]*$/.test(gap) && !/^[ \t]*$/.test(gap)) return "";

    // Block comment: just that one
    if (!comments[i].raw.startsWith("//")) return cleanComment([comments[i]]);

    // Line comments: collect upwards while they sit on consecutive lines
    const run = [comments[i]];
    for (let j = i - 1; j >= 0; j--) {
        const between = text.substring(comments[j].end.pos, run[0].start.pos);
        if (!comments[j].raw.startsWith("//") || !/^\r?\n[ \t]*$/.test(between)) break;
        run.unshift(comments[j]);
    }

    // A section banner is not a description
    if (run.some(c => RE_HEADING.test(c.raw) || RE_BANNER.test(c.raw))) return "";

    return cleanComment(run);
}

/**
 * Section headings from the comments: "// C.1 | Title" (level 1, or 2 with a
 * dot), boxed headings between "// ===== //" lines (level 1) and
 * "// --- title ---" (level 3).
 */
function sections(comments) {
    const found = [];
    const line = c => c.start.row;

    comments.forEach(function (c, i) {
        const raw = c.raw.trim();
        let m;

        if ((m = RE_HEADING.exec(raw))) {
            found.push({ title: m[1] + " | " + m[2], level: m[1].includes(".") ? 2 : 1, tok: c });
        } else if (RE_BANNER.test(raw) && comments[i + 2] && RE_BANNER.test(comments[i + 2].raw.trim())
                   && line(comments[i + 1]) === line(c) + 1 && line(comments[i + 2]) === line(c) + 2
                   && !RE_HEADING.test(comments[i + 1].raw.trim())) {
            const title = comments[i + 1].raw.replace(/^\/\/\s*/, "").replace(/\s*\/\/\s*$/, "");
            found.push({ title, level: 1, tok: comments[i + 1] });
        } else if ((m = RE_SUBHEADING.exec(raw)) && m[1]) {
            found.push({ title: m[1], level: 3, tok: c });
        }
    });

    return found;
}


// ==========================================================================
// Scanning one file
// ==========================================================================
/**
 * Everything the editor needs to know about one file:
 *
 *   definitions  [{key, name, arity, params, nameStart, nameEnd, end, doc}]
 *   methods      [{name, owner, nameStart, nameEnd, end}]  for obj:"draw" := ...
 *   calls        [{key, name, arity, nameStart, nameEnd}]
 *   warnings     [{start, end, message, code}] that need no other file
 *   folds        [{startLine, endLine, kind}]
 *   sections     [{title, level, start}]
 *
 * Offsets are string positions; "key" is the CindyJS name of a function,
 * e.g. "drawlabel$3". Returns null if the text can not even be tokenized.
 */
function scan(text) {
    let tokens, comments;
    try {
        ({ tokens, comments } = tokenize(text));
    } catch (e) {
        return null;
    }

    const partner = matchBrackets(tokens);
    const result = { definitions: [], methods: [], calls: [], warnings: [], folds: [], sections: [] };

    tokens.forEach(function (tok, i) {
        // --- methods of the framework's objects: obj:"draw" := ... ---
        if (tok.toktype === "STR" && isOp(tokens[i + 1], DEFINE) && isOp(tokens[i - 1], [":"])
            && tokens[i - 2] && tokens[i - 2].toktype === "ID") {
            result.methods.push({
                name: tok.raw.slice(1, -1),   // raw: .text has the blanks removed, even inside strings
                owner: displayName(tokens[i - 2].raw),
                nameStart: tok.start.pos,
                nameEnd: tok.end.pos,
                end: tokens[bodyEnd(tokens, i + 1, partner)].end.pos,
            });
        }

        // --- function definitions and calls: name( ---
        if (tok.toktype === "ID" && isBracket(tokens[i + 1], "(") && partner[i + 1] > i + 1) {
            const close = partner[i + 1];
            const elements = splitElements(tokens, i + 1, close, partner)
                .filter(([first]) => !isModifierElement(tokens, first));
            const name = displayName(tok.raw);
            const key = functionKey(tok.raw) + "$" + elements.length;
            const entry = { key, name, arity: elements.length, nameStart: tok.start.pos, nameEnd: tok.end.pos };

            if (isOp(tokens[close + 1], DEFINE)) {
                entry.params = elements.map(([first, last]) => text.substring(tokens[first].start.pos, tokens[last].end.pos));
                entry.end = tokens[bodyEnd(tokens, close + 1, partner)].end.pos;
                entry.doc = commentAbove(text, comments, tok);
                result.definitions.push(entry);
            } else {
                result.calls.push(entry);

                // regional(color) shadows the modifier just like color = ...
                if (functionKey(tok.raw) === "regional") {
                    for (const [first, last] of elements) {
                        if (first === last && SHADOWING.includes(tokens[first].text)) {
                            result.warnings.push(shadowWarning(tokens[first]));
                        }
                    }
                }
            }
        }

        // --- color = ... ---
        if (tok.toktype === "ID" && SHADOWING.includes(tok.text) && isOp(tokens[i + 1], ["="])) {
            result.warnings.push(shadowWarning(tok));
        }

        // --- [a, b] = ... at the start of a statement ---
        if (isBracket(tok, "[") && partner[i] > i && isOp(tokens[partner[i] + 1], ["="])
            && (i === 0 || isOp(tokens[i - 1], [";"]) || isBracket(tokens[i - 1], "(") || isBracket(tokens[i - 1], "{"))) {
            result.warnings.push({
                start: tok.start.pos,
                end: tokens[partner[i]].end.pos,
                code: "multiple-assignment",
                message: "Multiple assignment does not work in CindyScript: all variables stay undefined. Assign them one by one.",
            });
        }

        // --- folding: brackets spanning lines ---
        if (partner[i] > i && tokens[partner[i]].start.row > tok.start.row) {
            result.folds.push({ startLine: tok.start.row - 1, endLine: tokens[partner[i]].start.row - 2, kind: "code" });
        }
    });

    // --- folding: block comments spanning lines ---
    for (const c of comments) {
        if (c.end.row > c.start.row) {
            result.folds.push({ startLine: c.start.row - 1, endLine: c.end.row - 1, kind: "comment" });
        }
    }

    // --- sections ---
    result.sections = sections(comments).map(s => ({ title: s.title, level: s.level, start: s.tok.start.pos }));

    return result;
}

/** Warning for a variable that shadows a drawing modifier. */
function shadowWarning(tok) {
    return {
        start: tok.start.pos,
        end: tok.end.pos,
        code: "shadows-modifier",
        message: "\"" + tok.text + "\" shadows the drawing modifier " + tok.text
                 + "->: an unset modifier would take this value. Use another name.",
    };
}


// ==========================================================================
// Syntax errors
// ==========================================================================
/**
 * Return the first syntax error as {start, end, message} with offsets, or
 * null. Most errors carry their position; for unbalanced brackets it only
 * appears in the message ("Opening ( at 3:4 closed by EOF at 9:0").
 */
function syntaxError(text, map) {
    const res = new Parser().parse(text);
    if (res.ctype !== "error") return null;

    const message = res.description || res.message;
    let start = 0, length = 1;

    if (res.location && typeof res.location.pos === "number") {
        start = res.location.pos;
        length = Math.max(1, (res.text || "").length);
    } else {
        const m = /at (\d+):(\d+)/.exec(message);
        if (m) {
            const line = Math.min(Number(m[1]) - 1, map.starts.length - 1);
            start = map.starts[line] + Number(m[2]);
        }
    }

    start = Math.min(start, text.length);
    return { start, end: Math.min(start + length, text.length), message };
}


// ==========================================================================
// Index of all files
// ==========================================================================
class Index {
    constructor() {
        this.files = new Map();     // file key --> {text, label, map, scan, error}
        this.byKey = null;          // function key --> [{file, def}], built on demand
    }

    // --- 1. Keep files up to date. ---

    /**
     * Read a file's text. Return true if the functions it defines changed,
     * because then other files may need new warnings too.
     */
    set(file, text, label) {
        const old = this.files.get(file);
        if (old && old.text === text) return false;

        const map = new LineMap(text);
        const fresh = scan(text);

        // While a file can not be tokenized, keep its old definitions, so
        // other files do not light up with "unknown function" while typing
        const entry = {
            text, map,
            label: label || (old && old.label) || file,
            scan: fresh || (old && old.scan) || null,
            current: !!fresh,
            error: syntaxError(text, map),
        };
        this.files.set(file, entry);

        const before = old && old.scan ? old.scan.definitions.map(d => d.key).sort().join() : "";
        const after = entry.scan ? entry.scan.definitions.map(d => d.key).sort().join() : "";
        if (before !== after) this.byKey = null;
        return before !== after;
    }

    remove(file) {
        this.files.delete(file);
        this.byKey = null;
    }

    has(file) {
        return this.files.has(file);
    }

    text(file) {
        const entry = this.files.get(file);
        return entry ? entry.text : undefined;
    }

    keys() {
        return [...this.files.keys()];
    }

    // --- 2. Look up definitions. ---

    definitionsByKey() {
        if (!this.byKey) {
            this.byKey = new Map();
            for (const [file, entry] of this.files) {
                if (!entry.scan) continue;
                for (const def of entry.scan.definitions) {
                    if (!this.byKey.has(def.key)) this.byKey.set(def.key, []);
                    this.byKey.get(def.key).push({ file, def });
                }
            }
        }
        return this.byKey;
    }

    /** All definitions of a function name, with any number of arguments. */
    definitionsOf(key) {
        const name = key.replace(/\$\d+$/, "");
        const found = [];
        for (const [k, list] of this.definitionsByKey()) {
            if (k.replace(/\$\d+$/, "") === name) found.push(...list);
        }
        return found;
    }

    /** Position of a definition as {file, start, end} with lines and characters. */
    location(file, def) {
        const entry = this.files.get(file);
        return { file, ...entry.map.range(def.nameStart, def.nameEnd) };
    }

    // --- 3. Diagnostics. ---

    /**
     * Problems of one file: [{severity, start, end, message, code}].
     * options: {lint: bool, externals: [function names provided from outside]}
     */
    diagnostics(file, options) {
        const entry = this.files.get(file);
        if (!entry) return [];

        const out = [];
        const add = (severity, w) => out.push({ severity, code: w.code, message: w.message, ...entry.map.range(w.start, w.end) });

        if (entry.error) add("error", { ...entry.error, code: "syntax" });

        // Warnings only from an up to date scan, positions would be off otherwise
        if (!options.lint || !entry.current) return out;

        for (const w of entry.scan.warnings) add("warning", w);

        const externals = new Set((options.externals || []).map(functionKey));
        const byKey = this.definitionsByKey();

        for (const call of entry.scan.calls) {
            const name = call.key.replace(/\$\d+$/, "");
            const builtin = builtinArities(name);

            // Defined here, built in with this many arguments or any, or provided from outside
            if (byKey.has(call.key) || builtin.includes(call.arity) || builtin.includes("*") || externals.has(name)) continue;

            const known = [...new Set([...this.definitionsOf(call.key).map(d => d.def.arity), ...builtin])].sort();
            add("warning", {
                start: call.nameStart,
                end: call.nameEnd,
                code: "unknown-function",
                message: known.length
                    ? "\"" + call.name + "\" is not defined with " + call.arity + " argument" + (call.arity === 1 ? "" : "s")
                      + ", only with " + known.join(", ") + ". CindyJS would report \"Called undefined function\"."
                    : "Unknown function \"" + call.name + "\". CindyJS would report \"Called undefined function\".",
            });
        }

        return out;
    }

    // --- 4. Navigation. ---

    /** The function name at an offset: {key, name, arity, isDefinition} or null. */
    functionAt(file, offset) {
        const entry = this.files.get(file);
        if (!entry || !entry.scan || !entry.current) return null;

        for (const def of entry.scan.definitions) {
            if (offset >= def.nameStart && offset <= def.nameEnd) return { ...def, isDefinition: true };
        }
        for (const call of entry.scan.calls) {
            if (offset >= call.nameStart && offset <= call.nameEnd) return { ...call, isDefinition: false };
        }
        return null;
    }

    /** Where the function at an offset is defined: [{file, start, end}], same arity first. */
    definitionsAt(file, offset) {
        const fn = this.functionAt(file, offset);
        if (!fn) return [];

        const exact = this.definitionsByKey().get(fn.key) || [];
        const list = exact.length ? exact : this.definitionsOf(fn.key);
        return list.map(({ file: f, def }) => this.location(f, def));
    }

    /** Hover text (Markdown) for the function at an offset, or null. */
    hover(file, offset) {
        const fn = this.functionAt(file, offset);
        if (!fn) return null;

        const name = fn.key.replace(/\$\d+$/, "");
        const parts = [];

        // Definitions in the scripts, the ones with the same arity first
        const defs = this.definitionsOf(fn.key).sort((a, b) => (b.def.arity === fn.arity) - (a.def.arity === fn.arity));
        for (const { file: f, def } of defs) {
            const where = this.files.get(f);
            const line = where.map.position(def.nameStart).line + 1;
            let text = "```cindyscript\n" + def.name + "(" + def.params.join(", ") + ")\n```\n";
            if (def.doc) text += "\n" + def.doc.replace(/\n/g, "  \n") + "\n";
            text += "\n*" + where.label + ", line " + line + "*";
            parts.push(text);
        }

        // Built into CindyJS
        const builtin = builtinArities(name);
        if (builtin.length) {
            const counts = builtin.map(a => (a === "*" ? "any number of" : a)).join(", ");
            parts.push("**" + fn.name + "** is built into CindyJS (" + counts + " arguments)"
                       + (defs.length ? ". A definition in the scripts takes precedence." : "."));
        }

        return parts.length ? parts.join("\n\n---\n\n") : null;
    }

    /**
     * Outline of one file: sections with the functions defined in them, and
     * the methods (obj:"draw" := ...) inside those functions.
     * [{name, detail, kind: "section"|"function"|"method", start, end, selStart, selEnd, children}]
     */
    symbols(file) {
        const entry = this.files.get(file);
        if (!entry || !entry.scan) return [];

        const map = entry.map, scanResult = entry.scan;
        const roots = [], open = [];   // open: stack of sections by level
        const endOfText = map.position(entry.text.length);

        // Sections first, each ending where the next one of the same or a higher level starts
        const secs = scanResult.sections.map(s => ({
            name: s.title, detail: "", kind: "section", level: s.level,
            start: map.position(s.start), selStart: map.position(s.start), children: [],
        }));
        secs.forEach(function (s, i) {
            const next = secs.slice(i + 1).find(o => o.level <= s.level);
            s.end = next ? map.position(next.start.line > 0 ? map.starts[next.start.line] - 1 : 0) : endOfText;
            s.selEnd = { line: s.start.line, character: s.start.character + 1 };
        });

        // Functions, and methods of the objects they build
        const funcs = scanResult.definitions.map(d => ({
            name: d.name, detail: "(" + d.params.join(", ") + ")", kind: "function", level: 50,
            start: map.position(d.nameStart), end: map.position(d.end),
            selStart: map.position(d.nameStart), selEnd: map.position(d.nameEnd), children: [],
        }));
        const methods = scanResult.methods.map(m => ({
            name: m.name, detail: m.owner, kind: "method", level: 99,
            start: map.position(m.nameStart), end: map.position(m.end),
            selStart: map.position(m.nameStart), selEnd: map.position(m.nameEnd), children: [],
        }));

        // Nest everything by position: each item goes into the innermost
        // section or function that contains it
        const items = [...secs, ...funcs, ...methods]
            .sort((a, b) => a.start.line - b.start.line || a.start.character - b.start.character);
        for (const item of items) {
            while (open.length && !contains(open[open.length - 1], item)) open.pop();
            (open.length ? open[open.length - 1].children : roots).push(item);
            if (item.kind !== "method") open.push(item);
        }
        return roots;

        function contains(outer, inner) {
            const before = (a, b) => a.line < b.line || (a.line === b.line && a.character <= b.character);
            return before(outer.start, inner.start) && before(inner.end, outer.end) && outer.level < inner.level;
        }
    }

    /** Folding ranges of one file: [{startLine, endLine, kind}]. */
    folds(file) {
        const entry = this.files.get(file);
        if (!entry || !entry.scan) return [];

        const folds = entry.scan.folds.filter(f => f.endLine > f.startLine);

        // Sections fold up to the line before the next section of the same or a higher level
        const secs = entry.scan.sections;
        secs.forEach(function (s, i) {
            const startLine = entry.map.position(s.start).line;
            const next = secs.slice(i + 1).find(o => o.level <= s.level);
            const endLine = next ? entry.map.position(next.start).line - 1 : entry.map.starts.length - 1;
            if (endLine > startLine) folds.push({ startLine, endLine, kind: "region" });
        });

        return folds;
    }

    /** All definitions of all files, for "Go to Symbol in Workspace". */
    allDefinitions() {
        const out = [];
        for (const [file, entry] of this.files) {
            if (!entry.scan) continue;
            for (const def of entry.scan.definitions) {
                out.push({ name: def.name, detail: "(" + def.params.join(", ") + ")", label: entry.label, ...this.location(file, def) });
            }
        }
        return out;
    }
}

module.exports = { Index, scan, tokenize, syntaxError, functionKey, LineMap, BUILTINS };
