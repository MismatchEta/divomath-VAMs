/** Pen colours, keyed by the buttons' data-color attribute. */
const PEN_COLORS = {gray: "#929292", purple: "#963bd8", green: "#2dac11"};

/**
 * Number of intermediate positions the eraser clears between two pointer events.
 * Without them a fast drag leaves gaps. 
 */
const ERASER_INTERPOLATION_STEPS = 50;

/** Opacity of the canvas while the pen is off, so it does not hide the page. */
const INACTIVE_OPACITY = 0.2;

/** Local image Base  */
const IMAGEBASE64 = {
    PENGRAY :
        "url('data:image/png;base64,"
        + "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"
        + "')",
    PENGREEN :
        "url('data:image/png;base64,"
        + "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"
        + "')",
    PENPURPLE :
        "url('data:image/png;base64,"
        + "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"
        + "')",
    PENON :
        "url('data:image/png;base64,"
        + "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"
        + "')",
    PENOFF :
        "url('data:image/png;base64,"
        + "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"
        + "')",
    ERASER :
        "url('data:image/png;base64,"
        + "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"
        + "')",
    CURSORPEN : 
        "url('data:image/svg;base64,"
        + "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjYuMzMwMDgiIGhlaWdodD0iMjYuODYxNzc2IiB2aWV3Qm94PSIwIDAgMjYuMzMwMDggMjYuODYxNzc2IiB2ZXJzaW9uPSIxLjEiPgogIDxnIGlkPSJnODQiIHRyYW5zZm9ybT0icm90YXRlKDkwLDIzLjczMzkyNywxMy41NzMwMDMpIj4KICAgIDxwYXRoIGQ9Im0gMjguMDUyNywxNS41NTY2IDIuNzcwNywtMi42OTAzIEMgMzEuMzk5NywxMi4zMTA4IDMyLjE3MjUsMTIgMzIuOTc3MSwxMiBjIDAuODA0NiwwIDEuNTc3MywwLjMxMDggMi4xNTM2LDAuODY2MyAwLjI5MDksMC4yOTE4IDAuNTE4LDAuNjM5OCAwLjY2NywxLjAyMjIgMC4xNDksMC4zODI0IDAuMjE2OCwwLjc5MTEgMC4xOTkxLDEuMjAwNiAtMC4wMTc3LDAuNDA5NSAtMC4xMjA1LDAuODEwOSAtMC4zMDE5LDEuMTc5NCAtMC4xODE0LDAuMzY4NSAtMC40Mzc3LDAuNjk2IC0wLjc1MjcsMC45NjIyIGwgLTIuNTgzNCwyLjUwNzMiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgaWQ9InBhdGg3NiIgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6Y3VycmVudENvbG9yO3N0cm9rZS13aWR0aDoyLjA0NjI5OTkzO3N0cm9rZS1taXRlcmxpbWl0OjEwIi8+CiAgICA8cGF0aCBkPSJNIDMyLjM1ODMsMTkuNzM3NyAxNi43MjE3LDM0LjkxOCAxMS40NDI0LDM1Ljk5OTkgMTIuNDEzMiwzMC43MzY0IDI4LjA0OTgsMTUuNTU2IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGlkPSJwYXRoNzgiIHN0eWxlPSJmaWxsOiNmZmZmZmY7c3Ryb2tlOmN1cnJlbnRDb2xvcjtzdHJva2Utd2lkdGg6Mi4wNDYyOTk5MztzdHJva2UtbWl0ZXJsaW1pdDoxMCIvPgogICAgPHBhdGggZD0iTSAyOC4wNTI3LDE1LjU1NjUgMzIuMzYsMTkuNzM3OSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBpZD0icGF0aDgwIiBzdHlsZT0iZmlsbDojZmZmZmZmO3N0cm9rZTpjdXJyZW50Q29sb3I7c3Ryb2tlLXdpZHRoOjEuMDIzMTQ5OTc7c3Ryb2tlLW1pdGVybGltaXQ6MTAiLz4KICAgIDxwYXRoIGQ9Ik0gMTcuNTIyOSwzNC45OTA0IDEyLjgwNzYsMzAuNDEyNyIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBpZD0icGF0aDgyIiBzdHlsZT0iZmlsbDojZmZmZmZmO3N0cm9rZTpjdXJyZW50Q29sb3I7c3Ryb2tlLXdpZHRoOjEuMDIzMTQ5OTc7c3Ryb2tlLW1pdGVybGltaXQ6MTAiLz4KICA8L2c+Cjwvc3ZnPg=="
        + "')",
    CURSORERASER :
        "url('data:image/svg;base64,"
        + "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgd2lkdGg9IjI2LjMzMDA4IgogICBoZWlnaHQ9IjI2Ljg2MTc3NiIKICAgdmlld0JveD0iMCAwIDI2LjMzMDA4IDI2Ljg2MTc3NiIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnNyIKICAgc29kaXBvZGk6ZG9jbmFtZT0iY3Vyc29yX2VyYXNlci5zdmciCiAgIGlua3NjYXBlOnZlcnNpb249IjEuMS4yICgwYTAwY2Y1MzM5LCAyMDIyLTAyLTA0KSIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzMTEiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXc5IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxLjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb209IjMxLjM4Mjg4NCIKICAgICBpbmtzY2FwZTpjeD0iMTMuMTYwMDQiCiAgICAgaW5rc2NhcGU6Y3k9IjEzLjQzMDg4OCIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTAzMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMjYiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmc3IiAvPgogIDxnCiAgICAgaWQ9Imc4NCIKICAgICB0cmFuc2Zvcm09InJvdGF0ZSgtOTAsMTMuMDIyOTI2LDIzLjk5OTc3NSkiPgogICAgPHBhdGgKICAgICAgIGQ9Im0gMjguMDUyNywxNS41NTY2IDIuNzcwNywtMi42OTAzIEMgMzEuMzk5NywxMi4zMTA4IDMyLjE3MjUsMTIgMzIuOTc3MSwxMiBjIDAuODA0NiwwIDEuNTc3MywwLjMxMDggMi4xNTM2LDAuODY2MyAwLjI5MDksMC4yOTE4IDAuNTE4LDAuNjM5OCAwLjY2NywxLjAyMjIgMC4xNDksMC4zODI0IDAuMjE2OCwwLjc5MTEgMC4xOTkxLDEuMjAwNiAtMC4wMTc3LDAuNDA5NSAtMC4xMjA1LDAuODEwOSAtMC4zMDE5LDEuMTc5NCAtMC4xODE0LDAuMzY4NSAtMC40Mzc3LDAuNjk2IC0wLjc1MjcsMC45NjIyIGwgLTIuNTgzNCwyLjUwNzMiCiAgICAgICBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiCiAgICAgICBpZD0icGF0aDc2IgogICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6Y3VycmVudENvbG9yO3N0cm9rZS13aWR0aDoyLjA0NjM7c3Ryb2tlLW1pdGVybGltaXQ6MTAiIC8+CiAgICA8cGF0aAogICAgICAgZD0iTSAzMi4zNTgzLDE5LjczNzcgMTYuNzIxNywzNC45MTggMTEuNDQyNCwzNS45OTk5IDEyLjQxMzIsMzAuNzM2NCAyOC4wNDk4LDE1LjU1NiIKICAgICAgIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIKICAgICAgIGlkPSJwYXRoNzgiCiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO3N0cm9rZTpjdXJyZW50Q29sb3I7c3Ryb2tlLXdpZHRoOjIuMDQ2MztzdHJva2UtbWl0ZXJsaW1pdDoxMCIgLz4KICAgIDxwYXRoCiAgICAgICBkPSJNIDI4LjA1MjcsMTUuNTU2NSAzMi4zNiwxOS43Mzc5IgogICAgICAgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIgogICAgICAgaWQ9InBhdGg4MCIKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7c3Ryb2tlOmN1cnJlbnRDb2xvcjtzdHJva2Utd2lkdGg6MS4wMjMxNTtzdHJva2UtbWl0ZXJsaW1pdDoxMCIgLz4KICAgIDxwYXRoCiAgICAgICBkPSJNIDE3LjUyMjksMzQuOTkwNCAxMi44MDc2LDMwLjQxMjciCiAgICAgICBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiCiAgICAgICBpZD0icGF0aDgyIgogICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6Y3VycmVudENvbG9yO3N0cm9rZS13aWR0aDoxLjAyMzE1O3N0cm9rZS1taXRlcmxpbWl0OjEwIiAvPgogIDwvZz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOiNmZjU1NTU7c3Ryb2tlLXdpZHRoOjAuMDMxODY0NSIKICAgICBkPSJNIDMuOTE5MzMzOSw2LjgwMTYwMTYgQyAyLjYxODg5MzYsNS40NjI1MTIxIDIuNDE4OTIzMyw1LjIzNzQ5MTYgMi4yODExMTMyLDQuOTU4MTYwOCAxLjg2NDQxMzcsNC4xMTM1NDIyIDIuMDc4NTY3OCwzLjA3MTM3MTMgMi43ODcwODUyLDIuNDk1ODcxNyAzLjQ2MDM4NTUsMS45NDg5Nzc2IDQuNDQyNjcwOCwxLjkyODc1OCA1LjEyNDMxNDMsMi40NDc3NjE2IDUuMjYxMzc1LDIuNTUyMTE5NyA2LjU1NDUwOTUsMy44Njg0NjA5IDcuMzU2MDIzMiw0LjcxOTUyMTEgTCA3LjY1NDA1ODksNS4wMzU5ODAyIDcuMDAwODMwMiw1LjcxMjQwNjYgQyA2LjY0MTU1NDEsNi4wODQ0NDEyIDYuMDI3MDgwNiw2LjcxNDI1NzUgNS42MzUzMzM3LDcuMTExOTk4NSBMIDQuOTIzMDY1OCw3LjgzNTE2NDMgWiIKICAgICBpZD0icGF0aDg3IiAvPgo8L3N2Zz4K"
        + "')",
}

/**
 * Direction the menu bar unfolds in. "horizontal" decides whether the bar is
 * wide or tall, "positive" whether it grows towards larger coordinates
 * (east/south) or smaller ones (west/north).
 */
const DIRECTION = {
    NORTH: {horizontal: false, positive: false},
    EAST:  {horizontal: true,  positive: true},
    SOUTH: {horizontal: false, positive: true},
    WEST:  {horizontal: true,  positive: false}
};


/** Linear interpolation between two points, t in [0,1]. */
function lerp(x1, y1, x2, y2, t) { 
    return [
        t * x2 + (1 - t) * x1, 
        t * y2 + (1 - t) * y1
    ]
}


/** CSS visibility value for a boolean. */
function setVisibility(visible) {
    return (visible) ? "visible" : "hidden";
}


/**
 * Freehand drawing overlay.
 *
 * Puts two absolutely positioned elements on top of the page, both appended to
 * <body> rather than into the target element:
 *
 *   - a canvas (z-index 10) covering the target element, drawn on with pointer
 *     events. While the pen is off it has "pointer-events: none", so clicks
 *     pass through to whatever is underneath.
 *   - a menu bar (z-index 15) on top of that, so its buttons stay clickable
 *     even while the canvas is capturing events.
 *
 * @param configuration see the CONFIGURATION block in the HTML:
 *        elementID      id (or the element itself) the canvas is placed over
 *        penSize        stroke width in px, default 4
 *        eraserSize     stroke width in px, default 20
 *        startLocation  where the menu bar sits, absolute or relative
 *        menubar        {direction, moveable}
 *        visibleOnStart whether the menu bar is shown right away, default true
 *        mode           "website" or "articulate"
 *        references     Storyline only, see isReference()
 */
class DrawingApp {

    constructor(configuration) {
        // Copy configuartion
        this.configuration = Object.assign({visibleOnStart: true}, configuration);

        // --- The element the canvas is placed over (id or element) ---
        this.canvasparent = this.configuration.elementID;
        if (typeof this.canvasparent === "string") {
            this.canvasparent = document.getElementById(this.canvasparent);
        }
        if (!this.canvasparent) {
            throw new Error(`FreehandDrawingApp: element "${configuration.elementID}"`
                + ` not found - is the id correct and the element already in the DOM?`);
        }

        // Drawing with a pen must not scroll or bounce the page.
        document.body.style.overscrollBehavior = "none";
        document.body.style.overflow = "hidden";

        // --- Geometry ---
        // NOTE: read once, on purpose - but never updated either.
        // @improvement: re-read on resize and reposition the canvas.
        this.canvasparentBbox = this.canvasparent.getBoundingClientRect();
        this.width = this.canvasparentBbox.width;
        this.height = this.canvasparentBbox.height;

        /* Factor between CSS pixels and canvas pixels. Was meant to be
         * window.devicePixelRatio so strokes stay sharp on high dpi displays,
         * but that needs the coordinate maths to be adjusted as well.
         * Fixed at 1 until someone does that.
         */
        this.scale = 1;

        // --- Build DOM ---
        this.setupMenubar(this.configuration.visibleOnStart);
        this.setupCanvas();

        // --- State ---
        this.isActive = false;   // pen switched on, i.e. canvas captures events
    }


    /**
     * Top left corner of the canvas in page coordinates.
     */
    get origin() {
        return [this.canvasparentBbox.left, this.canvasparentBbox.top];
    }

    /**
     * Create the drawing canvas and wire up the pointer events.
     *
     * The canvas starts out transparent and click through; the pen button in
     * the menu bar switches both. Everything is drawn in canvas coordinates,
     * so pointer positions go through localCoordinate() first.
     */
    setupCanvas() {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "freehand-drawing-canvas";
        this.canvas.width = this.width * this.scale;
        this.canvas.height = this.height * this.scale;

        // Sits on top of the target element, below the menu bar (z-index 15).
        this.canvas.style.position = "absolute";
        this.canvas.style.top = `${this.canvasparentBbox.top}px`;
        this.canvas.style.left = `${this.canvasparentBbox.left}px`;
        this.canvas.style["z-index"] = 10;

        // Inactive: faded out and letting clicks through to the page below.
        this.canvas.style.opacity = 0.2;
        this.canvas.style["pointer-events"] = "none";

        // The browser must not scroll or zoom while drawing.
        this.canvas.style["touch-action"] = "none";

        document.body.appendChild(this.canvas);

        // --- Drawing state ---
        this.toolDown = false;              // pointer currently pressed
        this.activeTool = "pen";            // "pen" or "eraser"
        this.drawColor = PEN_COLORS.gray;
        this.drawSize = this.configuration.penSize || 4;
        this.eraserSize = this.configuration.eraserSize || 20;

        // Last pointer position, in CANVAS coordinates.
        this.lastPosition = undefined;

        const ctx = this.context2d;
        ctx.scale(this.scale, this.scale);
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.imageSmoothingEnabled = false;

        // A canvas pixel spans from n to n+1, so a line at an integer
        // coordinate straddles two pixels and looks blurred.
        // Shifting by half a pixel puts strokes on pixel centres.
        ctx.translate(0.5, 0.5);

        // --- Pointer events ---
        this.canvas.addEventListener("pointerdown", (e) => {
            if (!e.isPrimary) return;
            e.preventDefault();

            this.lastPosition = this.localCoordinate(e.x, e.y);
            this.toolDown = true;

            if (this.activeTool === "pen") {
                const ctx = this.context2d;
                ctx.beginPath();
                ctx.moveTo(...this.lastPosition);
            }
        }, {passive: false});

        this.canvas.addEventListener("pointermove", (e) => {
            if (!e.isPrimary) return;
            e.preventDefault();
            if (!this.toolDown) return;

            const now = this.localCoordinate(e.x, e.y);

            if (this.activeTool === "pen") {
                this.drawTo(now);
            } else if (this.activeTool === "eraser") {
                this.eraseTo(now);
            }

            this.lastPosition = now;
        }, {passive: false});

        this.canvas.addEventListener("pointerup", (e) => {
            if (!e.isPrimary) return;
            e.preventDefault();
            this.toolDown = false;
            this.lastPosition = undefined;
        }, {passive: false});

        this.canvas.addEventListener("pointerleave", (e) => {
            if (!e.isPrimary) return;
            e.preventDefault();
            this.toolDown = false;
            this.lastPosition = undefined;
        }, {passive: false});

        // Needed for the Apple Pencil: without it iPadOS keeps scrolling the
        // page instead of letting the pen draw.
        this.canvas.addEventListener("touchmove", (e) => {
            e.preventDefault();
        }, {passive: false});
    }


    /**
     * Continue the current stroke to a point, in canvas coordinates.
     */
    drawTo(to) {
        const ctx = this.context2d;
 
        ctx.strokeStyle = this.drawColor;
        ctx.lineWidth = this.drawSize;
        ctx.lineTo(...to);
        ctx.stroke();
    }


    /**
     * Clear a square around a point and along the way there.
     *
     * The interpolation matters: a fast drag produces pointer events several
     * eraser widths apart, and without the intermediate squares the erased
     * area would come out dotted.
     */
    eraseTo(to) {
        const ctx = this.context2d;
        const half = this.eraserSize / 2;
        const from = this.lastPosition || to;
 
        const clearAt = ([x, y]) =>
            ctx.clearRect(x - half, y - half, this.eraserSize, this.eraserSize);
 
        for (let i = 0; i < ERASER_INTERPOLATION_STEPS; i++) {
            clearAt(lerp(from, to, i / ERASER_INTERPOLATION_STEPS));
        }
        clearAt(to);
    }
 

    /**
     * Build the menu bar: a pen toggle plus a row of tool buttons that folds
     * out next to it.
     *
     * The bar is a single strip, __LONGEDGE by __SHORTEDGE. The toggle sits at
     * the anchored end, the tool buttons in a container that starts out hidden
     * and appears when the pen is switched on.
     */
    setupMenubar(visibleOnStart) {

        const size = this.canvasparentBbox.width / 30;
 
        this.menubar = document.createElement("div");
        this.menubar.id = "freehand-drawing-menubar";
        this.menubar.__DIRECTION = this.parseDirection(this.configuration.menubar.direction);
        this.menubar.__BUTTONSIZE = size;
        this.menubar.__SHORTEDGE = size;
        this.menubar.__LONGEDGE = this.canvasparentBbox.width / 5;

        // Only tint the bar when it can be dragged - otherwise it should be
        // invisible apart from its buttons.
        this.menubar.style.background = this.configuration.menubar.moveable
            ? "#AAAAAA55" : "#AAAAAA00";
        this.menubar.style.position = "absolute";
        this.menubar.style["z-index"] = 15;
        this.menubar.style.visibility = setVisibility(visibleOnStart);
        this.menubar.dataset.isDragged = "false";

        this.placeMenubar();
        document.body.appendChild(this.menubar);
 
        if (this.configuration.menubar.moveable) this.makeMenubarDraggable();
 
        this.buildPenToggle();
        this.buildToolButtons();
    }


    /** Translate the configured direction name into a DIRECTION entry. */
    parseDirection(name) {
        const directions = {
            up: DIRECTION.NORTH,    north: DIRECTION.NORTH,
            right: DIRECTION.EAST,  east:  DIRECTION.EAST,
            down: DIRECTION.SOUTH,  south: DIRECTION.SOUTH,
            left: DIRECTION.WEST,   west:  DIRECTION.WEST
        };
 
        if (!(name in directions)) {
            throw new Error(`FreehandDrawingApp: menubar.direction is "${name}"`
                + ` but has to be one of ${Object.keys(directions).join(", ")}`);
        }
        return directions[name];
    }


    /**
     * Position and size the bar.
     *
     * startLocation gives where the TOGGLE should sit; the bar extends from
     * there in its direction. For the negative directions (north, west) the bar
     * is shifted back by its own length so the toggle ends up at the anchor.
     */
    placeMenubar() {
        const bar = this.menubar;
        const box = this.canvasparentBbox;
        const start = this.configuration.startLocation;
        const half = bar.__BUTTONSIZE / 2;
 
        // NOTE: the default branches used to be missing their assignment, so
        // an unset coordinate produced NaN rather than the fallback.
        let left = box.right / 2;
        if (start.x_relative !== undefined) {
            left = box.left + start.x_relative * box.width - half;
        } else if (start.x_absolute !== undefined) {
            left = start.x_absolute - half;
        }
 
        let top = box.bottom - bar.__BUTTONSIZE;
        if (start.y_relative !== undefined) {
            top = box.top + start.y_relative * box.height - half;
        } else if (start.y_absolute !== undefined) {
            top = start.y_absolute - half;
        }
 
        const back = bar.__LONGEDGE - bar.__BUTTONSIZE; // offset for north/west
 
        if (bar.__DIRECTION.horizontal) {
            bar.style.width = `${bar.__LONGEDGE}px`;
            bar.style.height = `${bar.__SHORTEDGE}px`;
            bar.style.top = `${top}px`;
            bar.style.left = `${bar.__DIRECTION.positive ? left : left - back}px`;
        } else {
            bar.style.width = `${bar.__SHORTEDGE}px`;
            bar.style.height = `${bar.__LONGEDGE}px`;
            bar.style.left = `${left}px`;
            bar.style.top = `${bar.__DIRECTION.positive ? top - back : top}px`;
        }
    }


    /**
     * Let the user drag the bar around.
     *
     * NOTE: the move listener sits on the document, not on the bar - otherwise
     * a fast drag loses the pointer and the bar stops following.
     */
    makeMenubarDraggable() {
        const bar = this.menubar;
        bar.__POSITION = {x: 0, y: 0};
 
        bar.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            bar.dataset.isDragged = "true";
            bar.__POSITION = {x: e.clientX, y: e.clientY};
        }, {passive: false});
 
        bar.addEventListener("pointerup", (e) => {
            e.preventDefault();
            bar.dataset.isDragged = "false";
        }, {passive: false});
 
        document.addEventListener("pointermove", (e) => {
            if (bar.dataset.isDragged !== "true") return;
            e.preventDefault();
 
            const dx = bar.__POSITION.x - e.clientX;
            const dy = bar.__POSITION.y - e.clientY;
            bar.__POSITION = {x: e.clientX, y: e.clientY};
 
            bar.style.left = `${bar.offsetLeft - dx}px`;
            bar.style.top = `${bar.offsetTop - dy}px`;
        }, {passive: false});
    }
 

    /**
     * Style shared by every round button in the bar.
     */
    styleAsToolButton(button, image) {
        const size = this.menubar.__BUTTONSIZE;
 
        button.style.width = `${size}px`;
        button.style.height = `${size}px`;
        button.style["border-radius"] = `${size}px`;
        button.style.background = image;
        button.style["background-position"] = "center";
        button.style["background-size"] = `${size}px`;
        button.style.fontSize = "16pt";
    }
 

    /** The pen toggle - the only button visible while the pen is off. */
    buildPenToggle() {
        const bar = this.menubar;
        const back = bar.__LONGEDGE - bar.__BUTTONSIZE;
 
        this.canvasToggle = document.createElement("button");
        this.canvasToggle.id = "canvas-toggle";
        this.canvasToggle.style.position = "absolute";
        this.styleAsToolButton(this.canvasToggle, IMAGEBASE64.PENON);
 
        // For the negative directions the toggle sits at the far end of the bar.
        if (bar.__DIRECTION === DIRECTION.WEST) {
            this.canvasToggle.style.marginLeft = `${back}px`;
        } else if (bar.__DIRECTION === DIRECTION.NORTH) {
            this.canvasToggle.style.marginTop = `${back}px`;
        }
 
        this.canvasToggle.addEventListener("click", () => this.setPenActive(!this.isActive));
        bar.appendChild(this.canvasToggle);
    }
 

    /** The three pens and the eraser, hidden until the pen is switched on. */
    buildToolButtons() {
        const bar = this.menubar;
        const size = bar.__BUTTONSIZE;
        const gap = size * 0.4;
 
        this.menubarButtonsDiv = document.createElement("div");
        this.menubarButtonsDiv.id = "freehand-drawing-menubar-buttons";
        this.menubarButtonsDiv.style.background = "#AAAAAA00";
        this.menubarButtonsDiv.style.visibility = "hidden";
 
        if (bar.__DIRECTION.horizontal) {
            this.menubarButtonsDiv.style.height = `${size}px`;
            this.menubarButtonsDiv.style.width = `${bar.__LONGEDGE - size}px`;
        } else {
            this.menubarButtonsDiv.style.width = `${size}px`;
            this.menubarButtonsDiv.style.height = `${bar.__LONGEDGE - size}px`;
        }
 
        // East and south grow away from the toggle, so the container starts one
        // button further along. North and west already sit before it.
        if (bar.__DIRECTION === DIRECTION.EAST) {
            this.menubarButtonsDiv.style.transform = `translate(${size}px, 0px)`;
        } else if (bar.__DIRECTION === DIRECTION.SOUTH) {
            this.menubarButtonsDiv.style.transform = `translate(0px, ${size}px)`;
        }
 
        bar.appendChild(this.menubarButtonsDiv);
 
        // --- The buttons themselves ---
        const offset = bar.__DIRECTION.horizontal
            ? `translate(${gap}px, 0px)` : `translate(0px, ${gap}px)`;
 
        this.menubarButtons = {};
 
        const addButton = (name, image, onClick) => {
            const button = document.createElement("button");
            this.styleAsToolButton(button, image);
            button.style.transform = offset;
            button.style.opacity = 0.7;
            button.addEventListener("click", () => {
                onClick();
                this.highlightToolButton(name);
            });
 
            this.menubarButtons[name] = button;
            this.menubarButtonsDiv.appendChild(button);
        };
 
        Object.entries({gray: IMAGEBASE64.PENGRAY,
                        green: IMAGEBASE64.PENGREEN,
                        purple: IMAGEBASE64.PENPURPLE}).forEach(([color, image]) => {
            addButton(color, image, () => {
                this.activeTool = "pen";
                this.drawColor = PEN_COLORS[color];
                this.canvas.style.cursor = IMAGEBASE64.CURSORPEN + ", auto";
            });
        });
 
        addButton("eraser", IMAGEBASE64.ERASER, () => {
            this.activeTool = "eraser";
            this.canvas.style.cursor = IMAGEBASE64.CURSORERASER + ", auto";
        });
 
        this.highlightToolButton("gray"); // gray is the tool selected on start
    }
 
    /** Show which tool is selected by dimming the others. */
    highlightToolButton(name) {
        Object.entries(this.menubarButtons).forEach(([key, button]) => {
            button.style.opacity = (key === name) ? 1 : 0.7;
        });
    }
 

    /**
     * Switch the pen on or off.
     *
     * While it is on the canvas captures pointer events, so the page below
     * cannot be used - that is deliberate, the drawing surface lies on top of
     * it. The drawing itself stays visible either way.
     */
    setPenActive(active) {
        this.isActive = active;
 
        this.canvasToggle.style.background = active ? IMAGEBASE64.PENOFF : IMAGEBASE64.PENON;
        this.canvasToggle.style["background-position"] = "center";
        this.canvasToggle.style["background-size"] = `${this.menubar.__BUTTONSIZE}px`;
 
        this.menubarButtonsDiv.style.visibility = setVisibility(active);
        this.canvas.style.opacity = active ? 1 : INACTIVE_OPACITY;
 
        if (active) {
            this.canvas.style.removeProperty("pointer-events");
            this.canvas.style.cursor = IMAGEBASE64.CURSORPEN + ", auto";
        } else {
            this.canvas.style["pointer-events"] = "none";
            this.canvas.style.removeProperty("cursor");
        }
    }


    /** The 2d drawing context. Cheap to call repeatedly - the browser returns
     *  the same context object every time. */
    get context2d() {
        return this.canvas.getContext("2d");
    }

    localCoordinate(windowX, windowY) {
        let origin = this.origin;
        return [(windowX + window.scrollX - origin[0]) / this.scale,
                (windowY + window.scrollY - origin[1]) / this.scale];
    }
}


/**
 * Start the overlay once the page has finished loading.
 *
 * Guarded against running twice: build.py injects the configuration and then
 * loads this file, so a page that somehow includes it twice would otherwise end
 * up with two canvases stacked on each other.
 *
 * NOTE: an earlier version had a second "articulate" mode that kept one drawing
 * per Articulate Storyline slide, using a MutationObserver on Storyline's
 * slide-label element and a canvasStore on the player object. It is gone: the
 * VAM is embedded as a web object, i.e. inside an iframe, where neither
 * Storyline's player nor that element exist, so the mode could never run there.
 * See divoVAM 3.1.0 if it is ever needed again.
 */
function main(configuration) {
    if (document.getElementById("freehand-drawing-canvas") !== null) {
        console.warn("FreehandDrawingApp: already running, second start ignored.");
        return;
    }

    // The canvas is positioned over its target element, so that element has to
    // have its final size - which it only has once everything is loaded.
    window.addEventListener("load", () => {
        window.FREEHAND_APP = new DrawingApp(configuration);
    });
}

main(window.CONFIGURATION);