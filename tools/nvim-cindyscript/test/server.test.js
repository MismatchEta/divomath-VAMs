"use strict";
/**
 * Tests for the language server: speaks the protocol with it like an editor.
 *
 *     node --test tools/nvim-cindyscript/test/server.test.js
 *
 * Uses node's own test runner, no packages needed.
 */

const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { pathToFileURL } = require("url");

const SERVER = path.resolve(__dirname, "../server/cindyscript-lsp.js");


// ==========================================================================
// A minimal LSP client
// ==========================================================================
class Client {
    constructor(root) {
        this.proc = spawn(process.execPath, [SERVER], { stdio: ["pipe", "pipe", "pipe"] });
        this.nextId = 1;
        this.pending = new Map();       // id --> resolve
        this.diagnostics = new Map();   // uri --> latest diagnostics
        this.waiters = [];
        this.buffer = Buffer.alloc(0);
        this.proc.stdout.on("data", chunk => this.read(chunk));
        this.root = root;
    }

    read(chunk) {
        this.buffer = Buffer.concat([this.buffer, chunk]);
        for (;;) {
            const headerEnd = this.buffer.indexOf("\r\n\r\n");
            if (headerEnd < 0) return;
            const length = Number(/Content-Length: (\d+)/.exec(this.buffer.subarray(0, headerEnd).toString())[1]);
            if (this.buffer.length < headerEnd + 4 + length) return;
            const message = JSON.parse(this.buffer.subarray(headerEnd + 4, headerEnd + 4 + length).toString("utf8"));
            this.buffer = this.buffer.subarray(headerEnd + 4 + length);

            if (message.id !== undefined && this.pending.has(message.id)) {
                this.pending.get(message.id)(message);
                this.pending.delete(message.id);
            } else if (message.method === "textDocument/publishDiagnostics") {
                this.diagnostics.set(message.params.uri, message.params.diagnostics);
                this.waiters = this.waiters.filter(w => !w());
            }
        }
    }

    write(message) {
        const json = JSON.stringify({ jsonrpc: "2.0", ...message });
        this.proc.stdin.write("Content-Length: " + Buffer.byteLength(json) + "\r\n\r\n" + json);
    }

    request(method, params) {
        const id = this.nextId++;
        return new Promise(resolve => {
            this.pending.set(id, resolve);
            this.write({ id, method, params });
        });
    }

    notify(method, params) {
        this.write({ method, params });
    }

    /** Resolves once check() is true for the diagnostics, fails after a while. */
    until(check, what) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error("timeout: " + what)), 5000);
            const waiter = () => {
                if (!check()) return false;
                clearTimeout(timer);
                resolve();
                return true;
            };
            if (!waiter()) this.waiters.push(waiter);
        });
    }

    async start() {
        const res = await this.request("initialize", { rootUri: pathToFileURL(this.root).href, capabilities: {} });
        this.notify("initialized", {});
        return res.result;
    }

    async stop() {
        await this.request("shutdown", null);
        this.notify("exit", null);
        await new Promise(resolve => this.proc.on("exit", resolve));
    }
}

/** Temporary workspace with the given {relative path: text}. */
function workspace(files) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "cindyscript-lsp-"));
    for (const [name, text] of Object.entries(files)) {
        fs.mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
        fs.writeFileSync(path.join(root, name), text);
    }
    return root;
}

const uri = (root, name) => pathToFileURL(path.join(root, name)).href;
const codes = list => (list || []).map(d => d.code);


// ==========================================================================
// Tests
// ==========================================================================
test("server: problems, navigation and changes, like an editor would use it", async () => {
    const root = workspace({
        "src/cindyscript/Init/[FUN] Helpers.cindyscript": "/** Adds one. **/\ninc(x) := x + 1;\n",
        "src/cindyscript/Init/[VAM] demo.cindyscript": "// A | Use\ny = inc(2);\nz = missing(1);\n",
        "out/ignored.cindyscript": "this would be a syntax error ((",
    });
    const client = new Client(root);
    const helpers = uri(root, "src/cindyscript/Init/[FUN] Helpers.cindyscript");
    const demo = uri(root, "src/cindyscript/Init/[VAM] demo.cindyscript");

    try {
        // --- capabilities ---
        const init = await client.start();
        assert.strictEqual(init.capabilities.definitionProvider, true);
        assert.strictEqual(init.capabilities.textDocumentSync.change, 1);

        // --- the whole workspace is checked, out/ is not ---
        await client.until(() => client.diagnostics.has(demo) && client.diagnostics.has(helpers), "workspace diagnostics");
        assert.deepStrictEqual(codes(client.diagnostics.get(demo)), ["unknown-function"]);
        assert.deepStrictEqual(codes(client.diagnostics.get(helpers)), []);
        assert.ok(![...client.diagnostics.keys()].some(u => u.includes("/out/")));

        // --- go to definition and hover, across files ---
        const position = { textDocument: { uri: demo }, position: { line: 1, character: 5 } };
        const def = (await client.request("textDocument/definition", position)).result;
        assert.strictEqual(def[0].uri, helpers);
        assert.deepStrictEqual(def[0].range.start, { line: 1, character: 0 });
        const hover = (await client.request("textDocument/hover", position)).result;
        assert.match(hover.contents.value, /Adds one\./);

        // --- outline, folding, workspace symbols ---
        const symbols = (await client.request("textDocument/documentSymbol", { textDocument: { uri: demo } })).result;
        assert.strictEqual(symbols[0].name, "A | Use");
        const folds = (await client.request("textDocument/foldingRange", { textDocument: { uri: demo } })).result;
        assert.ok(Array.isArray(folds));
        const all = (await client.request("workspace/symbol", { query: "inc" })).result;
        assert.deepStrictEqual(all.map(s => s.name), ["inc(x)"]);

        // --- typing in the editor: syntax error, then the missing function appears ---
        client.notify("textDocument/didOpen", { textDocument: { uri: demo, languageId: "cindyscript", version: 1, text: "y = (1 + ;" } });
        await client.until(() => codes(client.diagnostics.get(demo)).includes("syntax"), "syntax error");

        client.notify("textDocument/didChange", { textDocument: { uri: demo, version: 2 }, contentChanges: [{ text: "z = missing(1);" }] });
        client.notify("textDocument/didOpen", { textDocument: { uri: helpers, languageId: "cindyscript", version: 1, text: "inc(x) := x + 1;\nmissing(a) := a;" } });
        await client.until(() => codes(client.diagnostics.get(demo)).length === 0, "warning gone after definition");

        // --- unknown request ---
        const res = await client.request("textDocument/rename", {});
        assert.strictEqual(res.error.code, -32601);
    } finally {
        await client.stop();
        fs.rmSync(root, { recursive: true, force: true });
    }
});

test("server: files changed on disk are picked up", async () => {
    const root = workspace({ "a.cindyscript": "f(1);" });
    const client = new Client(root);
    const a = uri(root, "a.cindyscript");

    try {
        await client.start();
        await client.until(() => codes(client.diagnostics.get(a)).includes("unknown-function"), "first check");

        // On Linux node sets up a recursive watch asynchronously, give it a moment
        await new Promise(resolve => setTimeout(resolve, 300));

        // A new file defining f, written outside the editor (git, unpack, ...)
        fs.writeFileSync(path.join(root, "b.cindyscript"), "f(x) := x;");
        await client.until(() => codes(client.diagnostics.get(a)).length === 0, "definition from new file");

        // ...and removed again
        fs.unlinkSync(path.join(root, "b.cindyscript"));
        await client.until(() => codes(client.diagnostics.get(a)).includes("unknown-function"), "definition removed");
    } finally {
        await client.stop();
        fs.rmSync(root, { recursive: true, force: true });
    }
});

test("server: settings switch the warnings off", async () => {
    const root = workspace({ "a.cindyscript": "f(1);" });
    const client = new Client(root);
    const a = uri(root, "a.cindyscript");

    try {
        await client.start();
        await client.until(() => codes(client.diagnostics.get(a)).length === 1, "warning");
        client.notify("workspace/didChangeConfiguration", { settings: { cindyscript: { lint: { enable: false } } } });
        await client.until(() => codes(client.diagnostics.get(a)).length === 0, "warning switched off");
    } finally {
        await client.stop();
        fs.rmSync(root, { recursive: true, force: true });
    }
});
