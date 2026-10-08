#!/usr/bin/env node
"use strict";
/**
 * Language server for CindyScript.
 *
 * Speaks the Language Server Protocol over stdin and stdout, so any editor
 * with an LSP client can use it - Neovim in particular, see ../README.md.
 * The analysis is the one of the VS Code extension
 * (../../vscode-cindyscript/lib/analysis.js), so both editors report the
 * same problems.
 *
 * No packages needed: the protocol is JSON behind a Content-Length header.
 */

const fs = require("fs");
const path = require("path");
const { fileURLToPath, pathToFileURL } = require("url");

const SHARED = path.join(__dirname, "../../vscode-cindyscript");
const { Index } = require(path.join(SHARED, "lib/analysis"));

// Same defaults as the VS Code extension, read from its manifest
const SETTINGS = require(path.join(SHARED, "package.json")).contributes.configuration.properties;

const EXT = ".cindyscript";
const EXCLUDE = ["node_modules", "out", ".git"];

// Milliseconds to wait after a file changed on disk, editors and git write in bursts
const DELAY = 100;

// Numbers the protocol uses
const SEVERITY = { error: 1, warning: 2 };
const SYMBOL_KIND = { section: 3, function: 12, method: 6 };   // Namespace, Function, Method
const ERROR = { methodNotFound: -32601, internal: -32603 };

const index = new Index();
const uris = new Map();     // file --> URI the client uses for it
const open = new Set();     // files open in the editor, their text comes from there
const timers = new Map();   // file --> pending reload from disk
let root = null;
let shuttingDown = false;
let options = {
    lint: SETTINGS["cindyscript.lint.enable"].default,
    externals: SETTINGS["cindyscript.lint.externalFunctions"].default,
};


// ==========================================================================
// Messages
// ==========================================================================
// --- 1. Write one. ---
function send(message) {
    const json = JSON.stringify({ jsonrpc: "2.0", ...message });
    process.stdout.write("Content-Length: " + Buffer.byteLength(json, "utf8") + "\r\n\r\n" + json);
}

function notify(method, params) {
    send({ method, params });
}

/** Messages for the editor's log, stdout belongs to the protocol. */
function log(text) {
    process.stderr.write("[cindyscript] " + text + "\n");
}

// --- 2. Read them: header, empty line, body of Content-Length bytes. ---
let buffer = Buffer.alloc(0);

process.stdin.on("data", function (chunk) {
    buffer = Buffer.concat([buffer, chunk]);

    for (;;) {
        const headerEnd = buffer.indexOf("\r\n\r\n");
        if (headerEnd < 0) return;

        // No length --> skip the broken header.
        const m = /Content-Length:\s*(\d+)/i.exec(buffer.subarray(0, headerEnd).toString("ascii"));
        if (!m) {
            buffer = buffer.subarray(headerEnd + 4);
            continue;
        }

        // Body not complete yet --> wait for more.
        const start = headerEnd + 4, end = start + Number(m[1]);
        if (buffer.length < end) return;

        const body = buffer.subarray(start, end).toString("utf8");
        buffer = buffer.subarray(end);

        try {
            handle(JSON.parse(body));
        } catch (e) {
            log("invalid message: " + e.message);
        }
    }
});

process.stdin.on("end", () => process.exit(shuttingDown ? 0 : 1));


// ==========================================================================
// Dispatch
// ==========================================================================
const handlers = {
    // --- lifecycle ---
    "initialize": initialize,
    "initialized": loadWorkspace,
    "shutdown": () => { shuttingDown = true; return null; },
    "exit": () => process.exit(shuttingDown ? 0 : 1),

    // --- documents in the editor ---
    "textDocument/didOpen": ({ textDocument: doc }) => {
        const file = toFile(doc.uri);
        setUri(file, doc.uri);
        open.add(file);
        update(file, doc.text);
    },
    "textDocument/didChange": ({ textDocument: doc, contentChanges }) => {
        // Full sync: the last change holds the whole text
        update(toFile(doc.uri), contentChanges[contentChanges.length - 1].text);
    },
    "textDocument/didClose": ({ textDocument: doc }) => {
        const file = toFile(doc.uri);
        open.delete(file);
        reload(file);   // back to what is on disk, unsaved edits are gone
    },
    "textDocument/didSave": () => {},

    // --- settings ---
    "workspace/didChangeConfiguration": ({ settings }) => {
        readSettings(settings);
        publishAll();
    },

    // --- features ---
    "textDocument/documentSymbol": documentSymbols,
    "textDocument/definition": definition,
    "textDocument/hover": hover,
    "textDocument/foldingRange": foldingRanges,
    "workspace/symbol": workspaceSymbols,
};

function handle(message) {
    const { id, method, params } = message;
    const isRequest = id !== undefined && id !== null;

    // Answers to requests of ours --> we send none.
    if (!method) return;

    const handler = handlers[method];
    if (!handler) {
        if (isRequest) send({ id, error: { code: ERROR.methodNotFound, message: "Method not found: " + method } });
        return;
    }

    try {
        const result = handler(params || {});
        if (isRequest) send({ id, result: result === undefined ? null : result });
    } catch (e) {
        log(e.stack || String(e));
        if (isRequest) send({ id, error: { code: ERROR.internal, message: e.message } });
    }
}


// ==========================================================================
// Lifecycle
// ==========================================================================
function initialize(params) {
    // Workspace root: the folder whose .cindyscript files are indexed
    const folder = (params.workspaceFolders && params.workspaceFolders[0] && params.workspaceFolders[0].uri) || params.rootUri;
    root = folder ? toFile(folder) : params.rootPath || null;

    readSettings(params.initializationOptions);

    return {
        capabilities: {
            textDocumentSync: { openClose: true, change: 1, save: false },   // 1: full text on every change
            documentSymbolProvider: true,
            definitionProvider: true,
            hoverProvider: true,
            foldingRangeProvider: true,
            workspaceSymbolProvider: true,
        },
        serverInfo: { name: "cindyscript", version: require(path.join(SHARED, "package.json")).version },
    };
}

/** Settings as {cindyscript: {lint: {enable, externalFunctions}}}, like VS Code's. */
function readSettings(settings) {
    const lint = settings && settings.cindyscript && settings.cindyscript.lint;
    if (!lint) return;
    if (typeof lint.enable === "boolean") options.lint = lint.enable;
    if (Array.isArray(lint.externalFunctions)) options.externals = lint.externalFunctions;
}

// --- Watch the workspace, then read all its files. ---
function loadWorkspace() {
    if (!root) return;

    // Changes outside the editor: git, tools/build.py unpack, ... Started
    // first, so nothing changed during the first reading gets lost.
    try {
        fs.watch(root, { recursive: true }, function (event, name) {
            if (!name || !name.endsWith(EXT) || name.split(path.sep).some(p => EXCLUDE.includes(p))) return;
            const file = path.join(root, name);
            clearTimeout(timers.get(file));
            timers.set(file, setTimeout(() => { timers.delete(file); reload(file); }, DELAY));
        });
    } catch (e) {
        log("can not watch " + root + ": " + e.message);
    }

    for (const file of findScripts(root)) {
        if (open.has(file)) continue;
        try {
            if (!uris.has(file)) uris.set(file, pathToFileURL(file).href);
            index.set(file, fs.readFileSync(file, "utf8"), label(file));
        } catch (e) {
            // Vanished in between --> nothing to index.
        }
    }
    publishAll();
}

/** All .cindyscript files below folder. */
function findScripts(folder) {
    const found = [];
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
        if (EXCLUDE.includes(entry.name)) continue;
        const p = path.join(folder, entry.name);
        if (entry.isDirectory()) found.push(...findScripts(p));
        else if (entry.name.endsWith(EXT)) found.push(p);
    }
    return found;
}


// ==========================================================================
// Keeping the index up to date
// ==========================================================================
// --- 1. Put a text into the index and publish the problems. ---
function update(file, text) {
    // Definitions changed --> other files may get or lose warnings.
    if (index.set(file, text, label(file))) publishAll();
    else publish(file);
}

// --- 2. Read a file from disk, unless the editor has it open. ---
function reload(file) {
    if (open.has(file)) return;

    let text;
    try {
        text = fs.readFileSync(file, "utf8");
    } catch (e) {
        // Gone --> forget it, its definitions too.
        if (index.has(file)) {
            index.remove(file);
            if (uris.has(file)) notify("textDocument/publishDiagnostics", { uri: uris.get(file), diagnostics: [] });
            uris.delete(file);
            publishAll();
        }
        return;
    }

    if (!uris.has(file)) uris.set(file, pathToFileURL(file).href);
    update(file, text);
}

// --- 3. Remember the URI the client uses, it may encode the path differently than we would. ---
function setUri(file, uri) {
    const old = uris.get(file);
    if (old && old !== uri) notify("textDocument/publishDiagnostics", { uri: old, diagnostics: [] });
    uris.set(file, uri);
}


// ==========================================================================
// Problems
// ==========================================================================
function publish(file) {
    const uri = uris.get(file);
    if (!uri) return;

    const diagnostics = index.diagnostics(file, options).map(d => ({
        range: { start: d.start, end: d.end },
        severity: SEVERITY[d.severity],
        source: "CindyScript",
        code: d.code,
        message: d.message,
    }));
    notify("textDocument/publishDiagnostics", { uri, diagnostics });
}

function publishAll() {
    for (const file of index.keys()) publish(file);
}


// ==========================================================================
// Features
// ==========================================================================
// --- outline: sections, functions, methods ---
function documentSymbols({ textDocument }) {
    return index.symbols(toFile(textDocument.uri)).map(toSymbol);
}

function toSymbol(s) {
    const selection = { start: s.selStart, end: s.selEnd };
    let range = { start: s.start, end: s.end };

    // The name has to lie inside the whole range
    if (before(selection.start, range.start)) range = { start: selection.start, end: range.end };
    if (before(range.end, selection.end)) range = { start: range.start, end: selection.end };

    return {
        name: s.name || "(unnamed)",
        detail: s.detail,
        kind: SYMBOL_KIND[s.kind],
        range,
        selectionRange: selection,
        children: s.children.map(toSymbol),
    };
}

// --- go to definition, across all files ---
function definition({ textDocument, position }) {
    const file = toFile(textDocument.uri);
    return index.definitionsAt(file, index.offset(file, position.line, position.character))
        .filter(l => uris.has(l.file))
        .map(l => ({ uri: uris.get(l.file), range: { start: l.start, end: l.end } }));
}

// --- hover: signature and description ---
function hover({ textDocument, position }) {
    const file = toFile(textDocument.uri);
    const text = index.hover(file, index.offset(file, position.line, position.character));
    return text ? { contents: { kind: "markdown", value: text } } : null;
}

// --- folding: brackets, block comments, sections ---
function foldingRanges({ textDocument }) {
    return index.folds(toFile(textDocument.uri)).map(f => ({
        startLine: f.startLine,
        endLine: f.endLine,
        kind: f.kind === "code" ? undefined : f.kind,   // "comment", "region"
    }));
}

// --- every function of the workspace ---
function workspaceSymbols({ query }) {
    const wanted = (query || "").toLowerCase().replace(/\s+/g, "");
    return index.allDefinitions()
        .filter(d => uris.has(d.file) && isSubsequence(wanted, d.name.toLowerCase().replace(/\s+/g, "")))
        .map(d => ({
            name: d.name + d.detail,
            kind: SYMBOL_KIND.function,
            location: { uri: uris.get(d.file), range: { start: d.start, end: d.end } },
            containerName: d.label,
        }));
}


// ==========================================================================
// Helpers
// ==========================================================================
/** File path of a file: URI, other URIs (unsaved buffers) stay as they are. */
function toFile(uri) {
    return uri.startsWith("file:") ? fileURLToPath(uri) : uri;
}

/** Name of a file as Cinderella shows the script: "[FUN] Drawing". */
function label(file) {
    return path.basename(file, EXT);
}

function before(a, b) {
    return a.line < b.line || (a.line === b.line && a.character < b.character);
}

/** True if the letters of needle appear in hay in this order ("dlab" in "drawlabel"). */
function isSubsequence(needle, hay) {
    let i = 0;
    for (const c of hay) if (c === needle[i]) i++;
    return i === needle.length;
}
