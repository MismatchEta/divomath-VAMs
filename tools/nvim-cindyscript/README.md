# CindyScript for Neovim

Editor support for the `.cindyscript` files in `src/cindyscript/`, the
Neovim counterpart of the [VS Code extension](../vscode-cindyscript/README.md).
Both use the same analysis, so they report the same problems.

## Features

- **Highlighting** — built-in functions, own functions (also with blanks in the
  name: `draw label`), modifiers (`color->`), `'config` and `mod'` variables,
  `CONSTANTS`, `#`, strings with `""`, nested block comments, section headings
  like `// C.1 | Atom`.
- **Syntax errors** while typing, found by the parser of CindyJS itself.
- **Warnings** for traps from [CONTRIBUTING.md](../../CONTRIBUTING.md):
  unknown functions or wrong number of arguments, multiple assignment
  `[a, b] = …`, variables named `color`, `size`, `alpha`, `font` or `bold`.
- **Navigation** — outline of sections, functions and object methods, go to
  definition across all scripts, hover with signature and doc comment, search
  over every function of the workspace.
- **Editing** — indentation by brackets (tabs, width 2, like the existing
  scripts), `gc` comments, `*` continued inside `/** … */`, folding of
  brackets, block comments and sections.

Highlighting and editing come from plain runtime files; errors, warnings and
navigation from a small language server (`server/cindyscript-lsp.js`).

## Requirements

- **Neovim 0.11** or later
- **Node 18** or later, as `node` on the `PATH` — it runs the language server
- The folder `tools/vscode-cindyscript/` next to this one: the server and the
  highlighting take the analysis and the list of built-in functions from there

## Install

With [lazy.nvim](https://github.com/folke/lazy.nvim):

```lua
{
  dir = "/path/to/divomath VAMs/tools/nvim-cindyscript",
  name = "cindyscript",
  main = "cindyscript",
  lazy = false,
  opts = {},
}
```

Without a plugin manager, in `init.lua`:

```lua
vim.opt.rtp:append("/path/to/divomath VAMs/tools/nvim-cindyscript")
require("cindyscript").setup()
```

Use Lua as above if the path contains blanks — `:set rtp+=` would need them
escaped. Updates arrive with `git pull`; restart Neovim afterwards.

## Use

Neovim 0.11 brings the keys along:

| | |
| --- | --- |
| `K` | hover: signature and description of the function under the cursor |
| `Ctrl-]` | go to its definition |
| `gO` | outline of the file |
| `]d` / `[d`, `Ctrl-W d` | next / previous problem, show the one under the cursor |
| `:lua vim.diagnostic.setqflist()` | problems of **all** scripts in the quickfix list |
| `:lua vim.lsp.buf.workspace_symbol()` | search every function of the workspace |
| `zc` / `zo`, `zM` / `zR` | fold / unfold, everything |

`:checkhealth vim.lsp` shows whether the server is running.

## Options

Passed to `setup()` (or `opts` with lazy.nvim):

| Option | Default | |
| --- | --- | --- |
| `lint` | `true` | Show the warnings. Syntax errors are always shown. |
| `external_functions` | divomath hooks, `fontfamilies` | Functions that exist without a definition in the scripts. |
| `folding` | `true` | Fold by the server's ranges. |
| `cmd` | `{ "node", ".../server/cindyscript-lsp.js" }` | How to start the server. |

## Files

| File | |
| --- | --- |
| `plugin/cindyscript.lua` | registers the file type |
| `ftplugin/cindyscript.lua` | tabs, comments, folding |
| `indent/cindyscript.lua`, `lua/cindyscript/indent.lua` | indentation by brackets |
| `syntax/cindyscript.lua` | highlighting, the rules of the VS Code grammar in Vim's regex dialect |
| `lua/cindyscript/init.lua` | `setup()`: registers and enables the language server |
| `server/cindyscript-lsp.js` | language server, uses `../vscode-cindyscript/lib/analysis.js` |

## Tests

```bash
node --test tools/nvim-cindyscript/test/server.test.js
```
