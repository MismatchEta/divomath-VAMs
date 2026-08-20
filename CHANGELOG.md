# Changelog

Version scheme since v5: `<major>b<build>`. The build number keeps counting
across major versions and is also stamped into the header of every built file.

## v7b426

- FRAMEWORK:
  - **image scale fit()** added in `[FUN] Drawing`: returns the `scale` value
    that fits an image into a given box of world units. Along with it the
    constant **IMGREFRESOLUTION** (72).
  - Fix ImageButton: image size depended on the resolution. `drawimage()`
    measures images in **world units** (world size = pixel size / 72 · scale),
    while the old formula multiplied by `screenresolution()` on top of that. It
    went unnoticed at a fixed canvas size because the factor stayed constant —
    with **?full** or a different **?rect** the icons grew or shrank relative to
    their buttons.
  - **imgfill** consequently means what its name says again: the fraction of the
    button the image covers. The previous values (2 and 3.7) were compensating
    for the bug and have been readjusted.
- VAM:
  - distributive: the tool button is now a regular **ImageButton** instead of a
    special construction.
  - thales: **imgfill** of the angle toggles and buttons adjusted to the
    corrected scaling.

## v7b422

- FRAMEWORK:
  - **UISCALE** introduced: scales the controls (Button, Toggle, TextInput,
    Keyboard) independently of whatever a widget draws itself. Defaults to 1, so
    nothing changes for widgets that do not set it.
  - Keyboard: **"full"** layout added (QWERTZ with shift key, digit row, space
    and enter). The subtype was accepted before, but only digit keys were built.
    The numeric layout is unchanged.
  - Fix TextInput: **keyboardtype** was ignored, a numeric pad was always
    created. On top of that **keysize** was assigned twice, and the second
    assignment overwrote the numeric/full distinction.
  - Fix Toggle: **cornerradius** used the unscaled constructor size.
- VAM:
  - percentagebar: parameter **uiscale** (see above). The control panel is
    anchored to the bottom left corner of the visible area and scales from there.
  - Fix percentagebar: columns 2 and 3 of the toggles were not drawn in the
    export. The cause was `apply()` over a dictionary plus a numeric index into
    one — both work in Cinderella, neither works in CindyJS.
- GENERAL:
  - **Freehand drawing** for standalone use, via `?draw` (see
    [Standalone-Betrieb](docs/doc-german.md#standalone-betrieb-abakodzlmde)). The
    tool comes from earlier work on the double number line and was cleaned up:
    Storyline mode removed (it does not run as a web object anyway), dead code
    and six bugs eliminated.
  - `build.py` copies `freehand-drawing.js` into the output directory; the file
    has to be uploaded next to the HTML.

## v7

- GENERAL:
  - Build process unified: **build.py** produces both target formats from one Cinderella export and its .cdy (patched HTML for abako, vam.cdyjs for divomath) into an out directory
  - Scripts are read from the .cdy archive rather than from the HTML export, which omits some of them
  - The HTML export is patched during the build: touch-action against iPadOS "Scribble", **?full** for a window-filling canvas, **?rect=** to choose the visible world section — one file instead of two
- FRAMEWORK:
  - **ENVIRONMENTALPARAMS** as the single configuration interface. **defaultstateto()** and the separate `if(!ISDIVOMATH, ...)` blocks are gone from all widgets, replaced by **default to()**
  - **VISIBLERECT** introduced as the layout reference rectangle (with **VRTOPLEFT**, **VRTOPRIGHT**, **VRBOTTOMLEFT**, **VRBOTTOMRIGHT**). Fixed inside divomath, derived from the actual section otherwise. All widgets position against it instead of screenbounds()
  - **FONTSCALE** introduced: font sizes are defined in pixels, everything else in world units — the factor keeps the ratio constant regardless of canvas size and section
  - **to json()** and **escape json()** added. The divomath state is now serialised explicitly instead of by string concatenation — Cinderella and CindyJS treated strings inside dictionaries differently, which produced syntax errors in divomath. The widgets therefore no longer place QUOTEs by hand
  - **divomath put result()** serialises its value through to json() as well. Undefined values and lists now arrive intact
  - Referencing: dunder keys are now looked for inside the cindyjs object **and** at top level (cindyjs wins), and the prefix is stripped before storing — previously the value ended up under a key nobody reads
  - Text output rebuilt: **draw label()** and **draw boxedlabel()** with the **mod'** modifier convention (mod'font, mod'color, mod'bold, mod'alpha, mod'bgcolor). **draw textbox()** remains as an alias
  - Button: the label is now centred correctly inside the hitbox regardless of font family and size. Drawn symbols (**drawplus**, **drawminus**, **drawcross**) instead of special characters, which cannot be centred cleanly
  - ImageButton: image size is derived from the button size (**imgfill**) instead of a fixed scale factor that depended on the resolution
  - **list()**: the object branch was removed again — it decomposed a single widget object into its field values. Use **values()** for that
- VAM:
  - **thales** (new): Thales' theorem with a movable point C, angle arcs, stamping and trace
    - Angle list is single-column and scrollable, follows new entries automatically
    - Angle and side labels through generic functions; the position now depends on the opening angle instead of hand-tuned offsets
    - Labels scale uniformly and with damping (**anglelabelsize**, **anglelabelgammafactor**, **anglelabelminscale**)
    - Trace as segments: pausing no longer erases what was drawn, undo removes exactly the last section (**tracesize**, **tracecolor**, **traceminstep**)
    - Stamp colour gradient fixed and made configurable (**stampgradient**, **stampgradientstrength**, **stampcolor**)
    - **softc** inverts its meaning: true = soft construction (**note** for existing configurations)
    - Reset and undo buttons can be hidden individually (**showundobutton**, **showresetbutton**); **showhistorybuttons** removed
  - percentagebar:
    - Fix: **numberofbars** and every other URL parameter stopped working (ENVIRONMENTALPARAMS was overwritten after being read)
    - Fix: snapbar only affected the last bar; it now follows the subdivisions of its own bar and no longer snaps when the subdivisions are hidden
    - Arcs and subdivision display coupled
    - **alwaysdrawarches** is now the toggle's initial value instead of a permanent override — the toggle stays visible and operable
    - **overflow** and **hidetoggles** added as parameters
    - Fix: the plus key's overflow behaviour was inconsistent with dragging and direct entry
  - distributive:
    - Expression display built generically: brackets disappear once the field has been cut; after collapsing back to "none" the counts appear instead of the multiplications
    - **requiregrouping** added: colouring and cutting only after a row or column structure has been chosen
    - Fix: **coloredcolindex** was not converted back when saving — the value flipped between two states on every slide change
    - Fix: cuts were toggled instead of set when restoring
    - Fix: **cuthorizontally**/**cutvertically** could not be evaluated when false
    - Performance: atoms are drawn as a polygon outline instead of a CSG union of circles and rectangles
  - strapwork:
    - Fix: the container extended past the visible area; the space calculation now applies to finite limits as well
    - Fix: too few limit entries caused index errors
    - Fix: validation reported a 0 at separator positions instead of the polygon — polygon and separator shared the same key
    - Fix: **rcstate** followed **rows** instead of **rcrows**
    - **rcinteractable** now accepts the same notation as **interactable**
  - divisors:
    - Fix: tiles were not assigned to a strip, causing an infinite loop while rearranging
    - The UI below the strips is anchored to VISIBLERECT instead of fixed coordinates
    - The equation is typeset as one text instead of four measured fragments
    - **fontsize** added
  - numbercards:
    - Fix: with several cards, later cards inherited the place cards of earlier ones
    - Fix: clicks on the plus/minus buttons of the place cards were only detected by chance
    - Fix: the school font was never used (wrong constant name)

## v5.194

- GENERAL:
  - Version scheme changed to <main>.<build> (currently version 5, build 194)
  - The build number keeps counting across versions
- FRAMEWORK:
  - helper functions:
    - Functions for drawing circular arcs (based on an angle) added: **arc(), drawarc(), drawclosedarc(), drawangle()**
    - Convenience functions (**vectorlength(), normalize(), todeg(), torad()**)
    - Convenience overload for drawtextbox added
    - numerals changed: now returns the numeral of ANY number, following Duden conventions (spacing and so on)
    - Wrappers for the divomath functions added (**divomathPutResult()** for **divomathAddResult()**)
    - Ordering in **defaultstateto()** changed so that the last divomath result is consulted first and the overwrites only afterwards
- VAM:
  - percentagebar:
    - Fix: the toggle button "label" did not show the configured unit
    - Fix: the "Eingabe P" text field did not show the correct number
    - Fix: various miscalculations in the interaction between the text inputs
    - Parameter for configuring the position of the percentage bar added
  - strapwork:
    - Resizing behaviour of the reset button changed
    - Resizing behaviour of the separator changed
    - Fix: the separator reported its position relative to the polygons of its container incorrectly
    - The reset button now resets to the referenced state
    - Handle for configuring the separator's scaling individually added (**sepsize**)
    - **interactable** handle changed to a string, so that individual parts can be made (non-)interactive through it
    - A larger circle added to the separator's hitbox to make it easier to grab
    - Fix: the separator reports the state where it is dropped, not where it is sorted to afterwards (even if there are no polygons at that spot)
    - Drawing order of the polygons changed

## v5.2.3

- VAM:
  - distributive:
    - divomath state and result reporting implemented (validation and referencing)

## v5.2.0

- VAM:
  - distributive:
    - Init state **groupby**: initial grouping state
    - Init state **expressionposition**: position of the expression display
    - Init state **expressionmoveable**: expression movable or not
    - Init state **verbalposition**: position of the verbal description
    - Init state **verbalmoveable**: verbal description movable or not
    - A visual line shows the cut state in addition to the spacing
    - Text presentation changed
    - Fix: stop parsing some string URL parameters (parsing yields NADA otherwise)
    - removed: init state **lblpadding**

## v5.1.0

- VAM:
  - distributive:
    - Init state **fontsize**: font size for the expression and the verbal description
    - Init state **drawexpression**: show the expression
    - Init state **drawverbal**: show the verbal description of the expression
    - Init state **drawtoolbutton**: show the tool button or not
    - Init state **tool**: tool selected at start
    - Init state **toolbuttonx**: x coordinate of the tool button
    - Init state **toolbuttony**: y coordinate of the tool button
    - Init state **groupingtype**: which groupings a click can produce (none, row, column, both)

## v5.0.0

- FW:
  - constants:
    - Image of a circular button added to ICONS
- CLASS:
  - Button:
    - Subclass ImageButton() added
- VAM:
  - strapwork:
    - Fix: the scrollbar covered the reset button
    - Fix: the scrollbar was not displayed properly at start when the container was too full
    - The triangle polygon was too large; now scaled by .9
    - Init state **patternstate**: state of the pattern container
    - Init state **drawresetbutton**: show the reset button or not
    - Init state **interactable**: container can be interacted with or not

## v4.3.0

- VAM:
  - strapwork:
    - Reference container added

## v4.1.0

- VAM:
  - distributive:
    - New colouring logic. Drawing a row now colours the corresponding columns and vice versa.
    - divomath state controls added.
- FW:
  - constants:
    - VALUEMAP added, mapping the number words to the numbers 1 through 12
  - helper functions:
    - numerals(\<int>) added: returns the number word for an integer if that integer is smaller than 13, and the number itself (as a number) otherwise.

## v4.0.0

- VAM:
  - new widget: (percentagebar, ) distributive
  - divisors: 
    - Workaround implemented for the divomath problem of not reporting state values back correctly
  - strapwork: 
    - Workaround implemented for the divomath problem of not reporting state values back correctly
    - Fix: the separator was not included in the result for a whole row.
    - Fix: polygons were reordered incorrectly when inserted through the pattern container
    - divomathUpdateResults() also runs when a separator is updated
    - Background of the base polygons changed from gold to a dark grey border
    - Copies of the separator in a lighter grey than the original separator
    - The reset button now also resets separators
    - Inside divomath the reset button restores the state configured in the editor, not the last state when the slide was opened
    - The PatternContainer is now multiline
    - The PatternContainer can be given a limit; state variable **patternlimit** added.
- CLASS:
  - Button: 
    - Fix: wrong colour rendering
    - Feature: isfloating flag, to toggle whether the button can be moved
- FW:
  - draw: 
    - Debug information adjusted
    - 'firstdraw flag for tracking whether the draw function is being called for the first time
  - constants: 
    - Images added along with the corresponding constant for image references (ICONS)
    - CDOT changed, now contains a space before and after
  - divomathconfig: 
    - usedivomath added as a flag for switching to the storyline/web config
    - 'dmdefaultstate added, for direct access to the cindyjs object from the divomath editor state description. As opposed to 'dmstate, the state last saved when leaving a slide.
  - helper functions: 
    - inpoly(): check added for whether the solution of linearsolve() is defined
    - +postValue(): posts a message for communicating with the browser (or the SL player)
    - +incircle(): checks whether a point lies inside a circle
    - +getURLparam() and getURLparams(): read the URL search parameters and return them
  - configuration: 
    - +'urlparams: stores all URL search parameters as a dictionary.
    - the vam switch for the widget to play out is configurable through 'urlparams
    - 'debuglevel likewise
    - debugging output added
  - mousedown: 
    - set the mousedown variable to true
  - mouseup: 
    - set the mousedown variable to false
  - keydown: 
    - "k/K": manual call of divomathUpdateResults()
    - "+/-": increment and decrement 'debuglevel (numpad only?)
- build process for the divomath code moved into a separate script

## v3.1.0

- VAM: 
  - divisors: 
    - Fix: the UI at the bottom is separated visually from the upper part by a horizontal line rather than a rectangle
    - Fix: blobs are created at random positions inside the world viewport, not somewhere on the screen
    - Buttons can now be hidden individually (~~drawbuttons~~ --> drawblobbuttons & drawdivbuttons)
    - The vertical bar for setting the divisor can be shown or hidden (drawbar)
    - default timing changed from 1 to .5
    - fix: the bar disappeared when the page was reloaded
  - numbercards: 
    - Fix: the alpha value is set to 1 when the page is opened again
    - Fix: always show place cards, including above the number card at start
    - Fix: wrong colours and colour changes when collapsing (defined incorrectly in constants)
    - divomathUpdateResults() bound to button presses
    - Workaround implemented for the divomath problem of not reporting state values back correctly
  - strapwork: 
    - The pattern container is no longer fixed in size. It adapts to its contents.
    - Appearance of the separator adjusted (ellipse instead of circle)
    - divomathUpdateResults() bound to the movepolysintoplace() method
    - divoYellow background added for the base polygons
    - Layout adjusted (container at the bottom, pattern container at the top)
    - Submission reporting for a whole row added (as row1, row2, ...)
- FW: 
  - global drawing: 
    - divomathUpdateResults() is called when 'fristdraw==true
  - configuration; 
    - 'firstdraw flag added, set to false at the end of the draw script.
  - constants: 
    - DIVOYELLOW added as a colour
    - Fix: the colour definitions of DIVORED and DIVOBLUE were swapped
  - helper functions: 
    - values() added: returns the values of all keys of an object as a list
    - ellipse() added: draws ellipses based on axes and rotation angle
    - defaultto() added: assigns a default value to a variable
    - defaultstateto() added: handles the divomath state definition from its various sources
    - getboundingbox(3) overloaded with a new definition
    - label bg removed from drawtextbox() — for whatever reason it does not work in HTML
    - tobool() and isbool() added, for converting to bool and checking the type easily
  - **new** *keypressed*
    - Mainly for debugging; currently shows some mostly divomath-specific information when "k" is pressed.
- CLASS: 
  - Button: 
    - Attributes labelheight and fontfamily added
  - TextInput: 
    - Attributes labelpadding and fontfamily added

## v3.0.0

- new widget: percentagebar as a preview

- VAM: 
  
  - divisors: 
    
    - Configuration for the appearance of the UI buttons added (**drawbuttons**)
    - Fix: **color** configuration
  
  - numbercards: 
    
    - Colour button changed. It is now grey when the cards are grey too, and coloured when the cards are coloured.
    - Click behaviour of the number cards changed: 
      - Child place cards are no longer deleted after the animation to form one whole card. Instead the place cards are kept and only animated in position. (~ line 503, setpropertylater() commented out)
      - Colours are no longer faded when expanding and collapsing either. Place cards (and colours) stay visible in the collapsed state as well. (~ lines 523 and 562 commented out, but the animation construct kept)
  
  - strapwork: 
    
    - RegPolys are "equally sized". For polygons with an even number of vertices, opposite edges are 2*RADIUS apart; with an odd number of vertices every vertex is 2*RADIUS from its opposite edge. Previously they all shared the same circumcircle with RADIUS.
    - RegPolys are aligned with their bottom edge parallel to the x axis, unless "rotation" is specified (not configurable from divomath)
    - If a RegPoly is a circle it is no longer handled as a circle but as a 100-gon, for consistency. "shape" and "draw" adjusted accordingly
    - dm config: 
      - **vertices**: polygons can only be given as a list of vertex counts, no longer alternatively as a number. So only e.g. [3,6,9] for a triangle, a hexagon and a nonagon. No longer e.g. "4" to build four polygons with increasing vertex counts (circle, triangle, quadrilateral, pentagon)
      - **colors**: the same applies to colours. A list *MUST* be given that has the same length as **vertices**, or NOTHING at all. In that case the list [1,2,3,...] is used (the default order of the DIVOMATH colour palette).
      - NEW **state** ([ ] \<string>): defines which of the polygons declared through **vertices** and **colors** are in the container at start. For **vertices**=[0,3,4] and **rows**=3, ["1,2,2", "3,3,3", ""] sets the container so that the first of the three strips holds polygons 1-2-2 (circle, triangle, triangle), the second holds 3-3-3 (quadrilateral three times) and the third is empty.
      - NEW **drawpatterncontainer** (\<bool>): true if the PatternContainer should be drawn.
      - **borders** renamed to **drawborders**. Same function.
  
  - FW: 
    
    - mousedown handler: 
      
      - Line 41 removed, which brought the hot element to the front. In **strapwork** it otherwise pulled containers in front of polygons. 
        
        > **@Todo**: replace with a layer system and a "movetofront" attribute (check with Ulli, is that backwards compatible?).
  
  - CLASS: 
    
    - Scrollbar: 
      - "script" is no longer triggered on "moveend" (in addition to "move") but on "click" (in addition to "move"), since otherwise the "value" from BEFORE the change was always used.

## v2.1.1

- VAM: 
  - numbercards: 
    - Fix: arrangement of the Montessori colours corrected
    - Fix: divomath setting for whether a card is shown collapsed or not ("unfold" attribute)
  - divisors: 
    - new divomath configuration: "stripmargin"
    - divomath config "padding" renamed to "blobmargin"
    - Alignment of the polygons adjusted (odd vertex count => point up, even => edge up)
    - Appearance of the movable bar to the right of the strips changed
    - Behaviour of the movable bar adjusted
    - fix: the movable bar snaps to the strips when released
    - Attributes "width" and "height" added for strips
  - CLASS: 
    - *new* Key: 
      - A single key for a keyboard (inherits from Button)
    - *new* Keyboard: 
      - A (currently numeric only) keyboard that can be shown when a text field is clicked or similar
    - *new* TextInput: 
      - A quasi text box that can drive a "Keyboard" for input when selected.
    - *new* Toggle: 
      - Toggle button whose "state" can be used as a bool. Calls its "script" on "click".
    - *new* Scrollbar: 
      - Scrollbar whose "value" can be used to configure other components.
- FW: 
  - constants: 
    - unicode added for various arrows (LEFTARROW, RIGHTARROW, ...)
  - helper functions: 
    - incircle(): checks whether a point lies inside a circle

## v2.1.0

- VAM: 
  - strapwork: 
    - Animation behaviour adjusted
    - Scrollbar added
    - Reset button added
- CLASS: 
  - Button: 
    - "hasborder" (bool) added as an attribute
  - *new* Scrollbar: 
    - A scrollbar for moving content. Moving the scrollbar updates its value. What should happen with it (at the end of a move event) has to be configured through the "script" attribute. "max" and "min" attributes can be set individually (default: 100 and 0). The current value is available through the "value" attribute. "value" changes linearly with the position of the scrollbar.

## v2.0.0

- new widget: "divisors"
- VAM: 
  - numbercards: 
    - Fix: lists passed as lists (e.g. for x and y) are now processed correctly.
    - Styling adjusted: narrower border, rounded rectangle for the expand/collapse button, one colour button per card and new styling, new layout for the +/- buttons, colours adapted to the Montessori colours
    - Separator between groups of three digits added, configurable from the editor ("separator")
    - Documentation adjusted
  - strapwork: 
    - divomath state definition adjusted
    - Choice between fixed and flexible container length added
    - Deleting the last component when the container is full added
- FW 
  - draw: 
    - Fix: removed the debug function that drew nadas everywhere while debugging
    - objpreview removed, not needed
  - constants: 
    - colors: 
      - changed: DIVOBLUE from (120,147,194) to (83,125,156)
      - changed: DIVORED from (255,84,84) to (235,85,78)
      - changed: DIVOGREY from (165,165,165) to (130,149,192) --> rather blue
      - added: MONTERED, MONTEGREEN, MONTEBLUE, MONTEGREY for the Montessori colours. Plus MONTEPALETTE as a list of all Montessori colours
    - VALUEMAP: maps the numbers 1 to 12 to the words "Einer", "Zweier" ... "Zwölfer"
    - HEXMAP: maps the strings "0" to "9" and "A" to "F" respectively "a" to "f" to the numbers 1 to 15
    - COLORMAP: contains most of the predefined colours 
      - Colours: "DARKRED", "DARKBLUE", "DARKGREEN",    "DZLMCOLORGOLD", "DZLMCOLORDARK", "PLACECOLORGREEN", "PLACECOLORBLUE","PLACECOLORRED", "DIVOGREEN", "DIVOVIOLET", "DIVOGREY", "DIVOBLACK", "DIVORED", "DIVOBLUE"
  - helper functions: 
    - list(\<any>): forces a list from any input (number, object). nada stays nada, a list stays a list, a string becomes a char array.
    - centroid: 
      - centroid(list): computes the centroid of a list of points (geometric mean)
    - centerofmass: 
      - centerofmass(list): computes the arithmetic mean of a list of points
- CLASS 
  - Button: 
    - Button shadow changed from a generic rectangle to the actual button shape (shape attribute)
    - Attribute "show" added, for showing and hiding the button
    - Flag "hasshadow" added, to control whether the shadow is drawn
    - Handles for "color", "bordercolor" and "fontcolor" added

## v1.0.0

- new widgets: "numbercards", "strapwork"
