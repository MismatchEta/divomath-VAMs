# CindyScript for VS Code

Editor support for the `.cindyscript` files in `src/cindyscript/`. Made for
this repository: it knows the conventions of the divoVAM framework and checks
the scripts with the parser of CindyJS itself, the engine they run in.

## Features

- **Highlighting** — built-in functions, own functions (also with blanks in the
  name: `draw label`), modifiers (`color->`), `'config` and `mod'` variables,
  `CONSTANTS`, `#`, strings with `""`, nested block comments, section headings
  like `// C.1 | Atom`.
- **Syntax errors** while typing, red, found by the CindyJS parser.
- **Warnings**, yellow, for traps from [CONTRIBUTING.md](../../CONTRIBUTING.md):
  - calls of functions that are defined nowhere, or not with that many
    arguments — CindyJS would only log "Called undefined function"
  - multiple assignment `[a, b] = …`
  - variables named `color`, `size`, `alpha`, `font` or `bold`
- **Navigation** — outline of sections, functions and object methods; go to
  definition (F12) across all scripts; hover with signature and doc comment;
  Ctrl+T for every function in the workspace.
- **Editing** — indentation while typing (tabs, width 2, like the existing
  scripts), bracket pairs, Ctrl+/ for comments, folding of brackets, block
  comments and sections, `* ` continued inside `/** … */`.

The Problems panel lists the findings of all scripts, not only the open ones.

## Install

1. Command palette (Ctrl+Shift+P): **Developer: Install Extension from Location...**
2. Choose the folder `tools/vscode-cindyscript`.

VS Code uses the folder in place, so after a `git pull` that changes the
extension, **Developer: Reload Window** is enough.

## Settings

| Setting | Default | |
|---|---|---|
| `cindyscript.lint.enable` | `true` | Show the warnings. Syntax errors are always shown. |
| `cindyscript.lint.externalFunctions` | divomath hooks, `fontfamilies` | Functions that exist without a definition in the scripts. |

## Files

| File | |
|---|---|
| `extension.js` | VS Code side: keeps the index up to date, shows its results |
| `lib/analysis.js` | everything else: tokens, warnings, index of definitions, outline. Knows nothing about VS Code |
| `lib/Parser.js`, `lib/builtins.json` | from the CindyJS sources, written by `update_cindyjs.py` |
| `syntaxes/cindyscript.tmLanguage.json` | grammar for the highlighting |
| `language-configuration.json` | brackets, comments, indentation |

## Tests

```bash
node --test tools/vscode-cindyscript/test/analysis.test.js
```

## Another CindyJS version

Parser and list of built-ins match the CindyJS the page loads
(`cindyjs.org/dist/v0.8`, commit `f52f219`). After switching versions:

```bash
python3 tools/vscode-cindyscript/update_cindyjs.py <commit>
```

`lib/Parser.js` is the parser of CindyJS, unchanged apart from a header,
licensed under the Apache License 2.0 (`lib/LICENSE-CindyJS`).
