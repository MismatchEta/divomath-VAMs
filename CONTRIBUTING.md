# Working on divoVAM

For everyone changing the scripts. How to build, test and upload is in the
[README](README.md); this file is about the code itself: where things live, the
conventions, and the traps CindyScript and CindyJS set. Most of the traps below
took hours to find — read them before your first change.


## Where things live

Everything lives in the **Init** event, `src/cindyscript/Init/`, one file per
section. The other events (`Draw`, `Tick`, `Mouse down`, …) hold one framework
script each. The prefix tells you what a section is:

| Prefix | Contents |
|---|---|
| `[FUN]` | Free functions — drawing, geometry, strings, logging, divomath interface |
| `[FW]` | Constants, configuration, init entry and exit |
| `[C]` | Classes — `Button`, `Toggle`, `TextInput`, `Keyboard`, `ScrollBar`, `Workbench`, … |
| `[VAM]` | One section per widget. `[_VAM]` marks unfinished ones |

Order matters: sections run in the order of `src/manifest.json`, so a constant
has to be defined above its first use at init time.

**Widgets.** Each `[VAM]` section is wrapped in `if(VAM == "<name>", …)` and
follows the same layout: *A Documentation*, *B Configuration*, *C Class
Definitions*, *D Initialization*. `[VAM] default` is a small working example to
start from.

**Objects.** Everything the framework draws or lets the user interact with sits
in the global list `obj`. Classes are constructor functions returning a
dictionary, usually built on `new VAMobject(type)`; methods are fields defined
with `:=` (`o:"draw" := …`, `o:"click" := …`). The draw script draws `obj` in the
order of `typeorder`.


## Conventions

- **Comments in English, user-facing documentation in German.** The audience
  for the docs is the German-speaking editorial team.
- **Global widget configuration** uses an apostrophe prefix: `'barwidth`,
  `'showincolor`. Speaking names, no abbreviations.
- **Modifier parameters** use a `mod'` prefix — `mod'color`, `mod'font`. Without
  it an unset modifier captures a same-named variable from the surrounding scope.
- **Never name a variable** `color`, `size`, `alpha`, `font` or `bold`. Those
  shadow the drawing modifiers of the same name.

### Configuration

```cindyscript
'name = default to(ENVIRONMENTALPARAMS:"name", default, parse);
'flag = tobool('flag);   // divomath reports "" instead of false
```

`ENVIRONMENTALPARAMS` merges URL parameters, the divomath state and the editor
defaults into one place. With `parse` set to `true` the value is run through
`parse()` — right for numbers and lists of numbers, wrong for a list of keys:
`parse()` reads bare words as variable names. Use `to key list()` for those.

Inside divomath the sources win in this order, strongest first: previous answer,
`__` references in the `cindyjs` object, `__` references at top level, stored
state, editor default. The details are in `[FUN] Divomath`.

### Layout

Position everything against `VISIBLERECT` and its corners `VRTOPLEFT`,
`VRTOPRIGHT`, `VRBOTTOMLEFT`, `VRBOTTOMRIGHT` — never against `screenbounds()`
directly. Inside divomath the rect is fixed at 24 × 18, in the standalone page it
follows `?rect`.

### Sizes

- **Scaling factors** (`FONTSCALE`, `UISCALE`, `IMGREFRESOLUTION`) are applied at
  exactly one point — where the size first comes into existence, and nowhere
  else. Values passed down through several classes (Keyboard → Key → Button)
  must not be multiplied again on the way. Cinderella hides a double factor:
  `FONTSCALE` is close to 1 there (about 1.24 at a usual window size), in the
  browser both factors multiply.
- **Font sizes** are pixels times `FONTSCALE`, applied in the classes where the
  size is defined, not in the drawing functions. `get boundingbox` measures with
  the same number, so the two cannot drift apart.
- **Images**: `drawimage()` measures in *world units*, world size = pixel size /
  72 · `scale`. Use `image scale fit(img, boxsize)` from `[FUN] Drawing`. A
  `screenresolution()` in an image scale is always wrong — it does not cancel
  out, it scales the image with the canvas. At a fixed canvas size this goes
  unnoticed; tell-tale signs are compensating values that cannot be right, like
  a "fraction of the area" of 2 or 3.7.

### Text

`draw label(coord, text, size)` with the modifiers `mod'font`, `mod'color`,
`mod'bold`, `mod'alpha`; `draw boxedlabel()` adds a background (`mod'bgcolor`).
`draw textbox()` is an older alias that is being phased out — use `draw label`
in new code.

### Talking to divomath

- **Serialise with `to json(value)`** from `[FUN] Strings`. It quotes and
  escapes strings itself, so never add `QUOTE` by hand. `divomath put result()`
  serialises through it as well.
- **Component names in divomath** must not contain spaces or brackets: the name
  ends up in a JavaScript callback, `VAM (unstable)` is a syntax error.

### Performance

`rounded rectangle()` builds four circles, two polygons and a CSG shape on every
call. With many objects use `rounded rectangle poly()` and `fillpoly` instead.


## Debug keys

The running widget listens for a few keys, defined in the `[FW] keypressed`
script:

| Key | Effect |
|---|---|
| `y` | Dump the settings — `ISCINDYJS`, `screenbounds()`, `ENVIRONMENTALPARAMS`, `BGCOLOR`, `LOGLEVEL`, and the whole divomath block |
| `x` | Call `divomath set state()` and `divomath update results()` and print what they return |
| `c` | Print the stored log messages (`MAXLOGMESSAGES` of them) |
| `s` | Push results and state to divomath, as an interaction would |
| `+` / `-` | Raise or lower `LOGLEVEL` at runtime, clamped to 0..3 |

From level 2 upwards the widgets draw their own hitboxes; level 3 adds
`VISIBLERECT`, distance circles around the origin and the widget's docstring.
`?debuglevel=3` sets the same thing from the URL.

The build ships with `csconsole: false` (see `src/cindyjs.json`), so there is no
console element on the page — but `println` still reaches the **browser's
JavaScript console**, so the keys are useful in the browser and not just in
Cinderella.


## CindyScript traps

None of these raise an error. They just quietly do the wrong thing.

- **`if()` with an undefined condition runs neither branch.**
  `if(___, A, B)` does nothing at all. This hits every `if(my("field"), …)` on a
  field that was never set. Initialise fields with `false` instead of `NADA`, or
  wrap the condition in `tobool()`.
- **One undefined part makes a whole string undefined.** `"text" + ___` is
  `___` — which is why debug output sometimes prints nothing. Check the parts
  with `isundefined()` one by one.
- **No multiple assignment.** `[a, b] = [7, 9];` leaves both undefined.
- **`isundefined()` on compound return values.** `isundefined(imagesize(img))`
  is true even for a valid `[421, 421]`. Always test a component:
  `isundefined(imagesize(img)_1)`.
- **Undefined entries in `list and`.** `list or()` treats `___` like false.
  For `list and()`, wrap entries that can be undefined in `tobool()`, otherwise
  `___` can count as "not false" and the result turns true.
- **No `apply()` over a dictionary**, use `values()`. Numeric indices into a
  dictionary (`toggles_(5..9)`) are just as fragile: they rely on insertion
  order and shift with every addition. Both work in Cinderella and fail in
  CindyJS — in the percentagebar two of three toggle columns went missing this
  way.
- **`regional()` locks class methods out.** Methods defined with `:=` do not run
  in the scope of the Init script. Configuration variables read from methods
  must therefore not be `regional`.
- **Variables are case-sensitive, functions are not.** `nada` and `NADA` are two
  variables; `list or` and `listor` are the same function, spaces don't count.


## Cinderella is not CindyJS

The scripts run in two engines that disagree in ways Cinderella hides. Anything
that gets drawn or serialised has to be checked in the browser, because plenty
of things look right in the Cinderella window and are not:

| | Cinderella | CindyJS |
|---|---|---|
| `apply()` over a dictionary | returns the values | returns nothing — use `values()` |
| `if(___, a, b)` | — | runs *neither* branch, silently |
| `length(___)` | `0` | undefined |
| strings inside a dictionary, turned into text | without quotes | with their own quotes |
| `pixelsize(..., font->)` | evaluates | "Modifier not supported" |
| `fillpoly(..., color->)` | applies | ignored for some point lists |
| `drawimage(..., ref->)` | anchors the image | ignored, image stays centred |
| `drawimage(..., rendering->)` | evaluates | ignored (CindyJS calls it `interpolate->`) |

`length(___)` in particular: never apply it unchecked to something that can be
undefined. That was the cause of the `to json` error in divomath.


## Embedding

**Never use `?full` for Storyline.** Without a fixed canvas size the ratio of
text to objects depends on the embedding. The fixed 885 × 519 is the normal case
and right. Storyline loads local web objects without URL parameters, so use an
`index.html` that redirects with the parameters — see
`usage examples/storyline/`.


## Versioning

- The build number lives in `src/BUILD`; every build counts it up and stamps it
  into the header of the HTML and the `.cdyjs`. Commit it along with your change.
- [CHANGELOG.md](CHANGELOG.md) entries are headed `v<major>b<build>` and grouped
  into FRAMEWORK, VAM and GENERAL.
- The major version only changes when the end product changes significantly —
  not for changes to the tools or the repository.
