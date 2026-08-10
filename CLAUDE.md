# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

divoVAM is a CindyJS-based framework of "Virtuelle Arbeitsmittel" (VAMs) — interactive
math manipulatives (number cards, divisor strips, percentage bars, distributive-law grid,
strapwork/pattern containers, thales circle, local derivative, ...) embedded as widgets
into the **divomath** editor and deployed to **abako.dzlm.de**. All widget logic is written
in **CindyScript**, Cinderella's scripting language, inside a `.cdy` construction file that
is edited with the Cinderella desktop app (not a text editor).

## Repository layout

- `v1/` … `v7/` — successive framework generations, each roughly self-contained. **`v7` is
  the current/active version**; treat older `vN/` folders as historical reference only
  unless explicitly asked to work on them.
- `README.md` — the authoritative (German) reference for the divomath integration
  protocol: component-behavior keys, per-VAM `cindyjs` state parameters, validation/result
  keys, cross-component referencing (`__`-prefixed overrides), and a manually maintained
  changelog. **Consult and update this file when you add/rename/remove a VAM's config or
  result keys** — it is not generated from source.
- `spezifikationen/` — original stakeholder specs per VAM (images, PDFs, markdown, an email
  thread) describing intended behavior; useful when a requirement is ambiguous.
- `web version/` — a standalone HTML/CSS harness for choosing/configuring a VAM outside
  divomath.
- `_tests/`, `_philipp/` — local scratch/experiment folders, excluded via `.gitignore`.

## Working with v7

Source of truth is `v7/divoVAM v7.cdy` (a zip archive; open/edit it in Cinderella). Two
files must stay in sync, both produced by Cinderella:

- `divoVAM v7.cdy` — the construction, edited in the Cinderella app. Holds *all* CindyScript
  event scripts (draw, init, tick, mouse*, keydown, ...), each stored as numbered,
  ordered sub-scripts per event inside the archive (`private/de.cinderella/scripts/<Event>/<n>/<label>.cs`).
- `divoVAM v7.html` — the Cinderella HTML export. Holds everything *except* script code
  reliably (geometry, appearance, animation, ports/canvas config) — its script content is
  incomplete, so it is never used as the source for scripts.

After editing in Cinderella, save (updates the `.cdy`) and re-export (updates the `.html`),
then build both deliverables:

```
cd v7
python3 build.py "divoVAM v7"
```

This reads scripts from the `.cdy` zip and everything else from the `.html` export and
writes:

- `out/divoVAM.html` — the export patched for pen/touch input and URL-selectable
  layout (`?full`, `?rect=<preset|a,b,c,d>`) → upload to abako.dzlm.de.
- `out/divoVAM.cdyjs` — a JS module (`() => ({ scripts: {...}, ... })`) for import into
  divomath. Its leading comment carries an auto-incrementing build number/timestamp
  (continued from the previous `out/divoVAM.cdyjs` if present).

Useful flags: `--html-only` / `--cdyjs-only` to build just one artifact, `--rect a,b,c,d`
to override the baked-in `visibleRect`, `--img-base` to point icon URLs elsewhere. No
dependencies beyond the Python 3 stdlib.

The build script itself warns (but does not fail) if the `.cdy` and `.html` mtimes are
more than 60s apart — that means Cinderella's save and export are out of sync and one of
them should be redone before building.

Note: `v6/` used a different, now-superseded build (`build.js` + a hand-split `src/`
tree driven by `src/eventOrder.js`) where scripts lived as individual files on disk. `v7`
replaced that with editing directly in Cinderella and extracting scripts straight from the
`.cdy` archive, so there is no `src/` tree to keep in sync for v7.

## CindyScript architecture (inside the construction)

Scripts run per event (`draw`, `init`, `mousedown`, `mouseup`, `mousedrag`, `mousemove`,
`keydown`, `tick`, ...). The `init` event loads, in order: framework helper functions →
framework constants/config/init-start → OO-style "classes" (`Button`, `CoordinateSystem`,
`Keyboard`, `ProgressCircle`, `Plottable`, `ScrollBar`, `TextInput`, `Toggle`, `VAMobject`,
`Workbench`) → one block per VAM (`default`, `distributive`, `divisors`, `numbercards`,
`percentagebar`, `strapwork`, `thales`, `localderivate`) → init-end. Order matters: later
blocks depend on earlier ones (e.g. VAM blocks use the classes and helpers defined above
them), so when adding a new script inside Cinderella, place it in the correct
event/position.

Runtime objects live in a global `obj` list/dict of drawable entities (each with keys like
`type`, `draw`, `ishot`); `draw` renders them grouped by `typeorder`, `mousedown` builds a
`hotlist` by testing `ishot` at the mouse position. This pattern is shared by all VAMs.

## divomath integration protocol

Each VAM reads its configuration from two places in the divomath editor: **component
behavior** (`configuration` key — `cindyJsPrefix`, `vam` switch, `debuglevel`, `bgcolor`)
and **state** (`cindyjs` key — VAM-specific parameters, documented per VAM in
`README.md`). Results are reported back via `divomathAddResult`/`divomathPutResult` and
read as `<component>{RESULT_<name>}`. A VAM can pull another component's state/result by
defining a top-level `__<key>` override in its own state — see the "Referenzierung" section
of `README.md` for the exact mechanism before relying on or changing it.
