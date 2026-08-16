let APP;
let INTERPOLATIONSTEPS = Object.keys([...Array(50)]);

const IMAGEBASE64 = {
    PENGRAY: "url('data:image/png;base64,"
    + "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"
    + "')",
    PENGREEN: "url('data:image/png;base64,"
    + "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"
    + "')",
    PENPURPLE: "url('data:image/png;base64,"
    + "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"
    + "')",
    PENON: "url('data:image/png;base64,"
    + "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"
    + "')",
    PENOFF: "url('data:image/png;base64,"
    + "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"
    + "'",
    ERASER: "url('data:image/png;base64,"
    + "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"
    + "')",
    CURSORPEN: "url('data:image/svg;base64,"
    + "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjYuMzMwMDgiIGhlaWdodD0iMjYuODYxNzc2IiB2aWV3Qm94PSIwIDAgMjYuMzMwMDggMjYuODYxNzc2IiB2ZXJzaW9uPSIxLjEiPgogIDxnIGlkPSJnODQiIHRyYW5zZm9ybT0icm90YXRlKDkwLDIzLjczMzkyNywxMy41NzMwMDMpIj4KICAgIDxwYXRoIGQ9Im0gMjguMDUyNywxNS41NTY2IDIuNzcwNywtMi42OTAzIEMgMzEuMzk5NywxMi4zMTA4IDMyLjE3MjUsMTIgMzIuOTc3MSwxMiBjIDAuODA0NiwwIDEuNTc3MywwLjMxMDggMi4xNTM2LDAuODY2MyAwLjI5MDksMC4yOTE4IDAuNTE4LDAuNjM5OCAwLjY2NywxLjAyMjIgMC4xNDksMC4zODI0IDAuMjE2OCwwLjc5MTEgMC4xOTkxLDEuMjAwNiAtMC4wMTc3LDAuNDA5NSAtMC4xMjA1LDAuODEwOSAtMC4zMDE5LDEuMTc5NCAtMC4xODE0LDAuMzY4NSAtMC40Mzc3LDAuNjk2IC0wLjc1MjcsMC45NjIyIGwgLTIuNTgzNCwyLjUwNzMiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgaWQ9InBhdGg3NiIgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6Y3VycmVudENvbG9yO3N0cm9rZS13aWR0aDoyLjA0NjI5OTkzO3N0cm9rZS1taXRlcmxpbWl0OjEwIi8+CiAgICA8cGF0aCBkPSJNIDMyLjM1ODMsMTkuNzM3NyAxNi43MjE3LDM0LjkxOCAxMS40NDI0LDM1Ljk5OTkgMTIuNDEzMiwzMC43MzY0IDI4LjA0OTgsMTUuNTU2IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGlkPSJwYXRoNzgiIHN0eWxlPSJmaWxsOiNmZmZmZmY7c3Ryb2tlOmN1cnJlbnRDb2xvcjtzdHJva2Utd2lkdGg6Mi4wNDYyOTk5MztzdHJva2UtbWl0ZXJsaW1pdDoxMCIvPgogICAgPHBhdGggZD0iTSAyOC4wNTI3LDE1LjU1NjUgMzIuMzYsMTkuNzM3OSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBpZD0icGF0aDgwIiBzdHlsZT0iZmlsbDojZmZmZmZmO3N0cm9rZTpjdXJyZW50Q29sb3I7c3Ryb2tlLXdpZHRoOjEuMDIzMTQ5OTc7c3Ryb2tlLW1pdGVybGltaXQ6MTAiLz4KICAgIDxwYXRoIGQ9Ik0gMTcuNTIyOSwzNC45OTA0IDEyLjgwNzYsMzAuNDEyNyIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBpZD0icGF0aDgyIiBzdHlsZT0iZmlsbDojZmZmZmZmO3N0cm9rZTpjdXJyZW50Q29sb3I7c3Ryb2tlLXdpZHRoOjEuMDIzMTQ5OTc7c3Ryb2tlLW1pdGVybGltaXQ6MTAiLz4KICA8L2c+Cjwvc3ZnPg=="
    + "')",
    CURSORERASER: "url('data:image/svg;base64,"
    + "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgd2lkdGg9IjI2LjMzMDA4IgogICBoZWlnaHQ9IjI2Ljg2MTc3NiIKICAgdmlld0JveD0iMCAwIDI2LjMzMDA4IDI2Ljg2MTc3NiIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnNyIKICAgc29kaXBvZGk6ZG9jbmFtZT0iY3Vyc29yX2VyYXNlci5zdmciCiAgIGlua3NjYXBlOnZlcnNpb249IjEuMS4yICgwYTAwY2Y1MzM5LCAyMDIyLTAyLTA0KSIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzMTEiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXc5IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxLjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb209IjMxLjM4Mjg4NCIKICAgICBpbmtzY2FwZTpjeD0iMTMuMTYwMDQiCiAgICAgaW5rc2NhcGU6Y3k9IjEzLjQzMDg4OCIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTAzMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMjYiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmc3IiAvPgogIDxnCiAgICAgaWQ9Imc4NCIKICAgICB0cmFuc2Zvcm09InJvdGF0ZSgtOTAsMTMuMDIyOTI2LDIzLjk5OTc3NSkiPgogICAgPHBhdGgKICAgICAgIGQ9Im0gMjguMDUyNywxNS41NTY2IDIuNzcwNywtMi42OTAzIEMgMzEuMzk5NywxMi4zMTA4IDMyLjE3MjUsMTIgMzIuOTc3MSwxMiBjIDAuODA0NiwwIDEuNTc3MywwLjMxMDggMi4xNTM2LDAuODY2MyAwLjI5MDksMC4yOTE4IDAuNTE4LDAuNjM5OCAwLjY2NywxLjAyMjIgMC4xNDksMC4zODI0IDAuMjE2OCwwLjc5MTEgMC4xOTkxLDEuMjAwNiAtMC4wMTc3LDAuNDA5NSAtMC4xMjA1LDAuODEwOSAtMC4zMDE5LDEuMTc5NCAtMC4xODE0LDAuMzY4NSAtMC40Mzc3LDAuNjk2IC0wLjc1MjcsMC45NjIyIGwgLTIuNTgzNCwyLjUwNzMiCiAgICAgICBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiCiAgICAgICBpZD0icGF0aDc2IgogICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6Y3VycmVudENvbG9yO3N0cm9rZS13aWR0aDoyLjA0NjM7c3Ryb2tlLW1pdGVybGltaXQ6MTAiIC8+CiAgICA8cGF0aAogICAgICAgZD0iTSAzMi4zNTgzLDE5LjczNzcgMTYuNzIxNywzNC45MTggMTEuNDQyNCwzNS45OTk5IDEyLjQxMzIsMzAuNzM2NCAyOC4wNDk4LDE1LjU1NiIKICAgICAgIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIKICAgICAgIGlkPSJwYXRoNzgiCiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO3N0cm9rZTpjdXJyZW50Q29sb3I7c3Ryb2tlLXdpZHRoOjIuMDQ2MztzdHJva2UtbWl0ZXJsaW1pdDoxMCIgLz4KICAgIDxwYXRoCiAgICAgICBkPSJNIDI4LjA1MjcsMTUuNTU2NSAzMi4zNiwxOS43Mzc5IgogICAgICAgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIgogICAgICAgaWQ9InBhdGg4MCIKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7c3Ryb2tlOmN1cnJlbnRDb2xvcjtzdHJva2Utd2lkdGg6MS4wMjMxNTtzdHJva2UtbWl0ZXJsaW1pdDoxMCIgLz4KICAgIDxwYXRoCiAgICAgICBkPSJNIDE3LjUyMjksMzQuOTkwNCAxMi44MDc2LDMwLjQxMjciCiAgICAgICBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiCiAgICAgICBpZD0icGF0aDgyIgogICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6Y3VycmVudENvbG9yO3N0cm9rZS13aWR0aDoxLjAyMzE1O3N0cm9rZS1taXRlcmxpbWl0OjEwIiAvPgogIDwvZz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOiNmZjU1NTU7c3Ryb2tlLXdpZHRoOjAuMDMxODY0NSIKICAgICBkPSJNIDMuOTE5MzMzOSw2LjgwMTYwMTYgQyAyLjYxODg5MzYsNS40NjI1MTIxIDIuNDE4OTIzMyw1LjIzNzQ5MTYgMi4yODExMTMyLDQuOTU4MTYwOCAxLjg2NDQxMzcsNC4xMTM1NDIyIDIuMDc4NTY3OCwzLjA3MTM3MTMgMi43ODcwODUyLDIuNDk1ODcxNyAzLjQ2MDM4NTUsMS45NDg5Nzc2IDQuNDQyNjcwOCwxLjkyODc1OCA1LjEyNDMxNDMsMi40NDc3NjE2IDUuMjYxMzc1LDIuNTUyMTE5NyA2LjU1NDUwOTUsMy44Njg0NjA5IDcuMzU2MDIzMiw0LjcxOTUyMTEgTCA3LjY1NDA1ODksNS4wMzU5ODAyIDcuMDAwODMwMiw1LjcxMjQwNjYgQyA2LjY0MTU1NDEsNi4wODQ0NDEyIDYuMDI3MDgwNiw2LjcxNDI1NzUgNS42MzUzMzM3LDcuMTExOTk4NSBMIDQuOTIzMDY1OCw3LjgzNTE2NDMgWiIKICAgICBpZD0icGF0aDg3IiAvPgo8L3N2Zz4K"
    + "')",
}

let DIRECTION = {
    NORTH: 4,
    EAST: 5,
    SOUTH: 6,
    WEST: 7,
    isHorizontal: function (dir) {
    return !!(dir & 0b001)
    },
    isPositive: function (dir) {
    return !((dir & 0b010) >> 1)
    }
}


function highestDivisior(number, divisors) {
    return Math.max(...divisors.filter(it => (number % it) == 0))
}

function lerp(x1, y1, x2, y2, t) {
    return [t * x2 + (1 - t) * x1, t * y2 + (1 - t) * y1]
}

function point(ctx, atX, atY, style) {
    ctx.strokeStyle = style.strokeStyle;
    ctx.moveTo(atX, atY);
    ctx.lineTo(atX - 0.1, atY - 0.1);
}

function setVisiblity(visible) {
    return (visible) ? "visible" : "hidden";
}



class DrawingApp {//{{{

    constructor(configuration) {
    this.configuration = configuration;

    if (this.configuration.visibleOnStart == undefined) {
        this.configuration.visibleOnStart = true
    }
    this.canvasparent = this.configuration.elementID;
    if (typeof (this.canvasparent) == "string") {
        this.canvasparent = document.getElementById(this.canvasparent);
    }
    document.getElementsByTagName("body")[0].style["overscrollBehavior"] = "none";
    document.getElementsByTagName("body")[0].style["overflow"] = "hidden";

    //this.canvasparent.style.background = "#EEEEEE";
    this.canvasparentBbox = this.canvasparent.getBoundingClientRect()
    this.width = this.canvasparentBbox.width;
    this.height = this.canvasparentBbox.height;
    /* @improvement @refactor: I forgot why i set this in the first place.
    * I think it had something to do with high dpi displays 
    * and the line being blurry.
    * But currently I am not sure what has to be changed to
    * for it to be working. For now the scale is hardcoded to 1. 
    */
    this.scale = 1; // window.devicePixelRatio;



    this.divisiors = [2, 3, 4]
    this.numberWidthTiles = highestDivisior(this.width, this.divisiors);
    this.numberHeightTiles = highestDivisior(this.height, this.divisiors);
    this.tileWidth = this.width / this.numberWidthTiles;
    this.tileHeight = this.height / this.numberHeightTiles;


    this.setupMenubar(this.configuration.visibleOnStart)
    this.setupCanvas()
    this.sidebarState = null;
    this.isActive = false;
    this.isVisible = this.configuration.visibleOnStart;
    this.references = this.configuration.references;


    }



    destructor() {
    this.menubar.remove();
    this.canvas.remove()
    }


    isReference(slideLabel) {
    return slideLabel in this.references;
    }

    get origin() {
    return [parseInt(this.canvas.style.left.slice(0, -2)), parseInt(this.canvas.style.top.slice(0, -2))];
    }

    setVisibilityState(visibleMenubar, visibleCanvas) {
    console.log(`FreehandDrawingApp: visibleMenubar: ${visibleMenubar}, visibleCanvas: ${visibleCanvas}`);
    if (!visibleMenubar && this.isActive) this.canvasToggle.dispatchEvent(new MouseEvent("click"));
    this.isVisible = visibleCanvas;
    this.menubar.style.visibility = setVisiblity(visibleMenubar);
    }


    setupCanvas() {//{{{
    this.canvas = document.createElement("canvas");
    this.canvas.dataset["createTime"] = new Date().getTime();
    this.canvas.id = "freehand-drawing-canvas";
    this.canvas.width = (this.width * this.scale);
    this.canvas.height = (this.height * this.scale);
    // this.canvas.style.visibility = "hidden";
    this.canvas.style.opacity = 0.2;
    this.canvas.style["pointerEvents"] = "none";
    this.canvas.style["touch-action"] = "none";
    this.canvas.style["z-index"] = 10;
    this.canvas.style.position = "absolute";
    this.canvas.style.top = `${this.canvasparentBbox.top}px`;
    this.canvas.style.left = `${this.canvasparentBbox.left}px`;
    // this.canvas.style.border = "dashed #555555";
    document.body.appendChild(this.canvas);

    this.toolDown = false;
    this.drawColor = "#929292";
    this.activeTool = "pen";
    this.eraserSize = 20;
    this.drawSize = this.configuration.penSize || 4;
    this.lastTouchPosition = undefined;
    this.movementTouchPosition = undefined;

    let ctx = this.context2d;
    ctx.scale(this.scale, this.scale);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.translate(0.5, 0.5);
    ctx.imageSmoothingEnabled = false;
    //Event Listeners

    this.canvas.addEventListener("pointerdown", (e) => {
        if (!e.isPrimary) return
        let ctx = this.context2d;
        e.preventDefault();
        if (this.activeTool == "pen") {
        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        if (this.lastTouchPosition == undefined) {

            this.lastTouchPosition = this.localCoordinate(e.x, e.y);
            ctx.moveTo(...this.lastTouchPosition);
        }
        } else if (this.activeTool == "eraser") {

        }

        this.toolDown = true;
    }, {passive: false})

    // this.canvas.addEventListener("touchstart", (e) => {
    //   this.toolDown = true;
    // })


    this.canvas.addEventListener("pointerleave", (e) => {
        if (!e.isPrimary) return
        e.preventDefault();
        this.toolDown = false;

    }, {passive: false})
    this.canvas.addEventListener("pointerup", (e) => {

        e.preventDefault();

        this.toolDown = false;
        let ctx = this.context2d;
        this.lastTouchPosition = undefined;
        // this.lastMovementTouchPosition = undefined;

    }, {passive: false})

    // this.canvas.addEventListener("touchend", (e) => {
    //   this.toolDown = false;
    //   this.lastTouchPosition = undefined;
    //   this.movementTouchPosition = undefined;
    //
    //})

    // This is necessary for apple pencil input,
    // allows writing fluently
    this.canvas.addEventListener("touchmove", (e) => {
        e.preventDefault()
    }, {passiv: false});

    this.canvas.addEventListener("pointermove", (e) => {
        if (!e.isPrimary) return

        e.preventDefault();
        ctx = this.context2d
        // console.log(this.lastTouchPosition);
        if (this.toolDown) {
        if (this.activeTool == "pen") {

            let [nowX, nowY] = this.localCoordinate(e.x, e.y)
            let [lastX, lastY] = [nowX - e.movementX, nowY - e.movementY];
            // console.log(e.movementX ** 2 + e.movementY ** 2)
            // let scale = 10 / (e.movementX ** 2 + e.movementY ** 2);
            let scale = (Math.abs(e.movementX) < 5 && Math.abs(e.movementY) < 5) ? 2 : 1;
            // let [lastX, lastY] = [nowX - scale * e.movementX, nowY - scale * e.movementY];
            // ctx.beginPath();
            // ctx.beginPath();

            ctx.strokeStyle = this.drawColor;
            ctx.fillStyle = this.drawColor;
            ctx.lineWidth = this.drawSize;
            ctx.lineTo(nowX, nowY);
            ctx.stroke();
            this.lastTouchPosition = [nowX, nowY];
            // ctx.moveTo(nowX, nowY + 50);
            // ctx.lineTo(lastX1, lastY1 + 50);
            // ctx.stroke();
            // ctx.beginPath();
            // ctx.arc((nowX + lastX) / 2, (nowY + lastY) / 2, this.drawSize / 10, 0, 2 * Math.PI);
            // ctx.fill()
            // ctx.closePath();
        } else if (this.activeTool == "eraser") {

            ctx.clearRect(...this.localCoordinateTransformed(e.x, e.y, {translate: [-this.eraserSize / 2, -this.eraserSize / 2]}), this.eraserSize, this.eraserSize);
            if (this.lastTouchPosition) {
            let [dx, dy] = [e.x - this.lastTouchPosition[0], e.y - this.lastTouchPosition[1]];
            INTERPOLATIONSTEPS.map(it => {
                let step = parseInt(it) / INTERPOLATIONSTEPS.length;
                ctx.clearRect(...this.localCoordinateTransformed(e.x, e.y, {translate: [-this.eraserSize / 2 + dx * step, -this.eraserSize / 2 + dy * step]}), this.eraserSize, this.eraserSize);

                // ctx.strokeRect(...this.localCoordinateTransformed(e.x, e.y, { translate: [-this.eraserSize / 2 + dx * step, -this.eraserSize / 2 + dy * step] }), this.eraserSize, this.eraserSize);

            })


            }
            this.lastTouchPosition = [e.x, e.y];
        }
        }
        return false
    }, {passive: false})



    // this.canvas.addEventListener("touchmove", (e) => {
    //   e.preventDefault();//{{{
    //   this.canvas.addEventListener("touchstart", (e) => {
    //     // ctx = this.context2d;
    //     // ctx.beginPath();
    //     //console.warn("Touch!");
    //     //document.getElementsByTagName("h1")[0].style.background = "#EABAC5";
    //     this.toolDown = true;
    //   })
    //   if (this.toolDown) {
    //
    //     // console.log(e)
    //     let [nowX, nowY] = this.localCoordinate(e.touches[0].clientX, e.touches[0].clientY);
    //
    //     if (this.lastTouchPosition == undefined) {
    //       this.lastTouchPosition = this.localCoordinate(e.touches[0].clientX, e.touches[0].clientY);
    //
    //       return false
    //     }
    //
    //     let [lastX, lastY] = this.lastTouchPosition;
    //     this.movementTouchPosition = [nowX - lastX, nowY - lastY];
    //     console.log(this.movementTouchPosition);
    //     let scale = (Math.abs(this.movementTouchPosition[0]) < 5 && Math.abs(this.movementTouchPosition[1]) < 5) ? 2 : 1;
    //     [lastX, lastY] = [nowX - scale * this.movementTouchPosition[0], nowY - scale * this.movementTouchPosition[1]];
    //
    //
    //     this.lastTouchPosition = this.localCoordinate(e.touches[0].clientX, e.touches[0].clientY);
    //     let ctx = this.context2d;
    //
    //     // console.log("FreehandDrawingApp:","t", e.touches[0].clientX, e.touches[0].clientY);
    //     // console.log("FreehandDrawingApp:","dt", e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    //     ctx.beginPath();
    //     ctx.strokeStyle = this.drawColor;
    //
    //     // ctx.fillStyle = "#" + (parseInt(this.drawColor.replace("#", "0x")) + 500000).toString(16);
    //     ctx.fillStyle = this.drawColor;
    //     ctx.lineWidth = this.drawSize;
    //     // ctx.stroke();
    //     // ctx.moveTo((nowX + lastX) / 2, (nowY + lastY) / 2);
    //     // ctx.lineTo(lastX, lastY);
    //     // ctx.stroke();
    //     ctx.moveTo(nowX, nowY);
    //     ctx.lineTo(lastX, lastY);
    //     ctx.stroke();
    //     // ctx.moveTo(...lerp(...nowX, ...lastX, 0.25));
    //     // ctx.lineTo(...lerp(...nowX, ...lastX, 0.75))
    //     // ctx.stroke();
    //     // ctx.beginPath();
    //     // ctx.arc((nowX + lastX) / 2, (nowY + lastY) / 2, this.drawSize / 4, 0, 2 * Math.PI);
    //     // ctx.fill()
    //     // ctx.closePath();
    //
    //     // ctx.fill()
    //   }
    //   return false//}}}
    // }, { passive: false }
    // )


    }//}}}



    setupMenubar(visibleOnStart) {
    this.menubar = document.createElement("div");
    this.menubar.id = "freehand-drawing-menubar";

    switch (this.configuration.menubar.direction) {
        case "up":
        case "north":
        this.menubar.__DIRECTION = DIRECTION.NORTH;
        break;
        case "right":
        case "east":
        this.menubar.__DIRECTION = DIRECTION.EAST;
        break;
        case "down":
        case "south":
        this.menubar.__DIRECTION = DIRECTION.SOUTH;
        break;
        case "left":
        case "west":
        this.menubar.__DIRECTION = DIRECTION.WEST;
        break;

        default:
        throw Error(`menubar.direction is ${this.configuration.direction} but has to be one of 'up'/'north','right'/'east','down'/'south','left'/'west'!`)
    }

    this.menubar.style.background = "#AAAAAA55";
    if (!this.configuration.menubar.moveable) this.menubar.style.background = "#AAAAAA00";
    this.menubar.style.position = "absolute";
    this.menubar.__BUTTONSIZE = this.canvasparentBbox.width / 30;
    this.menubar.__LONGEDGE = this.canvasparentBbox.width / 5;
    this.menubar.__SHORTEDGE = this.canvasparentBbox.width / 30;

    let top, left;
    if (this.configuration.startLocation.y_relative != undefined) {
        console.log("FreehandDrawingApp: relative y")
        top = this.canvasparentBbox.top + this.configuration.startLocation.y_relative * this.canvasparentBbox.height - this.menubar.__BUTTONSIZE / 2;
    } else if (this.configuration.startLocation.y_absolute != undefined) {
        console.log("FreehandDrawingApp: absolute y")
        top = this.configuration.startLocation.y_absolute - this.menubar.__BUTTONSIZE / 2
    } else {
        console.log("FreehandDrawingApp:  default y")
        this.canvasparentBbox.bottom - this.menubar.__BUTTONSIZE;
    };
    if (this.configuration.startLocation.x_relative != undefined) {
        console.log("FreehandDrawingApp: relative x")
        left = this.canvasparentBbox.left + this.configuration.startLocation.x_relative * this.canvasparentBbox.width - this.menubar.__BUTTONSIZE / 2
    } else if (this.configuration.startLocation.x_absolute != undefined) {
        console.log("FreehandDrawingApp: absolute x")
        left = this.configuration.startLocation.x_absolute - this.menubar.__BUTTONSIZE / 2;
    } else {
        console.log("FreehandDrawingApp:  default x")
        left = this.canvasparentBbox.right / 2;
    };




    if (DIRECTION.isHorizontal(this.menubar.__DIRECTION)) {
        console.log("FreehandDrawingApp:", "horizontal");

        this.menubar.style.width = `${this.menubar.__LONGEDGE}px`;
        this.menubar.style.height = `${this.menubar.__SHORTEDGE}px`;

        this.menubar.style.top = `${top}px`;


        if (DIRECTION.isPositive(this.menubar.__DIRECTION)) {
        console.log("FreehandDrawingApp:", "positive");
        this.menubar.style.left = `${left}px`

        } else {
        console.log("FreehandDrawingApp:", "negative");
        this.menubar.style.left = `${left - this.menubar.__LONGEDGE + this.menubar.__BUTTONSIZE}px`

        }


    } else {
        console.log("FreehandDrawingApp:", "vertical");
        this.menubar.style.height = `${this.menubar.__LONGEDGE}px`;
        this.menubar.style.width = `${this.menubar.__SHORTEDGE}px`;

        this.menubar.style.left = `${left}px`;

        if (DIRECTION.isPositive(this.menubar.__DIRECTION)) {
        console.log("FreehandDrawingApp:", "positive");
        this.menubar.style.top = `${top - this.menubar.__LONGEDGE + this.menubar.__BUTTONSIZE}px`
        } else {
        console.log("FreehandDrawingApp:", "negative");
        this.menubar.style.top = `${top}px`;

        }

    }
    // this.menubar.style.top = `${ this.canvasparentBbox.top } px`;
    // this.menubar.style.left = `${ this.canvasparentBbox.left } px`;
    this.menubar.style["z-index"] = 15;
    this.menubar.dataset.isDragged = "false";
    document.body.appendChild(this.menubar);

    if (this.configuration.menubar.moveable) {
        this.menubar.__POSITION = {dx: 0, dy: 0, pos3: 0, pos4: 0};

        this.menubar.addEventListener("pointerdown", (e) => {
        this.menubar.dataset.isDragged = "true";
        e.preventDefault();
        this.menubar.__POSITION.x = e.clientX;
        this.menubar.__POSITION.y = e.clientY;
        return false
        }, {passive: false})


        this.menubar.addEventListener("pointerup", (e) => {
        e.preventDefault();
        this.menubar.dataset.isDragged = "false";
        return false
        }, {passive: false});


        document.addEventListener("pointermove", (e) => {
        if (this.menubar.dataset.isDragged == "true") {
            e.preventDefault();
            this.menubar.__POSITION.dx = this.menubar.__POSITION.x - e.clientX;
            this.menubar.__POSITION.dy = this.menubar.__POSITION.y - e.clientY;
            this.menubar.__POSITION.x = e.clientX;
            this.menubar.__POSITION.y = e.clientY;
            this.menubar.style.left = (this.menubar.offsetLeft - this.menubar.__POSITION.dx) + "px";
            this.menubar.style.top = (this.menubar.offsetTop - this.menubar.__POSITION.dy) + "px";
        }
        return false
        }, {passive: false});
    }
    this.menubar.style.visibility = setVisiblity(visibleOnStart);

    this.canvasToggle = document.createElement("button");
    this.canvasToggle.id = "canvas-toggle"
    this.canvasToggle.style.width = `${this.menubar.__BUTTONSIZE}px`;
    this.canvasToggle.style.height = `${this.menubar.__BUTTONSIZE}px`;
    this.canvasToggle.style.fontSize = '16pt';
    this.canvasToggle.style.background = IMAGEBASE64.PENON;//"url('assets/pen-on.png')"
    this.canvasToggle.style["background-position"] = "center";
    this.canvasToggle.style["background-size"] = `${this.menubar.__BUTTONSIZE}px`;;

    this.canvasToggle.style["border-radius"] = `${this.menubar.__BUTTONSIZE}px`;
    // this.canvasToggle.style.height = "32px";
    this.canvasToggle.style.position = 'absolute';
    // this.canvasToggle.style.border = "none";

    // this.canvasToggle.style.transform = `translate(-${ this.width }px, ${ this.height - 32 }px)`

    if (DIRECTION.WEST == this.menubar.__DIRECTION) {
        this.canvasToggle.style.marginLeft = `${this.menubar.__LONGEDGE - this.menubar.__BUTTONSIZE}px`;
    }
    if (DIRECTION.NORTH == this.menubar.__DIRECTION) {
        this.canvasToggle.style.marginTop = `${this.menubar.__LONGEDGE - this.menubar.__BUTTONSIZE}px`;
    }
    this.menubar.appendChild(this.canvasToggle);

    this.menubarButtonsDiv = document.createElement("div");
    this.menubarButtonsDiv.id = "freehand-drawing-menubar-buttons";
    this.menubarButtonsDiv.style.background = "#AAAAAA00";
    if (DIRECTION.isHorizontal(this.menubar.__DIRECTION)) {
        this.menubarButtonsDiv.style.height = `${this.menubar.__BUTTONSIZE}px`;
        this.menubarButtonsDiv.style.width = `${this.menubar.__LONGEDGE - this.menubar.__BUTTONSIZE}px`;
    } else {
        this.menubarButtonsDiv.style.width = `${this.menubar.__BUTTONSIZE}px`;
        this.menubarButtonsDiv.style.height = `${this.menubar.__LONGEDGE - this.menubar.__BUTTONSIZE}px`;

    }
    this.menubarButtonsDiv.style.visibility = "hidden";

    if (DIRECTION.NORTH == this.menubar.__DIRECTION) {
        // this.menubarButtonsDiv.style.transform = `translate(${0}px, ${this.menubar.__BUTTONSIZE}px)`
    }
    if (DIRECTION.EAST == this.menubar.__DIRECTION) {
        this.menubarButtonsDiv.style.transform = `translate(${this.menubar.__BUTTONSIZE}px, ${0}px)`
    }
    if (DIRECTION.SOUTH == this.menubar.__DIRECTION) {
        this.menubarButtonsDiv.style.transform = `translate(${0}px, ${this.menubar.__BUTTONSIZE}px)`
    }
    if (DIRECTION.WEST == this.menubar.__DIRECTION) {
        // this.menubarButtonsDiv.style.transform = `translate(${this.menubar.__LONGEDGE - this.menubar.__BUTTONSIZE}px, ${0}px)`
    }
    this.menubar.appendChild(this.menubarButtonsDiv);
    console.log(this.menubarButtonsDiv);

    this.menubarButtons = {}
    this.menubarButtons.colorGray = document.createElement("button");
    this.menubarButtons.colorGreen = document.createElement("button");
    this.menubarButtons.colorPurple = document.createElement("button");
    this.menubarButtons.eraser = document.createElement("button");
    // this.menubarButtons.undo = document.createElement("button");
    // this.menubarButtons.redo = document.createElement("button");
    // this.menubarButtons.size1 = document.createElement("button");
    // this.menubarButtons.size2 = document.createElement("button");

    this.menubarButtons.colorGray.style.fontSize = '16pt';
    this.menubarButtons.colorGray.dataset.color = "gray"

    if (DIRECTION.isHorizontal(this.menubar.__DIRECTION)) {
        this.menubarButtons.colorGray.style.transform = `translate(${this.menubar.__BUTTONSIZE * 0.4}px, 0px)`
    } else {
        this.menubarButtons.colorGray.style.transform = `translate(0px, ${this.menubar.__BUTTONSIZE * 0.4}px)`

    }
    this.menubarButtons.colorGray.style.background = IMAGEBASE64.PENGRAY;//"url('assets/pen-gray.png')"
    this.menubarButtons.colorGray.style["background-position"] = "center";
    this.menubarButtons.colorGray.style["background-size"] = `${this.menubar.__BUTTONSIZE}px`;;
    this.menubarButtons.colorGray.style.width = `${this.menubar.__BUTTONSIZE}px`;
    this.menubarButtons.colorGray.style.height = `${this.menubar.__BUTTONSIZE}px`;
    this.menubarButtons.colorGray.style["border-radius"] = `${this.menubar.__BUTTONSIZE}px`;
    this.menubarButtons.colorGray.style.opacity = 1;

    this.menubarButtons.colorGreen.style.fontSize = '16pt';
    this.menubarButtons.colorGreen.dataset.color = "green"
    if (DIRECTION.isHorizontal(this.menubar.__DIRECTION)) {
        this.menubarButtons.colorGreen.style.transform = `translate(${this.menubar.__BUTTONSIZE * 0.4}px, 0px)`
    } else {
        this.menubarButtons.colorGreen.style.transform = `translate(0px, ${this.menubar.__BUTTONSIZE * 0.4}px)`
    }
    this.menubarButtons.colorGreen.style.background = IMAGEBASE64.PENGREEN;//"url('assets/pen-green.png')";
    this.menubarButtons.colorGreen.style["background-position"] = "center";
    this.menubarButtons.colorGreen.style["background-size"] = `${this.menubar.__BUTTONSIZE}px`;;
    this.menubarButtons.colorGreen.style.width = `${this.menubar.__BUTTONSIZE}px`;
    this.menubarButtons.colorGreen.style.height = `${this.menubar.__BUTTONSIZE}px`;
    this.menubarButtons.colorGreen.style["border-radius"] = `${this.menubar.__BUTTONSIZE}px`;
    this.menubarButtons.colorGreen.style.opacity = 0.7;

    this.menubarButtons.colorPurple.style.fontSize = '16pt';
    this.menubarButtons.colorPurple.dataset.color = "purple"
    if (DIRECTION.isHorizontal(this.menubar.__DIRECTION)) {
        this.menubarButtons.colorPurple.style.transform = `translate(${this.menubar.__BUTTONSIZE * 0.4}px, 0px)`
    } else {

        this.menubarButtons.colorPurple.style.transform = `translate(0px, ${this.menubar.__BUTTONSIZE * 0.4}px)`

    }
    this.menubarButtons.colorPurple.style.background = IMAGEBASE64.PENPURPLE;//"url('assets/pen-purple.png')"
    this.menubarButtons.colorPurple.style["background-position"] = "center";
    this.menubarButtons.colorPurple.style["background-size"] = `${this.menubar.__BUTTONSIZE}px`;;
    this.menubarButtons.colorPurple.style.width = `${this.menubar.__BUTTONSIZE}px`;
    this.menubarButtons.colorPurple.style.height = `${this.menubar.__BUTTONSIZE}px`;
    this.menubarButtons.colorPurple.style["border-radius"] = `${this.menubar.__BUTTONSIZE}px`;
    this.menubarButtons.colorPurple.style.opacity = 0.7;


    if (DIRECTION.isHorizontal(this.menubar.__DIRECTION)) {
        this.menubarButtons.eraser.style.transform = `translate(${this.menubar.__BUTTONSIZE * 0.4}px, 0px)`
    } else {
        this.menubarButtons.eraser.style.transform = `translate(0px, ${this.menubar.__BUTTONSIZE * 0.4}px)`
    }
    this.menubarButtons.eraser.style.background = IMAGEBASE64.ERASER;//"url('assets/eraser.png')"
    this.menubarButtons.eraser.style["background-position"] = "center";
    this.menubarButtons.eraser.style["background-size"] = `${this.menubar.__BUTTONSIZE}px`;

    this.menubarButtons.eraser.style.width = `${this.menubar.__BUTTONSIZE}px`;
    this.menubarButtons.eraser.style.height = `${this.menubar.__BUTTONSIZE}px`;
    this.menubarButtons.eraser.style["border-radius"] = `${this.menubar.__BUTTONSIZE}px`;

    // this.menubarButtons.undo.style.transform = `translate(30px, 0px)`
    // this.menubarButtons.undo.style.background = "url('assets/undo.png')"
    // this.menubarButtons.undo.style.width = "50px";
    // this.menubarButtons.undo.style.height = "50px";
    // this.menubarButtons.undo.style["border-radius"] = "50px";
    //
    // this.menubarButtons.redo.style.transform = `translate(30px, 0px)`
    // this.menubarButtons.redo.style.background = "url('assets/redo.png')"
    // this.menubarButtons.redo.style.width = "50px";
    // this.menubarButtons.redo.style.height = "50px";
    // this.menubarButtons.redo.style["border-radius"] = "50px";

    function highlightToolButton(color, buttons) {
        let allButtons = ["colorGray", "colorGreen", "colorPurple", "eraser"];
        allButtons.filter(it => it != color).forEach(it => {
        buttons[it].style.opacity = 0.7;
        })
        buttons[color].style.opacity = 1;
    }

    //
    // this.menubarButtons.size0.style.fontSize = '16pt';
    // this.menubarButtons.size0.textContent = "."
    // this.menubarButtons.size0.style.transform = `translate(90px, 0px)`
    //
    // this.menubarButtons.size1.style.fontSize = '16pt';
    // this.menubarButtons.size1.textContent = "o"
    // this.menubarButtons.size1.style.transform = `translate(100px, 0px)`
    //
    // this.menubarButtons.size2.style.fontSize = '16pt';
    // this.menubarButtons.size2.textContent = "O"
    // this.menubarButtons.size2.style.transform = `translate(100px, 0px)`


    let drawColors = {"gray": "#929292", "purple": "#963bd8", "green": "#2dac11"};
    // let drawSizes = { ".": 2, "o": 4, "O": 6 };
    Object.entries(this.menubarButtons).forEach(([label, button]) => {
        if (label.startsWith("color")) {

        button.addEventListener("click", (e) => {
            console.log(e.target.dataset.color)
            this.canvas.style.cursor = IMAGEBASE64.CURSORPEN + ", auto";//"url('assets/cursor_pen.svg'), auto";
            this.activeTool = "pen";
            this.drawColor = drawColors[e.target.dataset.color];
            highlightToolButton(label, this.menubarButtons)

        })
        } else if (label == "eraser") {
        button.addEventListener("click", (e) => {
            this.canvas.style.cursor = IMAGEBASE64.CURSORERASER + ", auto";//"url('assets/cursor_pen.svg'), auto";
            this.activeTool = "eraser";
            highlightToolButton(label, this.menubarButtons)

        })
        }
        this.menubarButtonsDiv.appendChild(button)
    })




    //this.menubar.appendChild(this.canvasToggle);
    this.canvasToggle.addEventListener("click", (e) => {
        console.log(e)
        console.log(this)
        if (!this.isActive) {
        this.isActive = !this.isActive;
        console.log("FreehandDrawingApp:", "clicked on the canvas toggle");
        this.canvasToggle.style.background = IMAGEBASE64.PENOFF; //"url('assets/pen-off.png')"
        this.canvasToggle.style["background-position"] = "center";
        this.canvasToggle.style["background-size"] = `${this.menubar.__BUTTONSIZE}px`;
        //this.canvas.style.visibility = "visible";
        this.menubarButtonsDiv.style.visibility = "visible";

        this.canvas.style.opacity = 1;
        this.canvas.style.removeProperty("pointer-events");
        this.canvas.style.cursor = IMAGEBASE64.CURSORPEN + ", auto";//"url('assets/cursor_pen.svg'), auto";

        } else {
        this.isActive = !this.isActive;
        this.canvasToggle.style.background = IMAGEBASE64.PENON; //"url('assets/pen-on.png')"
        this.canvasToggle.style["background-position"] = "center";
        this.canvasToggle.style["background-size"] = `${this.menubar.__BUTTONSIZE}px`;
        //this.canvas.style.visibility = "hidden"
        this.menubarButtonsDiv.style.visibility = "hidden";
        this.canvas.style.opacity = 0.2;
        this.canvas.style["pointerEvents"] = "none";
        this.canvas.style.removeProperty("cursor");
        }
    })
    }



    get context2d() {
    return this.canvas.getContext("2d");
    }

    localCoordinate(windowX, windowY) {
    let origin = this.origin;
    //console.log(origin);
    return [(windowX + window.scrollX - origin[0]) / this.scale, (windowY + window.scrollY - origin[1]) / this.scale]
    }

    localCoordinateTransformed(windowX, windowY, transform) {
    let localCoords = this.localCoordinate(windowX, windowY);
    if (transform == undefined) return localCoords;
    if (transform.translate != undefined) {
        localCoords = [localCoords[0] + transform.translate[0], localCoords[1] + transform.translate[1]]
    }
    if (transform.matrix != undefined) {
        throw Error("Matrix transform not implemented, yet!")
    }

    return localCoords
    }

    insideCanvas(windowX, windowY) {
    let [x, y] = this.localCoordinate(windowX, windowY)
    // console.log(x, y)
    return ((0 <= x) && (x <= this.width)) && ((0 <= y) && (y <= this.height))
    }

    canvasDataIndex(x, y) {
    return undefined
    }

    toolDownToogle() {
    this.toolDown = !this.penDown
    }


}//}}}








function main(configuration) {
    const crossplatformMutationObserver = MutationObserver || WebKitMutationObserver;

    console.log("FreehandDrawingApp:", "configuration:", configuration);

    console.log("FreehandDrawingApp:", "canvas:", document.getElementById("freehand-drawing-canvas"));



    if (document.getElementById("freehand-drawing-canvas") != null) {
    console.log("FreehandDrawingApp:", "Freehand drawing app, has been started already")
    return
    }

    if (configuration.mode == "articulate") {
    player.__freehanddrawing_data = {
        canvasStore: new Map()
    }
    console.log("FreehandDrawingApp:", "running in articulate.")
    configuration.elementID = "slide-window";
    configuration.labelID = "slide-label";
    if (configuration.startActive == undefined) configuration.startActive = false;
    if (configuration.references == undefined) configuration.references = {};
    configuration.APP = undefined;

    let observerConfig = {childList: true};

    let slideLabel = document.getElementById(configuration.labelID);

    let mutationObserver = new crossplatformMutationObserver((m) => {
        console.log(m);
        // newSlide.slice(7):  every slide label starts with the 7 chars string 'slide: '
        let oldSlide = m[0].removedNodes[0].textContent.slice(7);
        let newSlide = m[0].addedNodes[0].textContent.slice(7);
        (() => {

        let [canvas, ctx] = [configuration.APP.canvas, configuration.APP.context2d]
        if (configuration.storeCanvases) {
            let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
            if (!configuration.APP.isReference(oldSlide) && (data.data.find(it => it != 0) != undefined)) {
            player.__freehanddrawing_data.canvasStore.set(oldSlide, data)
            }
        }
        //clear the canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if (configuration.storeCanvases) {
            if (player.__freehanddrawing_data.canvasStore.has(newSlide)) {
            console.log("FreehandDrawingApp: Get Canvas data (no reference)", `${newSlide}`);
            data = player.__freehanddrawing_data.canvasStore.get(newSlide)
            ctx.putImageData(data, 0, 0);
            } else if (configuration.APP.isReference(newSlide) && player.__freehanddrawing_data.canvasStore.has(configuration.references[newSlide])) {
            console.log("FreehandDrawingApp: Get Canvas data (reference)", `${configuration.references[newSlide]}`);
            data = player.__freehanddrawing_data.canvasStore.get(configuration.references[newSlide])
            ctx.putImageData(data, 0, 0);
            }

        }

        configuration.APP.setVisibilityState(
            !configuration.APP.isReference(newSlide) && !configuration.labelBlacklist.includes(newSlide),
            !configuration.labelBlacklist.includes(newSlide)
        )
        })()
    })
    mutationObserver.observe(slideLabel, observerConfig);
    console.log("FreehandDrawingApp:", "Setting up app")
    configuration.APP = new DrawingApp(configuration.elementID, configuration.startActive, configuration.references);

    console.log("FreehandDrawingApp:", configuration.APP.width, configuration.APP.height);

    let ctx = configuration.APP.context2d;
    ctx.font = "30px Arial";

    player.__freehanddrawing_data.config = configuration;



    } else if (configuration.mode == "website") {
    console.log("FreehandDrawingApp:", "running as website.")
    configuration.startActive = true;

    console.log("FreehandDrawingApp:", "Setting up app")
    window.addEventListener("load", (e) => {
        configuration.APP = new DrawingApp(configuration);

        console.log(configuration.APP.width, configuration.APP.height);

        let ctx = configuration.APP.context2d;
        ctx.font = "30px Arial";
    })
    }

}

// Use with articulate:
// main(player.__freehanddrawing_data.config)
// Use as website
// main(CONFIGURATION)


main(window.CONFIGURATION)