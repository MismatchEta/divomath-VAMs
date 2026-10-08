"use strict";
/**
 * VS Code side of the CindyScript extension.
 *
 * Keeps the index of lib/analysis.js up to date with every .cindyscript file
 * of the workspace - open documents from the editor, all others from disk -
 * and shows what it finds: problems, outline, folding, hover and go to
 * definition. Functions are global in CindyScript, so a change in one file
 * can add or remove warnings in another.
 */

const path = require("path");
const vscode = require("vscode");
const { Index } = require("./lib/analysis");

const LANGUAGE = "cindyscript";
const FILES = "**/*.cindyscript";
const EXCLUDE = "**/{node_modules,out,.git}/**";

// Milliseconds after the last keystroke before a document is checked again
const DELAY = 300;

function activate(context) {
    const index = new Index();
    const problems = vscode.languages.createDiagnosticCollection(LANGUAGE);
    const uris = new Map();     // index key --> Uri
    const onDisk = new Set();   // keys of the workspace files (not just opened ones)
    const timers = new Map();   // index key --> pending check
    let options = readOptions();

    // =====================================================================
    // Keeping the index up to date
    // =====================================================================
    // --- 1. Put a text into the index and show the problems. ---
    function update(uri, text) {
        const key = uri.toString();
        uris.set(key, uri);

        // Definitions changed --> other files may get or lose warnings.
        if (index.set(key, text, label(uri))) publishAll();
        else publish(key);
    }

    // --- 2. Read a file, from the editor if it is open there. ---
    async function read(uri) {
        const doc = openDocument(uri);
        if (doc) return doc.getText();
        return new TextDecoder("utf-8").decode(await vscode.workspace.fs.readFile(uri));
    }

    // --- 3. All files of the workspace, published once at the end. ---
    async function loadWorkspace() {
        const found = await vscode.workspace.findFiles(FILES, EXCLUDE);

        for (const uri of found) {
            const key = uri.toString();
            onDisk.add(key);
            uris.set(key, uri);
            try {
                index.set(key, await read(uri), label(uri));
            } catch (e) {
                // Vanished in between --> the watcher takes care of it.
            }
        }

        // Documents open from outside the workspace
        for (const doc of vscode.workspace.textDocuments) {
            if (doc.languageId === LANGUAGE && !index.has(doc.uri.toString())) {
                uris.set(doc.uri.toString(), doc.uri);
                index.set(doc.uri.toString(), doc.getText(), label(doc.uri));
            }
        }

        publishAll();
    }

    // --- 4. Check a document once typing pauses. ---
    function schedule(doc) {
        const key = doc.uri.toString();
        clearTimeout(timers.get(key));
        timers.set(key, setTimeout(function () {
            timers.delete(key);
            update(doc.uri, doc.getText());
        }, DELAY));
    }

    // --- 5. Make sure a provider sees the text of the editor. ---
    function sync(doc) {
        const key = doc.uri.toString();
        if (index.text(key) !== doc.getText()) update(doc.uri, doc.getText());
        return key;
    }

    function forget(uri) {
        const key = uri.toString();
        index.remove(key);
        problems.delete(uri);
        uris.delete(key);
        publishAll();
    }

    // =====================================================================
    // Problems
    // =====================================================================
    function publish(key) {
        const uri = uris.get(key);
        if (uri) problems.set(uri, index.diagnostics(key, options).map(toDiagnostic));
    }

    function publishAll() {
        for (const key of index.keys()) publish(key);
    }

    function toDiagnostic(d) {
        const severity = d.severity === "error" ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning;
        const diagnostic = new vscode.Diagnostic(toRange(d.start, d.end), d.message, severity);
        diagnostic.source = "CindyScript";
        diagnostic.code = d.code;
        return diagnostic;
    }

    // =====================================================================
    // Events
    // =====================================================================
    const watcher = vscode.workspace.createFileSystemWatcher(FILES);

    context.subscriptions.push(
        problems,
        watcher,

        // --- editor ---
        vscode.workspace.onDidOpenTextDocument(function (doc) {
            if (doc.languageId === LANGUAGE) update(doc.uri, doc.getText());
        }),
        vscode.workspace.onDidChangeTextDocument(function (e) {
            if (e.document.languageId === LANGUAGE) schedule(e.document);
        }),
        vscode.workspace.onDidCloseTextDocument(async function (doc) {
            if (doc.languageId !== LANGUAGE) return;
            const key = doc.uri.toString();
            clearTimeout(timers.get(key));

            // Workspace file: back to what is on disk (unsaved edits are gone). Others: forget.
            if (onDisk.has(key)) {
                try {
                    update(doc.uri, await read(doc.uri));
                } catch (e) {
                    forget(doc.uri);
                }
            } else {
                forget(doc.uri);
            }
        }),

        // --- files changed outside the editor (git, unpack, ...) ---
        watcher.onDidCreate(async function (uri) {
            onDisk.add(uri.toString());
            try { update(uri, await read(uri)); } catch (e) { /* gone again */ }
        }),
        watcher.onDidChange(async function (uri) {
            if (openDocument(uri)) return;   // the editor's text counts
            try { update(uri, await read(uri)); } catch (e) { /* gone again */ }
        }),
        watcher.onDidDelete(function (uri) {
            onDisk.delete(uri.toString());
            if (!openDocument(uri)) forget(uri);
        }),

        // --- settings ---
        vscode.workspace.onDidChangeConfiguration(function (e) {
            if (!e.affectsConfiguration(LANGUAGE)) return;
            options = readOptions();
            publishAll();
        })
    );

    // =====================================================================
    // Providers
    // =====================================================================
    const selector = { language: LANGUAGE };

    context.subscriptions.push(
        // --- outline: sections, functions, methods ---
        vscode.languages.registerDocumentSymbolProvider(selector, {
            provideDocumentSymbols(doc) {
                return index.symbols(sync(doc)).map(toSymbol);
            },
        }),

        // --- folding: brackets, block comments, sections ---
        vscode.languages.registerFoldingRangeProvider(selector, {
            provideFoldingRanges(doc) {
                const kinds = { comment: vscode.FoldingRangeKind.Comment, region: vscode.FoldingRangeKind.Region };
                return index.folds(sync(doc)).map(f => new vscode.FoldingRange(f.startLine, f.endLine, kinds[f.kind]));
            },
        }),

        // --- hover: signature and description of a function ---
        vscode.languages.registerHoverProvider(selector, {
            provideHover(doc, position) {
                const text = index.hover(sync(doc), doc.offsetAt(position));
                return text ? new vscode.Hover(new vscode.MarkdownString(text)) : null;
            },
        }),

        // --- go to definition, across all files ---
        vscode.languages.registerDefinitionProvider(selector, {
            provideDefinition(doc, position) {
                return index.definitionsAt(sync(doc), doc.offsetAt(position))
                    .filter(l => uris.has(l.file))
                    .map(l => new vscode.Location(uris.get(l.file), toRange(l.start, l.end)));
            },
        }),

        // --- go to symbol in workspace (Ctrl+T) ---
        vscode.languages.registerWorkspaceSymbolProvider({
            provideWorkspaceSymbols(query) {
                const wanted = query.toLowerCase().replace(/\s+/g, "");
                return index.allDefinitions()
                    .filter(d => uris.has(d.file) && isSubsequence(wanted, d.name.toLowerCase().replace(/\s+/g, "")))
                    .map(d => new vscode.SymbolInformation(d.name + d.detail, vscode.SymbolKind.Function, d.label,
                                                           new vscode.Location(uris.get(d.file), toRange(d.start, d.end))));
            },
        })
    );

    // Start.
    loadWorkspace();
}

function deactivate() {}


// ==========================================================================
// Helpers
// ==========================================================================
/** Settings of the extension. */
function readOptions() {
    const config = vscode.workspace.getConfiguration(LANGUAGE);
    return {
        lint: config.get("lint.enable", true),
        externals: config.get("lint.externalFunctions", []),
    };
}

/** Name of a file as Cinderella shows the script: "[FUN] Drawing". */
function label(uri) {
    return path.posix.basename(uri.path, ".cindyscript");
}

/** The open editor document of a file, if any. */
function openDocument(uri) {
    const key = uri.toString();
    return vscode.workspace.textDocuments.find(d => d.uri.toString() === key);
}

function toRange(start, end) {
    return new vscode.Range(start.line, start.character, end.line, end.character);
}

/** Outline entry of the index as DocumentSymbol, with its children. */
function toSymbol(s) {
    const kinds = { section: vscode.SymbolKind.Namespace, function: vscode.SymbolKind.Function, method: vscode.SymbolKind.Method };
    const selection = toRange(s.selStart, s.selEnd);
    let full = toRange(s.start, s.end);

    // VS Code insists on the name lying inside the whole range
    if (!full.contains(selection)) full = full.union(selection);

    const symbol = new vscode.DocumentSymbol(s.name, s.detail, kinds[s.kind], full, selection);
    symbol.children = s.children.map(toSymbol);
    return symbol;
}

/** True if the letters of needle appear in hay in this order ("dlab" in "drawlabel"). */
function isSubsequence(needle, hay) {
    let i = 0;
    for (const c of hay) if (c === needle[i]) i++;
    return i === needle.length;
}

module.exports = { activate, deactivate };
