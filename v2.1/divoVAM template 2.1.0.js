() => ({
scripts: {
  init: 
  // FW: divomath config
  `// v1
// Access divomath editor settings
'dmconf = divomathConfig.configuration;
'dmstate = divomathConfig.divomathVarState;
'dmprevans = divomathPreviousAnswer;
'dmisviewer = divomathConfig.runtime == "VIEWER"; // otherwise "EDITOR" (or nada)

// @Overwrite
// Builds a state object to be used by divomathGetVarState()
divomathSetState() := (
	regional(state);

	// Build a state object, to be transfered to divomath.
	// should be nada if state is not supposed to change or should equal 'dmstate.
	// see helper functions (Section E)
	state = nada;
	if('debuglevel > 9,
		println("(!) Overwrite divomathSetState() in current VAM.");
	);
		
	state; // Return state;
);

// @Overwrite
// Update divomath results to be used for validation.
divomathUpdateResults() := (
	if('debuglevel > 9,
		println("(!) Overwrite divomathUpdateResults() in current VAM.");
	);
);

// Set vam by divomath, else default
vam = if(!isundefined('dmconf.vam), 'dmconf.vam, "default");

// Set environment vars
'bgcolor = if(!isundefined('dmconf.bgcolor),
	'dmconf.bgcolor,
	[1,1,1]
);
'debuglevel  = if(!isundefined('dmconf.debuglevel),
	'dmconf.debuglevel,
	0
); // 0:no debug, >0:higher precision of debug
  `
  +  // FW: configuration
  `// v1
// Vars for configuring VAM behavior
// Convention - starts with single quote (')

// A | Common flags
isdebugging='isdebugging = false;	// Toggle debugging. (legacy)
//'debuglevel = 10; // local overwrite for debuglevel set by divomath
mousepressedtime='mousepressedtime=false;

// B | Screen config parameters
'bordersize = .05; // default border size (equals 0.5 mm fineliner)
'pinchsensitivity = 1; // default pinch sensitivity
'doc = "No docstring for VAM.";
'doctextpos = (screenbounds()_1).xy+[1,-0.5];

// C | Overwrite VAM choice locally
//vam = "strapwork"; // comment before production

  `
  +  // FW: constants
  `// v4
// Predefined Constants
// - Convention: Captilize constants
// - Second copy of variable which does not follow convention for legacy use

// A | Preddefined colors
// A.0 | General colors
darkred=DARKRED=(228,26,28)/255;
darkblue=DARKBLUE=(55,126,184)/255;
darkgreen=DARKGREEN=(77,175,74)/255;

// A.1 | DZLM colors
dzlmcolorlight=DZLMCOLORLIGHT = (207,221,225)/255;
dzlmcolordark=DZLMCOLORDARK = (70,120,132)/255;
dzlmcolorgold=DZLMCOLORGOLD = (239,182,96)/255;
dzlmchipblue=DZLMCOLORBLUE = (127,127,247)/255;
dzlmchipred=DZLMCOLORRED = (239,134,131)/255;

// A.2 | Colors representing place values
placecolorred=PLACECOLORRED = (102,194,165)/255;
placecolorgreen=PLACECOLORGREEN = (252,141,98)/255;
placecolorblue=PLACECOLORBLUE = (141,160,203)/255;

placevaluepalette=PLACEVALUEPALETTE = [
	PLACECOLORGREEN,  // Hundreds
	PLACECOLORBLUE,		// Tens
	PLACECOLORRED			// Units
];

// A.3 | Divomath colors
divogreen=DIVOGREEN = (129,239,104)/255;
divoviolett=DIVOVIOLET = (150,59,216)/255;
divograu=DIVOGREY = (130,149,192)/255;
divoschwarz=DIVOBLACK = grey(0);
divorot=DIVORED = (235,85,78)/255;
divoblau=DIVOBLUE = (83,125,156)/255;

divopalette=DIVOPALETTE = [
	DIVOBLUE,
	DIVORED,
	DIVOGREEN,
	DIVOVIOLET,
	DIVOGREY,
	DIVOBLACK
];

// A.4. | Montessori colors
MONTERED = (240,150,112)/255;
MONTEGREEN = (108,169,255)/255;
MONTEBLUE = (100,228,178)/255;
MONTEGREY = (242,242,242)/255;

MONTEPALETTE = [
	MONTEGREEN, MONTEBLUE, MONTERED
];

// A.* | Color palettes
// Color palettes consisting of colors above
vampalette=VAMPALETTE= [
	DARKRED,
	DARKBLUE,
	DARKGREEN,
	DZLMCOLORGOLD,
	DZLMCOLORDARK
];

COLORMAP = {
	"DARKRED" : DARKRED, "DARKBLUE" : DARKBLUE, "DARKGREEN" : DARKGREEN,
	"DZLMCOLORGOLD" : DZLMCOLORGOLD, "DZLMCOLORDARK" : DZLMCOLORDARK,
	"PLACECOLORGREEN" : PLACECOLORGREEN,
	"PLACECOLORBLUE" : PLACECOLORBLUE,
	"PLACECOLORRED" : PLACECOLORRED,
	"DIVOGREEN" : DIVOGREEN, "DIVOVIOLET" : DIVOVIOLET, "DIVOGREY" : DIVOGREY,
	"DIVOBLACK" : DIVOBLACK, "DIVORED" : DIVORED, "DIVOBLUE" : DIVOBLUE
};

// B | System info
// B.0 | Version information
VERSION = version();
cindyjs=ISCINDYJS = VERSION_1=="CindyJS"; // true, if CindyJS is used

// B.1 | Screen size
// [width, height] of the the Cindy window
pixelxy=WINDOWSIZE = 
	[
		(screenbounds()_2_1-screenbounds()_1_1)*screenresolution(),
		(screenbounds()_2_2-screenbounds()_3_2)*screenresolution()
	];

// C | Fonts
// C.1 | Available Fonts
fonts=FONTS = if(cindyjs,[],fontfamilies());

schulfont=SCHULFONT = "Arial";
//if(contains(fonts,"DejaVu Sans Mono"), schulfont=SCHULFONT = "DejaVu Sans Mono");
//if(contains(fonts,"Helvetica Neue"), schulfont=SCHULFONT = "Helvetica Neue");
//if(contains(fonts,"Schulbuch Nord Pro"), schulfont=SCHULFONT = "Schulbuch Nord Pro");
if(contains(fonts,"Gruschudru basic"), schulfont=SCHULFONT = "Gruschudru basic");

monofont=MONOFONT ="Courier";//"Arial"; //Courier, Monaco

// C.2 | Unicode characters
checkbox0=CB0 = unicode("2610");
checkbox1=CB1 = unicode("2612");
cdot=CDOT = unicode("00B7");

// D | Other
E  = exp(1);
PI = 3.141592653589793238462643383279;

VALUEMAP = {
"1" : "Einer", "2" : "Zweier", "3" : "Dreier", "4" : "Vierer", "5" : "Fünfer", "6" : "Sechser", "7" : "Siebener", "8" : "Achter", "9" : "Neuner", "10" : "Zehner", "11" : "Elfer", "12" : "Zwölfer"
};

HEXMAP = {
	"0":0,"1":1,"2":2,"3":3,"4":4,
	"5":5,"6":6,"7":7,"8":8,"9":9,
	"a":10,"b":11,"c":12,"d":13,"e":14,"f":15,
	"A":10,"B":11,"C":12,"D":13,"E":14,"F":15
};
  `
  +  // FW: general vars init
  `// v1
// Init of general variables for use in the framework.
// A | Object lists for drawing
obj = []; 				// All relevant VAM objects (mostly for drawing)
objpreview = []; 	// All temporary VAM objects (for drawing)

// B | Flags
mousedown = false; // Toggles in relevant mouse scripts

getscreenparams():= ( // Set screen parameters
	bordersize = screenresolution()* 'bordersize; // equals 0.5 mm fineliner
	pinchsensitivity = 10/screenresolution() * 'pinchsensitivity; 
	//err(pinchsensitivity);
);
getscreenparams();


// -----------------------------------------------
// Legacy. What is this for?
typeorder=[]; // venrünftige order: "tasksheet","task","keyboard","multarray","chipreservoir","arraychip"];
modes= []; // globale Modi, ist vermutlich gar nicht gebraucht, 
// AGENDA: lieber raus, wir wird benutzt in modebutton und fractionbar

//history = []; // AGENDA: muss noch umgesetzt werden

// bugfix (legacy)
preview=false;
  `
  +  // FW: animations
  `// v1
// Animations...@Todo: Document
animations = [];

// animation: object, property, animationtype, 
//  					start value, starttime,
//	 					end value, duration

new animationobject(object, property, startvalue, endvalue, duration, timeflow) := (
	regional(now);
	now = seconds();
	if(not(isundefined(delay)),now=now+delay);
	animations = animations :> 
		{ "object" : object, "property": property, 
			"startvalue" : startvalue, "endvalue" : endvalue,
	  	"starttime" : now, "endtime" : now + duration,
			"kill" : false,
			"timeflow" : timeflow,   // should be linear, accel, or jump
			"movepath": movepath
		};
	playanimation();
);

new animationobjectwithdelay(object, property, startvalue, endvalue, duration, timeflow, delay) := (
	regional(now,then); now = seconds();
	then=now+delay;
	animations = animations :> 
		{ "object" : object, "property": property, 
			"startvalue" : startvalue, "endvalue" : endvalue,
	  	"starttime" : then, "endtime" : then + duration,
			"kill" : false,
			"timeflow" : timeflow,   // should be linear, accel, or jump
			"movepath": movepath
		};
	playanimation();
);

setpropertylater(object, property, value, delay) := (
	regional(now,then); now = seconds();
	then=now+delay;
	animations = animations :> 
		{ "object" : object, "property": property, 
			"startvalue" : (object:property), "endvalue" : value,
	  	"starttime" : now, "endtime" : then,
			"kill" : false,
			"timeflow" : "set"   // should be linear, accel, or jump
		};
	playanimation();
);

new animationobject(object, property, startvalue, endvalue, duration, timeflow, kill) := (
	regional(now); now = seconds();
	animations = animations :> 
		{ "object" : object, "property": property, 
			"startvalue" : startvalue, "endvalue" : endvalue,
	  	"starttime" : now, "endtime" : now + duration,
			"kill" : kill,
			"timeflow" : timeflow, // should be linear, accel, or jump
			"movepath": movepath
		};
	playanimation();
);


new animationpath(object, property, startvalue, endvalue, duration, timeflow, f) := (
	regional(now); now = seconds();
	animations = animations :> 
		{ "object" : object, "property": property, 
			"startvalue" : startvalue, "endvalue" : endvalue,
	  	"starttime" : now, "endtime" : now + duration,
			"kill" : false,
			"timeflow" : timeflow,
			"movepath": f
		};
	playanimation();
);


new dolater(object, command, duration) := (
	regional(now); now = seconds();
	animations = animations :> 
		{ "object" : object, 
	  	"starttime" : now, 
			"endtime" : now + duration,
			"command" : command
		};
	playanimation();
);


if(false,
moveanimationtest() := new animationobject(obj_1,"coord",obj_1:"coord",(random(10),random(10)),0.5,"linear");

accelanimationtest() := new animationobject(obj_1,"coord",obj_1:"coord",(random(10),random(10)),0.5,"accel");

killanimationtest() := new animationobject(obj_1,"coord",obj_1:"coord",(random(10),random(10)),0.5,"accel",true);

coloranimationtest() := new animationobject(obj_1,"color",obj_1:"color",hue(random(1)),0.5,"linear");
);
  `
  + // FW: helper functions
  `// v2
// Convenience functions

// A | VAM object functions
// A.0 | Instance methods (kind of); only useful as object properties
my(property) := ( // Getter some property.
	self():property;
);
set my(key, value) := self():key = value; // Setter

namedef(object) := ( // Sets a "name" property
	object:"name" := self():"type"+self():"coord";
);
copyonmove(object):= ( // Copies an object, when it is moved.
	object:"clickcopy" := self():"copy";
	object:"number" := 0;
);
copyonmove2(object):= ( // sorgt dafür, dass ein Objekt kopiert wird, wenn es bewegt wird
	object:"clickcopy" := (
		copy = self():"copy";copy:"deletecopyifnotmovedandsubstitutebyoriginal"=self();copy;
	);
	object:"number" := 0;
);

// A.1 | Setter
//**Sets some key:value pair of an object. 
//* Fails if object does not have key.
//*	@param object: reference to object to be changed
//* @param    key: attribute to be changed
//* @param  value: new value for corresponding key
//* @returns: new value if succesful, nada if key not in object.
//**
setProperty(object, key, value) := (
	if (object:key == nada,
		err("setProperty(): Cannot set property. Key not in object.");
		nada,
		object:key = value;
	);
);

// Convenience setters for shared attributes of every VAMobject
setType(object, type) 							:= object:"type" = type;
setCoords(object, coord) 						:= object:"move"; // Do not access coords directly
setIshot(object, ishot) 						:= object:"ishot" = ishot;
setIsmoveable(object, ismoveable) 	:= object:"ismoveable" = ismoveable;
setIsclickable(object, isclickable)	:= object:"isclickable" = isclickable;
setGetAction(object, getaction) 		:= object:"getaction" = getaction;

toggleIshot(object) 			:= object:"ishot" = !object:"ishot";
toggleIsmoveable(object)	:= object:"ismoveable" = !object:"ismoveable";
toggleIsclickable(object)	:= object:"isclickable" = !object:"isclickable";

// A.2 | Getter
get(object, property) := object:property;

// A.3 | Children
//**
//*
//**
appendchild(object, child) := (
	regional(hasnoparent, canhavechildren);
	hasnoparent 		= child:"parent" == nada;
	canhavechildren = object:"children" != nada;

	// Parent has no "children" key.
	if(!canhavechildren,
		err("Object is not ready to be a parent. Create object: 'children' = []");
	);
	// Childs "parent" key is not nada.
	if(!hasnoparent,
		err("Child already has a parent.");
	);
	// Child has no parent & parent can have children
	if(canhavechildren & hasnoparent,
		// Set parents 'sizeofchildren' property accordingly
		object:"sizeofchildren" = object:"sizeofchildren" + child:"size";
		// Append child to parent and add parent to child
		object:"children" = object:"children" :> child;
		child:"parent" = object;
	);
);

//**
//*
//**
popchild(object,child) := (
	if (contains(object:"children",child),
		// Set parents 'sizeofchildren' property accordingly
		object:"sizeofchildren" = object:"sizeofchildren" - child:"size";
		// Remove child from parent and vice versa
		object:"children" = object:"children" -- [child]; 
		child:"parent" = nada;
	, // else
		err("Object and child are in no relation to each other.");
	);
);

// A.4 | General
//**Call a property (function) of a VAM object, with some settable parameters
//* @param object: VAM object reference
//* @param action: key of the property (String)
//* @param startmouse: used to calc "coord" for mouse starting mouse coordinates as reference point for the object on click
//* @param startcoord: used to calc "coord" for mouse starting mouse coordinates
//* @param mouse: TODO
//* @param mousedelta: TODO
//**returns: The result of the called function.
act(object, action, startmouse, startcoord, mouse, mousedelta) := (
	eval(object:action,	coord->startcoord-startmouse+mouse, 
											delta->startcoord-startmouse,
											mouse->mouse,
											startmouse->startmouse,
											startcoord->startcoord,
											mousedelta->mousedelta
	);
);

// B | Geometry
// B.0 | General Polygons

//**Generate a regular polygon with a specified number of verticies.
//* @param center: [x,y] of the center of the poly
//* @param radius: radius of the circumcircle
//* @param vertices: number of vertices
//**@returns: list of points or nada (if vertices < 3)
regularpolygon(center, radius, vertices, rotation) := (
	// Circle if no vertices, polygon otherwise
	if(vertices > 2,
		apply(
		1..vertices,
		center + radius * (
			sin(rotation + #*2*PI / vertices),
			cos(rotation + #*2*π/vertices))
		)
	)
);

//**Calculate centroid of a polygon using the geometric formula.
//* @param polygon: A list of points forming the polygon
//**@returns: [x,y] Coords of the centroid.
centroid(polygon) := (
    n = length(polygon);
    area = 0;
    cx = 0;
    cy = 0;
    
    repeat(n, i,
        j = mod(i, n) + 1;  // Next vertex (loops back to first)
        p1 = polygon_i;      // Current vertex
        p2 = polygon_j;      // Next vertex
        
        // Cross product term for area calculation
        factor = p1.x * p2.y - p2.x * p1.y;
        
        // Accumulate coordinates for centroid
        cx = cx + (p1.x + p2.x) * factor;
        cy = cy + (p1.y + p2.y) * factor;
        
        // Accumulate signed area
        area = area + factor;
    );
    
    // Complete the area calculation
    area = area/2;
    
    // Calculate final centroid coordinates
    if(abs(area) > 0.000001, // Check if area is not too close to 0
        cx = cx/(6*area);
        cy = cy/(6*area);
        [cx, cy]
    ,
        // Fallback to arithmetic mean if area is too small
        centerofmass(polygon)
    );
);

// Calculate center of mass (arithmetic mean of vertices)
centerofmass(polygon) := sum(polygon)/length(polygon);

//** Gets the bounding box of a polygon as
//** [minX, maxX, minY, maxY]
getboundingbox(poly) := (
	regional(minX, maxX, minY, maxY);
	minX = maxX = minY = maxY = nada;
	
	forall(poly,
		// Fill on first pass.
		if(isundefined(minX), minX = #_1);
		if(isundefined(maxX), maxX = #_1);
		if(isundefined(minY), minY = #_2);
		if(isundefined(maxY), maxY = #_2);
		
		// Update on subsequent passes as required.
		if(#_1 < minX, minX = #_1);
		if(#_1 > maxX, maxX = #_1);
		if(#_2 < minY, minY = #_2);
		if(#_2 > maxY, maxY = #_2);
	);
	
	// Return
	[minX, maxX, minY, maxY];
);

//** Checks if a point is inside a polygon (by ray casting)
//**
inpoly(poly, point) := (
	regional(rayStart, rayDir, edgeStart, edgeDir, 
		A, solution, numIntersections
	);
	// Fix starting point just left outside the bounding box of the poly.
	rayStart = (getboundingbox(poly)_1 - 1, point.y + exp(1));
	rayDir = point - rayStart;
	//**Start Ray left of the bounding box and at the y coordinate
	//* of the point moved up by Euler's number to minimize chance of
	//* edge cases, i.e. intersecting at a corner of the polygon.
	//**Also: Possible shortcut, if point outside bounding box.

	// Iterate over all edges and check for count intersections with ray.
	numIntersections = 0;
	repeat(length(poly),
		// If not at the last vertex get edge by looking ahead one.
		if(# != length(poly),
			edgeStart = poly_#;
			edgeDir = poly_(#+1) - poly_#;
		, // Else, consider the last and first vertex (last pass only)
			edgeStart = poly_#;
			edgeDir = poly_1 - poly_#;
		);
		
		// Check ray and edge for intersection
		A = [[rayDir_1, -edgeDir_1], [rayDir_2, -edgeDir_2]];
		solution = linearsolve(A, edgeStart - rayStart);
		
		// Count as intersection if both entries of solution are in [0,1].
		if(solution_1 >= 0 & solution_1 <= 1 &
			solution_2 >= 0 & solution_2 <= 1,
			numIntersections = numIntersections + 1;
		);
	);	

	// Return	true if odd number of intersections
	mod(numIntersections, 2) == 1;
);

// B.1 | Rectangle

//**A polygon, starting starting at coords in the bottom left going CCW.
//* @param coords: [x,y] of bottom left corner of the rectangle
//* @param width/height: width/height of rectangle
//* returns: [A,B,C,D] list of corners of the rectangle
//**
rectangle(coords, width, height) := (
	apply([(0,0),(width,0),(width,height),(0,height)],#+coords);
);

//**A rectangle width given width and height width rounded corners
//* @param coords: [x,y] of bottom left corner of the (not rounded) rectangle
//* @param width/height: width/height of (not rounded) rectangle
//* @param cornerradius: Radius with which to round the corners. Should be at maximum: min(width,height)/2
//* returns: Shape representing the rounded rectagnle
//**
roundedrectangle(coords, width, height, cornerradius) := (
	regional(lowerleft, lowerright, upperright, upperleft, 
		verticalrect, horizontalrect, shadowrect
	);
	
	// The 'normal' rectangle for reference
	shadowrect = rectangle(coords, width, height);
	
// Adjust cornerradius if to big
	if(cornerradius > min(width,height)/2, cornerradius = min(width,height)/2);

	// Create circles for rounded corners (lowerleft, ...)
	lowerleft  = circle(shadowrect_1 + [cornerradius,cornerradius]  , cornerradius);
	lowerright = circle(shadowrect_2 + [-cornerradius,cornerradius] , cornerradius);
	upperright = circle(shadowrect_3 + [-cornerradius,-cornerradius], cornerradius);
	upperleft  = circle(shadowrect_4 + [cornerradius,-cornerradius] , cornerradius);

	// Create two bounding rectangles
	verticalrect   = rectangle(
		shadowrect_1 + [cornerradius,0],
		width-2*cornerradius,
		height
	);
	verticalrect   = polygon(verticalrect);
	horizontalrect = rectangle(
		shadowrect_1 + [0,cornerradius],
		width,
		height-2*cornerradius
	);
	horizontalrect = polygon(horizontalrect);

	// Build shape and return
	lowerleft ++
		lowerright ++
		upperright ++
		upperleft ++
		verticalrect ++
		horizontalrect;
);

//**Check if a given point [x,y] is in a rectangle.
//* @param rect: [A,B,C,D] list of [x,y]-points of rectangle
//* @param point: point [x,y] to check
//**
inrectangle(rect, point) := (
	point.x >= rect_1_1 & 
	point.x <= rect_2_1 & 
	point.y <= rect_3_2 & 
	point.y >= rect_1_2;
);

//** @TODO (legacy) **//
inrectangle(rect, pos, border) := (
																pos.x > rect_1_1 - border & pos.x - border < rect_2_1
																& pos.y - border < rect_3_2 & pos.y > rect_1_2 - border;
																);
// Is that used somewhere?
rectinrectangle(rect1,rect2):=inrectangle(rect1,rect2_1) & 
															inrectangle(rect1,rect2_2) &
															inrectangle(rect1,rect2_3) &
															inrectangle(rect1,rect2_4); 
rectinrectangle(rect1,rect2,border):=inrectangle(rect1,rect2_1,border) & 
															inrectangle(rect1,rect2_2,border) &
															inrectangle(rect1,rect2_3,border) &
															inrectangle(rect1,rect2_4,border);

// B.2 | Triangle
//**Check if a given point [x,y] is in a triangle.
//* @param rect: [A,B,C] list of [x,y]-points of triangle
//* @param point: point [x,y] to check
//**
intriangle(triangle, point) := (
	if(length(triangle)==3,
		and(
			gtzero(area(triangle_1,triangle_2,point)) == gtzero(area(triangle_2,triangle_3,point)),
			gtzero(area(triangle_2,triangle_3,point)) == gtzero(area(triangle_3,triangle_1,point))
		)
	, // else
		false
	); 
);

// B.3 Other Geometry
rotate(point, angle, center) := (
	point = point - center;
	point = point * [
		[cos(angle),sin(angle)],
		[-sin(angle),cos(angle)]
	];
	point + center;
);

// C | Textboxes
// @TODO:
// - ordentlich dokumentieren
// - Prüfen ob es diese Methoden braucht
// - hier ist noch n Fehler - drawtextbos mit 4 Parametern wird zweimal definiert

//**A box with some text/number on it
//*	@param P: ...TODO
//**
drawtextbox(P,w,h,txt,color):=
(regional(size);
	r=rectangle(P,w,h);
	fillpoly(r,color->color,alpha->1);
  drawpoly(r,color->grey(.5),alpha->0.3);
	size=(round(h*screenresolution()*.8));//,round(w*screenresolution()/.8/max(1,length(txt))));
	drawtext(P+(w/2,0),txt,size->ceil(size),bold->false,align->"center",family->monofont,
	  			yoffset->ceil(size*.3)); 
	//Diese Textbox funktioniert nur in moodle und nur wenn von feedback aufgerufen NICHT
	//drawtext(P,size+" "+P+" " +txt);
); 
drawtextbox(P,h,txt,color):= (
	w=length(txt)*h*.5;
	drawtextbox(P-(w/2,0),w,h,txt,color);
);
drawtextbox(P,w,h,txt):=drawtextbox(P,w,h,txt,(1,1,.9));
drawtextbox(P,h,txt):=drawtextbox(P,h,txt,(1,1,.9));

// D | Commands
or(list)  := (regional(x);x=false;forall(list,x=x%#));
and(list) := (regional(x);x=true;forall(list,x=x&#));

//** Does some default action if something is undefined, else does something.
//* @param something: To be checked and executed if defined
//* @param default: Thing to execute, if something is undefined.
//**
ifdefined(something, default) := if(isundefined(something),default,something);

reset VAM():=();
// for dolater (see Animations)
commands = {};
commands:"reset" := reset VAM();

// E | Divomath
//**Used by divomaths SendState function to update the state
//* (if any) and set the previousAnswer variable. Use with 
//* divomathSetState(), which has to be implemented in every VAM 
//* individually, according to the VAMs specific needs.
//** @param dmcb: name of divomath callback (dmcb) function
divomathGetVarState(dmcb) := (
	regional(state);
	state = divomathSetState();
	
	// Send last answer to DM and (maybe) overwrite state
	if(!isundefined(state),
		javascript(dmcb+"("+state+")");
	,
		javascript(dmcb+"()");
	);
);

// * | Other
// *.1 | Random math
sign(x):= if(x<0,-1,if(x>0,1,0));
gtzero(x):= x>=0;
hex(int) := "0123456789ABCDEF"_(1+floor(int/16))+"0123456789ABCDEF"_(1+mod(int,16));
integer(hex) := (
	regional(len, key, result);
	len = length(hex);
	result = 0;
	repeat(len,
		key = hex_(len+1-#);
		result = result + 16^(#-1) * HEXMAP:key;
		println(# + " : " +result));
);

// Returns coords of point, when mirrored at line 
// given by an array of two points [p1,p2].
mirror(point, line) := (
	regional(a,b,c, help);
	// Find parameters of line.
	a = line_1_2 - line_2_2;
	b = line_2_1 - line_1_1;
	c = line_1_1 * line_2_2 - line_2_1 * line_1_2;
	
	// Foot of perpendicular line.
	help = -2 * (a * point_1 + b * point_2 + c) / (a^2 + b^2);
	
	// Return 
	[help * a + point_1, help * b + point_2];
);

// *.2 | Random drawing
drawmovearrow(P,dx):= (
	dy=perp(dx);
	drawall(
		[ // arrow
			[P,P+dx],
			[P,P+(dx+dy)*.3],
			[P,P+(dx-dy)*.3],
			[P+dx,P+dx+(-dx+dy)*.3],
			[P+dx,P+dx+(-dx-dy)*.3]
		],
		color->(0,0,0),
		alpha->0.5
	);
);

// *.3 | Random lists
list(thing) := (
	// Create list (behaviour depending on type of input)
	// If nada, return nada
	// If string, return char array
	// If list, return the unaltered list
	// else: Put the thing (number, object, ...) in a list
	regional(list);
	list = thing;
	if(!islist(thing),
		if(isundefined(thing),list = []);
		if(isstring(thing),
			repeat(length(thing), list = list :> thing_#);
		);
		if(!isundefined(thing) & !isstring(thing), list = [thing]);
	);
	list;
);

listor(list):=contains(list,true);

// *.4 | Random other stuff
colorsort(list):=(
	regional(slist,sub);
  list = select(list,# != false) ++ select(list, # == false);
	while(length(list)>0,
		sub=select(list,#==list_1);
		slist=slist++sub;list=list--sub;
	);
	slist;
);

hexcolor(c):=hex(255*(c_1))+hex(255*(c_2))+hex(255*(c_3)); 

colorizestring(s,c):=
if(cindyjs,
"\color{#"+hexcolor(c)+"}{\Large "+s+"}"
,
"{\color{"+hexcolor(c)+"}"+s+"}"
); // c = color in RGB, s Latex-Strng ohne $$

//err(cindyjs);
//err(hexcolor((.5,1,.5)));
//err(colorizestring("Hallo",(.5,0,1)));

tickfactor(q):= (
			//q=v/dv;//round(v/dv*100)/100;
			if(mod(q/10,10)==0,3,if(mod(q,10)==0,2,1));	
						);

transformedcolor(c):= (
	apply(c, if(colorblendmode=="sigmoid",	#^7 / (.5^7+ #^7), # ););
);
  `
  +  // CLASS: VAMobject
  `// v1
// Base "Class" for VAMobject
new VAMobject(type) := (
	regional(obj);
	obj = {
		"coord" 			: [0,0],
		"type"  		  : type,
		"ismoveable" : false,
		"copyonmove"	: false,
		"isclickable" : false,
		"getaction" 	: "move",
		"color" 			: VAMPALETTE_1
	};
	obj:"name" 			:= self():"type"+self():"coord";
	obj:"ishot" 		:= dist(self():"coord",mouse().xy) < 1;
	obj:"move"  		:= if(self():"ismoveable", self():"coord" = coord);
	obj:"moveend"		:= nada;
	obj:"clickcopy" := if(self():"copyonmove", self():"copy");
	obj:"copy"  		:= (regional(r); r = new VAMobject(my("type")));
	obj:"draw"			:= fill(
		circle(self():("coord"),1),
		color->self():"color"
	);
	obj:"click"			:= if(self():"isclickable", 
		self():"color" = apply(self():"color",|1-#|)
	);
	
	obj; // Return the VAMobject.
);
  `
  +  // CLASS: Workbench, WorkbenchElement
  `// v1
//**Class Workbench:
//* A rectengular area where objects can be stored and copied from.
//*	Copies that are dragged back to the workbench get destroyed.
//* @param coords: bottom left corner of the Workbench
//* @param width:	 width of the Workbench
//* @param height: height of the Workbench
//* @param color:	 color of the Workbench
//**
new Workbench(coords, width, height, color) := (
	regional(obj);
	obj = new VAMobject("Workbench");
	obj:"color"  	 = color;
	obj:"coord"    = coords;
	obj:"width"    = width;
	obj:"height"   = height;
	obj:"children" = []; // Fill with VAM objects.
	obj:"sizeofchildren" = 0; // sum of sizes of all children.
	obj:"align"		 = "right";
	obj:"shape"  	:= rectangle(self():"coord",self():"width",self():"height");
	obj:"ishot"	 	:= inrectangle(self():"shape", mouse());
	obj:"draw"  	:= (
		drawpoly(
			self():"shape",
			size->bordersize, 
			color->self():"color"
		);
		fillpoly(
			self():"shape", 
			color->self():"color", 
			alpha->if(self():"ishot",0.2,0.1)
		);
	);

	obj:"drawchild" := (
		regional(child);
		child = currentchild; // Use with 'eval(..., currentchild->self())'.

		if(self():"align" = "right",
			println("TO DRAW: " + child);
		, // else
		err("Only right align is implemented right now.");
		);
	);

	obj:"dropevent" := (
			if(dropobject:"type"=="WorkbenchElement" & !dropobject:"copyonmove",
 			  new animation(dropobject,"scale",dropobject:"scale",0.3,0.05,"linear", 0, true);
				//obj = obj -- [dropobject];
			);
	 );

	obj; // Return Workbench.
);

//**Class Workbench:
//* Workbench with fixed position on the left side of the screen and fixed size or size relative to screen width/height.
//* @param 		 type: "fixed" or "relative" depending if a fixed size or a relative size (in relation to the screen height/width) is preferred.
//* @param 		 size: Size of the Workbench (if type="fixed" in absolute terms, if type=" relative" in percent of screen width/size)
//* @param position: one of "left", "right", "top", "bottom"
//**
new Workbench(wbtype, size, position) := (
	if(!contains(["fixed","relative"],wbtype),
		// Raise error, if type is wrong
		err("wbtype has to be 'fixed' or 'relative'");
	, // else
		if (!contains(["left", "right", "top", "bottom"],position),
			// Raise error, if position is wrong
			err("position has to be 'left', 'right', 'top', 'bottom'");
		, //else
			// Create Workbench
				regional(obj);
				obj = new Workbench(0,0,0,DZLMCOLORDARK);
				obj:"position"	= position;
				obj:"wbtype" 		= wbtype;
				obj:"size" 			= size;

				obj:"coord" := (
					regional(coords);
					// LEFT and BOTTOM is independet of choice of 'type'
					if(contains(["left","bottom"],self():"position"),
						coords = (screenbounds()_4).xy;
					);
					
					// FIXED for RIGHT and TOP
					if(self():"wbtype" == "fixed",
						if(self():"position" == "right",
							// FIXED size on the RIGHT side
							coords = (screenbounds()_3).xy - [self():"size",0];
						);
						if(self():"position" == "top",
							// FIXED size on TOP
							coords = (screenbounds()_1).xy - [0,self():"size"];
						);
					);

					// RELATIVE for RIGHT and TOP
					if(self():"wbtype" == "relative",
						if(self():"position" == "right",
							// RELATIVE size on the RIGHT side
							coords = (screenbounds()_3).xy - [self():"size" * |screenbounds()_4_1 - screenbounds()_2_1|,0];
						);
						if(self():"position" == "top",
							// RELATIVE size on TOP
							coords = (screenbounds()_1).xy - [0,self():"size" * |screenbounds()_4_2 - screenbounds()_2_2|];
						);
					);
					coords; // Return result.
				);

				obj:"width"		:= (
					regional(width);
					if(contains(["top","bottom"],self():"position"),
						// If TOP or BOTTOM use width of entire canvas
						width = |screenbounds()_4_1 - screenbounds()_2_1|;
					, // else (LEFT or RIGHT)
						if(self():"wbtype" == "fixed",
							// If FIXED, width is equal to size field.
							width = self():"size";
						, // else (RELATIVE)
							width = self():"size" * |screenbounds()_4_1 - screenbounds()_2_1|;
						);
					);
					width; // Return result.
				);

				obj:"height"	:= (
					regional(height);
					if(contains(["left","right"],self():"position"),
						// If LEFT or RIGHT use width of entire canvas
						height = |screenbounds()_4_2 - screenbounds()_2_2|;
					, // else (TOP or BOTTOM)
						if(self():"wbtype" == "fixed",
							// If FIXED, width is equal to size field.
							height = self():"size";
						, // else (RELATIVE)
							height = self():"size" * |screenbounds()_4_2 - screenbounds()_2_2|;
						);
					);
					height; // Return result.
				);

				obj; // Return Workbench.
		);
	);
);

//**Class Workbench:
//* Basic workbench with relative layout, positioned on the left, taking 15% of the canvas.
//**
new Workbench() := new Workbench("relative", 0.15, "left");

//**Class WorkbenchElement:
//* 
//**
new WorkbenchElement(center, size, color, copyonmove, label) := (
	regional(obj);
	obj = new VAMobject("WorkbenchElement");
	obj:"coord"		 		= center;
	obj:"size"		 		= size;
	obj:"label"				= label;
	obj:"img"					= nada;
	obj:"cornerradius"= size/10;
	obj:"color"				= color;
	obj:"ismoveable"	= true;
	obj:"copyonmove"	= copyonmove;
	obj:"scale"				= 1;
	obj:"parent"			= nada; // Should be a Workbench object

	obj:"shape" := (
		// Shape consists of 2 rectangles and 4 circles for rounded corners
		rectangle(
			apply(self():"coord", (#-self():"scale"*self():"size"/2)),
			self():"scale"*self():"size",
			self():"scale"*self():"size"
		);
	);
	obj:"ishot" := inrectangle(self():"shape", mouse());
	obj:"draw" := (
		drawpoly(self():"shape", size->bordersize, color->self():"color");
		fillpoly(
			self():"shape", 
			color->self():"color", 
			alpha->if(self():"ishot",1,0.8)
		);
		drawimage(
			self():"coord",
			self():"img",
			scale->self():"scale"
		);
		drawtext(
			apply(self():"coord",
				#-self():"scale"*self():"size"/2+'bordersize
			),
			self():"label",
			size->self():"size"*7*self():"scale"
		);
	);
	obj:"clickcopy" := if(self():"copyonmove", self():"copy");
	obj:"copy"  		:= (
		regional(r);
		r = new WorkbenchElement(
			self():"coord",
			self():"size",
			self():"color",
			false,
			self():"label"
		)
	);

	obj; // Return WorkbenchElement.
);
  `
  +  // CLASS: Button
  `// v2
new Button(coord,width,height,label,fontsize) := (
	regional(obj);
	obj = new VAMobject("Button");

	obj:"coord"  = coord;
	obj:"width"  = width;
	obj:"height" = height;
	obj:"cornerradius" = (width+height) / 50;
	obj:"color"	 = dzlmcolorlight;
	obj:"bordercolor" = dzlmcolorgold;
	obj:"fontcolor" = dzlmcolordark;
	obj:"label"	 = label;
	obj:"fontsize" = if(fontsize==nada, 12, fontsize);
	obj:"ismoveable" = false;
	obj:"hasshadow" = true;
	obj:"hitbox" := rectangle(
		my("coord"),
		my("width"),
		my("height")
	);
	obj:"shape" := roundedrectangle(
		my("coord"),
		my("width"),
		my("height"),
		my("cornerradius");
	);
	obj:"draw" := (
		// Draw shadow
		if(my("hasshadow"),
			fill(roundedrectangle(
				my("coord")+[0.03,-0.05],
				my("width"),
				my("height"),
				my("cornerradius");
				),
				color->[0,0,0],
				alpha->0.2
			);
		);
		// Draw box and border
		fill(
			my("shape"),
			color->if(my("ishot"),0.95*my("color"),my("color")),
			alpha->1
		);
		draw(
			my("shape"),
			color->my("bordercolor");
		);
		// Draw Label
			drawtext(
				my("coord")+(my("width"),
				my("height")/2)/2, 
				align->"center",
				color->my("fontcolor"),
				my("label"),
				size->my("fontsize")
			);
		// Draw something after the button
		my("drawafter");
	);
	obj:"drawafter" := nada;
	obj:"ishot" := inrectangle(my("hitbox"),mouse().xy);  
  obj:"click"	:= my("script");
  obj:"script" := println("Implement obj:script"); 

	obj; // Return the button.
);

  `
  +  // CLASS: Toggle
  `// v1
new Toggle(coord,width,state,label,fontsize) := (
	regional(o);
	o = new Button(coord,width,width/2,label,fontsize);

	o:"cornerradius" = width;
	o:"state" = if(!isundefined(state),state,false);
	o:"highlightcolor" = DARKBLUE;
	
	o:"draw" := (
		// Draw box and border
		fill(
			my("shape"),
			color->if(my("state"),my("highlightcolor"),grey(0.98)),
			alpha->1
		);
		draw(
			my("shape"),
			color->grey(0.5),
			alpha->1
		);

		// Draw circle
		regional(center);
		center = my("coord")+[my("height"),my("height")] / 2,
		if(my("state"), // move circle right, if toggled
			center = center + [my("width")-my("height"),0]
		);

		fillcircle(
			center,
			1.2 * my("height") / 2,
			color->my("color");
		);

		// Draw Label
		drawtext(
			my("coord")+[my("width")*1.1,my("height")/3],
			my("label"),
			align->"left",
			color->dzlmcolordark,
			size->my("fontsize")
		);
		// Draw something after the button
		my("drawafter");
	);
	
	o:"click"	:= (
		set my("state", !my("state"));
		my("script");
	);

	o; // Return the toggle.
);

//sw = new Toggle([3,3],1,true,"Color",8);
//obj = obj :> sw;
  `
  +  // CLASS: ProgressCircle
  `// v1
new ProgressCircle(center, innersize, outersize, value, maxvalue) := (
	regional(obj);
	obj = new VAMobject("ProgressCircle");
	
	// Basic fields
	obj:"coord" = center;
	obj:"innerradius" = if(innersize==nada, 2, innersize)/2;
	obj:"outerradius" = if(outersize==nada, 3, outersize)/2;
	obj:"value" = if(value==nada, 42, value);
	obj:"maxvalue" = if(maxvalue==nada, 100, maxvalue);
	
	// Text toggles for direct access
	obj:"fontfamily" = nada;
	obj:"fontsize" = 24;
	obj:"textoffset" = 3.6;

	// Shape of the outer circular sector
	obj:"shape" := (
		regional(center, radius, circle, boundingpoly, refpoint, angle);
		
		// Build base circle
		center = my("coord");
		radius = my("outerradius");
		circle = circle(center, radius);

		// Get point on the circle with respect to current value
		angle = -2 * PI * my("value") / my("maxvalue");
		refpoint = rotate(
			center+[0,radius],
			angle, 
			center
		);
		
		// Build bounding poly to subtract from circle
		angle = abs(angle);
		boundingpoly = [
			center, // start at center of ProgressCircle
			center + [0, radius], // go up to edge
			center + [-radius, radius], // go to top left corner
			if(angle < 3/2 * PI,
				// also go to lower left corner if refpoint in Q3
				center + [-radius, -radius]
			),
			if(angle < PI,
				// also go to lower right corner if refpoint in Q4
				center + [radius, -radius]
			),
			if(angle < 1/2 * PI,
				// also go to top right corner if refpoint in Q1
				center + [radius, radius]
			),
			refpoint // go to refpoint
		];

		// Fix for CindyJS not ignoring nada Points
		boundingpoly = select(boundingpoly,!isundefined(#)); 

		circle -- polygon(boundingpoly); // Return shape.
	);

	// Look of the outer circle
	obj:"outercolor" := [
		min(0.8, 1 - my("value") / my("maxvalue")),
		min(0.9, my("value") / my("maxvalue")),
		0
	];
	obj:"outerborder" := [0,0,0];
	obj:"outerstroke" := 0;
	// Look of the inner circle
	obj:"innercolor" := [0.94,0.94,0.94];
	obj:"innerborder" := [0,0,0];
	obj:"innerstroke" := 0;

	obj:"draw" := (
		// Draw outer circluar sector
		fill(
			my("shape"),
			color -> my("outercolor")
		);
		draw(
			my("shape"),
			color -> my("outerborder"),
			size -> my("outerstroke")
		);

		// Draw inner circle
		drawcircle(
			my("coord"), 
			my("innerradius"),
			color -> my("innerborder"),
			size -> my("innerstroke")
		);
		fillcircle(
			my("coord"), 
			my("innerradius"),
			color -> my("innercolor")
		
		);
		
		// Draw text
		drawtext(
			my("coord") + [0,-my("innerradius")/my("textoffset")], 
			my("value"),
			size -> my("fontsize"),
			family -> my("fontfamily"), 
			align -> "center"
		);
	);

	obj; // Return ProgressCircle
);
  `
  +  // VAM default
  `// v1
// Dummy VAM
if(vam == "default",

// A | Documentation
'doc = "
	Das ist das Standard-VAM. Die Auswahl des 'richtigen' VAMs erfolgt über das Komponentenverhalten.
Dort muss folgende Struktur übernommen werden.
=======================================================
configuration:
  cindyJsPrefix: divomath     # nicht ändern!
  vam: <...>     # Bezeichner angeben (siehe unten)
  bgcolor:
    - <rot>     # aus [0,1], Rot-Anteil des Hintergrundes
    - <grün>     # aus [0,1], Grün-Anteil des Hintergrundes
    - <blau>     # aus [0,1], Blau-Anteil des Hintergrundes
  debuglevel: <...>     # Zahl (VAM-spezifisch, 10 zeigt Doku des VAM an).
=======================================================
Aktuell mögliche VAM-Bezeichner:
> numbercards | strapwork
";

// OVERRIDE from FW: divomath config, example usage
divomathSetState() := (
	regional(state);

	println("Calling divomathSetState from default VAM."); // debug

	state = 'dmstate; // original state (should be preserved)
	state.color = [0,1,0]; // change to green on next reload
	state.coord = [42,69]; // put "coord" value with some value in state for reasons
	state.astring = unicode("0022")+"defaultVAM"+unicode("0022"); // strings need to be enclosed in quotion marks (unicode 0x22)!

	nada; // Return state;
);

o = new VAMobject("Dummy");
o:"coord" = [4,4];
o:"ismoveable" = true;
o:"isclickable"  = true;
o:"color" = if(!isundefined('dmstate.color),
		'dmstate.color
	,
		DARKRED
);

o:"draw" := (
	fill(
		circle(my("coord"),1),
		color->my("color");
	);
	draw(my("coord"),color->[1,1,1]);
	drawtext(my("coord")+[.1,.1],my("coord"));
);

o:"click" := (
	o:"color" = [random(),random(),random()];
		
	if(!isundefined(divomathConfig),
		// Set result if in divomath
		divomathClearResult();
		divomathAddResult("centerX", my("coord")_1);
		println("Result added. centerX:" + my("coord")_1);
		divomathAddResult("centerY", my("coord")_2);
		println("Result added. centerY:" + my("coord")_2);
		divomathAddResult("center", my("coord"));
		println("Result added. center:" + my("coord"));
		divomathSendResult();

	// Debug print config
		println(divomathConfig);
	);		
);

obj = obj :> o;
'debuglevel = 10;
);
  `
  +  // VAM divisors
  `// v2
// Zahlenteiler
if(vam == "divisors", // change accordingly

// A | Documentation
'doc = "
>> Konfigurierbarer Zustand | VAM 'divisors'
color: <string> # eine repräsentierte Farbe (siehe Doku)
size: <float> # Größe der Blobs
padding: <float> # Abstand der Blobs in einem Band
timing: <float> # Geschwindigkeit der Animation
blobs: <uint> # Anzahl der Blobs zu Beginn
maxblobs: <uint> # Maximale Anzahl erlaubter Blobs
divisor: <uint> # Gruppengröße zu Beginn
maxcols: <uint> # Maximal erlaubte Gruppengröße
displaycalc: <bool> # Formel anzeigen? ('a : b')
displayresult: <bool> # Ergebnis anzeigen? ('= c Rest d')
displaydescription: <bool> # Beschreibung anzeigen?
displayblobcount: <bool> # Anzahl Blobs anzeigen?
displaydivisorcount: <bool> # Gruppengröße anzeigen?
==========================================================
>> Results | VAM 'divisors'
B I S H E R   K E I N E
";

// B | Divomath config
// States
regional (item, color, padding, timing, blobs, maxblobs, divisor, maxcols,
	sequentialorder, displaycalc, displayresult, displaydescription,
	displayblobcount, displaydivisorcount
);

// Config color of Blobs and Strips a [R,G,B] or String
item = 'dmstate.color;
if(!isundefined(item), color = apply(item,COLORMAP:#));
if(isundefined(color), color = [DIVORED, DIVOGREY]);

// Config size of Blobs
item = 'dmstate.size;
if(!isundefined(item), size = item, size = .7);
if(size < 0, size = 0.1);

// Config padding between blobs in a strip.
item = 'dmstate.padding;
if(!isundefined(item), padding = item, padding = .2);
if(padding < 0, padding = 0);

// Config timing of animations.
item = 'dmstate.timing;
if(!isundefined(item), timing = item, timing = 1);
if(timing < .0001, timing = .0001);

// Config inital blob count.
item = 'dmstate.blobs;
if(!isundefined(item), blobs = item, blobs = 0);
if(blobs < 0, blobs = 0);

// Config maximum blob count.
item = 'dmstate.maxblobs;
if(!isundefined(item), maxblobs = item, maxblobs = 100);
if(maxblobs < 0, maxblobs = 0);

// Config inital divisor.
item = 'dmstate.divisor;
if(!isundefined(item), divisor = item, divisor = 0);
if(divisor < 0, divisor = 0);

// Config maximum number of divisors (columns).
item = 'dmstate.maxcols;
if(!isundefined(item), maxcols = item, maxcols = 100);
if(maxcols < 0, maxcols = 0);

// Config how Blobs are reorderd when divisors changes
sequentialorder = 'dmstate.sequentialorder;
if(!isundefined(item), sequentialorder = item, sequentialorder = false);

// Config displaying of components
// - Calculation text
item = 'dmstate.displaycalc;
if(!isundefined(item), displaycalc = item, displaycalc = true);
// - Calculation result text
item = 'dmstate.displayresult;
if(!isundefined(item), displayresult = item, displayresult = true);
// - Calculation description text
item = 'dmstate.displaydescription;
if(!isundefined(item), displaydescription = item, displaydescription = true);
// - blob count text
item = 'dmstate.displayblobcount;
if(!isundefined(item), displayblobcount = item, displayblobcount = true);
// - divisor count text
item = 'dmstate.displaydivisorcount;
if(!isundefined(item), displaydivisorcount = item, displaydivisorcount = true);


// C | Class definitions
// C.1 | Handler for positioning and drawing
new World() := (
	regional(o, btncolors);
	o = new VAMobject("World");

	// Fields
	o:"coord" = nada;
	o:"font" = "Be Vietnam";
	o:"blobs" = [];
	o:"#blobs" := length(my("blobs"));
	o:"#allblobs" := (
		regional(numofblobs);
		numofblobs = my("#blobs");
		forall(my("strips"), numofblobs = numofblobs + #:"size");
		numofblobs;
	);
	o:"strips" = [];
	o:"#strips" := length(my("strips"));
	o:"#divisors" = 0;
	o:"shape" = reverse(apply(screenbounds(),#.xy));
	o:"center" = o:"shape"_1 + 0.5 * (o:"shape"_3 - o:"shape"_1);
	o:"padding" = padding / 2;
	
	// UI
	o:"bar" = ( // UI: Bar to change divisors
		regional(bar);
		bar = new VAMobject("Bar");
		bar:"parent" = o;
		bar:"ismoveable" = true;
		bar:"width" = 1;
		bar:"height" := (
			my("parent"):"strips"_1:"shape"_4_2 -
				my("parent"):"strips"_(-1):"shape"_1_2
		);
		bar:"padleft" = .5;
		bar:"coord" := (
			regional(c);
			c = my("parent"):"strips"_1:"shape"_2; // bottom right of 1. strip
			c = c + [my("padleft"), 0]; // adjust x
			c = [c_1, my("parent"):"strips"_(-1):"shape"_1_2]; // adjust y
		);
		bar:"alignbar" := (
			regional(c);
			c = [my("coord"), my("parent"):"strips"_(-1):"shape"_1_2];
			set my("coord", c);
		);
		bar:"shape" := (
			if(my("parent"):"#strips" > 0,
				// rectangle that is as tall as all strips combined
				rectangle(my("coord"), my("width"), my("height"));
			, // else nothing
				[[0,0],[0,0],[0,0],[0,0]];
			);
		);
		bar:"ishot" := inrectangle(my("shape"),mouse().xy);
		bar:"move" := if(my("ismoveable"),
			set my("coord", [coord_1, my("coord")_2]);

			// Decrease divisor count
			if(my("parent"):"strips"_1:"children"_(-1):"ishot",
				my("parent"):"divisor-":"script";
				my("alignbar");
			);

			// Increase divisor count
			regional(gap, requiredwidth);
			gap = my("shape")_1_1;
			gap = gap - my("parent"):"strips"_1:"shape"_2_1;
			requiredwidth = new Blob():"size";
			if(gap > requiredwidth,
				my("parent"):"divisor+":"script";
				my("alignbar");
			);
		);
		bar:"dropevent" := (
			regional(c);
			c = my("parent"):"strips"_1:"shape"_2; // bottom right of 1. strip
			c = c + [my("padleft"), 0]; // adjust x
			c = [c_1, my("parent"):"strips"_(-1):"shape"_1_2]; // adjust y
			set my("coord", c);
		);
		bar:"draw" := if(my("parent"):"#strips" > 0,
			fillpoly(my("shape"), color -> grey(0.6));
		);

		bar; // Return bar
	);
	o:"blob+" = ( // UI: Add a Blob
		regional(btn);
		btn = new Button([2.6,.5],1,1,"+",22);
		btn:"handle" = o;
		btn:"show" := my("handle"):"#allblobs" < maxblobs;
		btn:"cornerradius" = .5; // circle
		btn:"color" = DIVOBLUE;
		btn:"bordercolor" = btn:"color" / 2; // darker border
		btn:"fontcolor" = grey(1);
		btn:"script" := (
			regional(blob);
			my("handle"):"makeblob";
			blob = my("handle"):"blobs"_(-1);
			if(my("handle"):"#divisors" > 0,
				my("handle"):"moveblobstostrips"
			);
		);

		btn; // Return Button
	);
	o:"blob-" = ( // UI: Remove a Blob
		regional(btn);
		btn = new Button([1.1,.5],1,1,"-",22);
		btn:"handle" = o;
		btn:"show" := if(my("handle"):"#allblobs" > 0,true,false);
		btn:"cornerradius" = .5; // circle
		btn:"color" = DIVOBLUE;
		btn:"bordercolor" = btn:"color" / 2; // darker border
		btn:"fontcolor" = grey(1);
		btn:"script" := ( 
			// Remove last blob from last strip and reconfigure
			eval(my("handle"):"removeblob",numofblocks->1);
			if(my("handle"):"#strips" > 0,
				my("handle"):"strips"_(-1):"drawstrip" = false;
			);
			my("handle"):"removeemptystrips";
		);
		btn; // Return Button
	);
	o:"divisor+" = ( // UI: Increase divisor by 1
		regional(btn);
		btn = new Button([20,.5],1,1,"+",22);
		btn:"handle" = o;
		btn:"show" := my("handle"):"#divisors" < maxcols;
		btn:"cornerradius" = .5; // circle
		btn:"color" = DIVOBLUE;
		btn:"bordercolor" = btn:"color" / 2; // darker border
		btn:"fontcolor" = grey(1);
		btn:"script" := (
			my("handle"):"#divisors" = my("handle"):"#divisors" + 1;
			my("handle"):"refillstrips";
		);
		btn; // Return Button
	);
	o:"divisor-" = ( // UI: Decrease divisor by 1
		regional(btn);
		btn = new Button([18.5,.5],1,1,"-",22);
		btn:"handle" = o;
		btn:"show" := my("handle"):"#divisors" > 1;
		btn:"cornerradius" = .5; // circle
		btn:"color" = DIVOBLUE;
		btn:"bordercolor" = btn:"color" / 2; // darker border
		btn:"fontcolor" = grey(1);
		btn:"script" := (
			my("handle"):"#divisors" = my("handle"):"#divisors" - if(
				my("handle"):"#divisors" > 0, 1, 0
			);
			my("handle"):"refillstrips";
		);
		btn; // Return Button
	);
	o:"uielements" := [
		my("bar"),
		my("blob+"), my("blob-"),
		my("divisor+"), my("divisor-")
	];
	
	// Methods
	o:"makeblob" := (
		set my("blobs", my("blobs") :> new Blob());
		my("blobs")_(-1):"parent" = self();
	);
	o:"makestrip" := (
		set my("strips", my("strips") :> new Strip(nada));
		my("strips")_(-1):"parent" = self();
	);
	o:"removeemptystrips" := (
		set my("strips", select(my("strips"),#:"size" > 0));
	);
	
	// Draw strips and (free) blobs
	o:"draw" := (	
		forall(my("blobs"),#:"draw");
		forall(my("strips"),#:"draw");

		// Draw total blob count
		if(displayblobcount,
		drawtext([0.3,1.7],"Gesamtanzahl: " + my("#allblobs"), size->16, family->my("font"));
		);

		// Draw divisor count
		if(displaydivisorcount,
			regional(numofdivisors);
			numofdivisors = "Gruppengröße";
			numofdivisors = numofdivisors + if(
				my("#divisors") > 0, ": " + my("#divisors"), ""
			);
			drawtext([17.6,1.7],numofdivisors, size->16, family->my("font"));
		);

		// Draw calculation texts
		if(my("#divisors") > 0,
			regional(b,d,m, text, bottomleftx);
			b = my("#blobs");
			forall(my("strips"), b = b + #:"size");
			d = my("#divisors");
			m = mod(b,d);
			bottomleftx = 8.5;
			text = "";

			// - "a : b"
			if(displaycalc,
				bottomleftx = 8.5;
				text = b + " : " + d;
				drawtext([bottomleftx,1.7],
					text,
					size->16,
					bold->true,
					family->my("font")
				);
			);

			// - " = c"
			if(displayresult,
				bottomleftx = bottomleftx+.1+pixelsize(text)_1/screenresolution();
				text = " = " + floor(b/d);
				drawtext([bottomleftx,1.7],
					text,
					size->16,
					bold->true,
					family->my("font")
				);
			);
			
			// - " Rest d"
			if(displayresult & m != 0,
				bottomleftx = bottomleftx+pixelsize(text)_1/screenresolution()+.2;
				text = " Rest " + m;
				drawtext([bottomleftx,1.7],
					text,
					color->DIVORED,
					size->16,
					family->my("font")
				);
			);
			
			if(displaydescription,
				// - "c <b-er> passen in a."
				bottomleftx = 8.5;
				text = floor(b/d) + " " + VALUEMAP:d;
				text = text + if(floor(b/d) == 1, " passt ", " passen ");
				text = text + " in " + b + ".";
				drawtext([bottomleftx,1],
					text,
					size->16,
					family->my("font")
				);

				// - "Es bleiben d übrig."
				if(m != 0,
					text = "Es bleib";
					text = text + if(m == 1,"t ", "en ");
					text = text + m + " übrig.";
					drawtext(
						[bottomleftx,.3], 
						text,
						color->DIVORED,
						size->16,
						family->my("font")
					);
				);
			);
		);
	);

	o:"refillstrips" := ( // Refill Strips, when divisor count changes
		regional(div);
		div = my("#divisors");	

		if(sequentialorder, // Move Blobs along sequentially
			regional(tostrip);

			// Return blobs from all Strips to World
			forall(reverse(my("strips")),
				set my("blobs", #:"children" ++ my("blobs"));
			);

			// Remove all Strips
			set my("strips", []);

			// Refill strips
			repeat(ceil(my("#blobs")/div), // Create Strips rounding up.
				tostrip = []; // blobs that go into each Strip
				repeat(div, d, if(my("#blobs") >= d, // fill list and catch it's end
					tostrip = tostrip :> my("blobs")_d;
				));
				my("makestrip"); // make a new Strip
				eval( // put blobs in Strip
					my("putblob"),
					strip->my("strips")_(-1),
					blobs->tostrip
				);
			);
		, // Move Blobs "naturally"
			regional(spareblobs, diff);
			spareblobs = [];
			
			// Calculate if Strips shrink or grow
			if(my("#strips") != 0,
				diff = my("strips")_1:"size" - div,
				diff = -div
			);

			// Handle shrinking Strips
			if(diff > 0,
				// In all full Strips...
				forall(my("strips"), 
					if(#:"size" > div,
						// ..return overflowing Blobs to World
						set my("blobs", my("blobs") ++ #:"children"_(div+1..#:"size"));	
				
						// ...remove overflowing Blobs from Strip
						#:"children" = #:"children"_(1..div);
					);
				);

				// Fill last strip or create new one
				forall(my("blobs"),
					// Create new Strip if last one is full
					if(my("strips")_(-1):"size" >= div,
						my("makestrip");
					);
					// Put Blob in last strip
					eval(my("putblob"),strip->my("strips")_(-1),blobs->#);
				);
			);

			// Handle growing strips
			if(diff < 0,
				// Point to first and last Strip for iterating
				regional(current, last, i);
				i = 1;

				// Create a Strip if none exists
				if(my("#strips") == 0, my("makestrip"));

				// Move free Blobs to current Strips
				my("moveblobstostrips");

				current = my("strips")_i;
				last = my("strips")_(-1);

				// Move Blobs from first to current Strip until full
				while(current != last,
					diff = current:"size" - div;

					// Move to next Strip, if already full
					if(diff == 0 & my("strips")_(i+1):"size" > 0,
						i = i + 1;
						current = my("strips")_i;
						diff = current:"size" - div;
					);

					// Move one strip "up", if last one is empty
					if(last:"size" == 0, 
						my("removeemptystrips");
						last = my("strips")_(-1);
					);

					// Move Blob to current strip to fill it up
					if(diff < 0,
						eval(my("popblob"),strip->last, index->-1);
						eval(my("putblob"),strip->current,blobs->my("blobs")_(-1));
					);
				);
			);
		);

		// Toggle strip drawing for all Strips depending on if it is full or not
		forall(my("strips"),
			#:"drawstrip" = if(#:"size" == div, true, false)
		);

		// Redraw	
		my("positionstrips");
	);

	o:"moveblobstostrips" := ( // Move free Blobs to Strips
		regional(div, strip);
		div = my("#divisors");

		// Create a strip if none exist
		if(my("#strips") == 0, my("makestrip"));
		strip = my("strips")_(-1);

		// Move Blobs to Strips until none remain
		while(my("#blobs") > 0,

			// Create new Strip if current one is full
			if(strip:"size" >= div, 
				my("makestrip");
				strip = my("strips")_(-1);
			);
			
			// Move a Blob to selected Strip
			eval(my("putblob"),strip->strip,blobs->my("blobs")_1);
		);

		// Toggle strip drawing for all Strips depending on if it is full or not
		forall(my("strips"),
			#:"drawstrip" = if(#:"size" == div, true, false)
		);

		// Redraw	
		my("positionstrips");
	);

	o:"positionstrips" := ( // Align Strips in World
		regional(s, diagonal, yposition);
		s = my("strips");
		repeat(length(s),
			diagonal = s_#:"shape"_3 - s_#:"shape"_1; // bottom left to top right
			yposition = length(s)/2 - # + .5;
			s_#:"coord" = my("center") - 0.5 * diagonal; // center strips on screen
			s_#:"coord"_2 = my("center")_2 + // shift up or down
				(diagonal_2 + my("padding")) * yposition; // depending on yposition
			s_#:"positionchildren"; // reposition blobs for every strip
		);

		// Re-align last strip to be left aligned
		if(length(s) > 1,
			s_(-1):"coord" = s_(-2):"coord" - [0,diagonal_2 + my("padding")];
			s_(-1):"positionchildren";
		);
	);

	// Use with eval()
	o:"putblob" := (
		// Handles putting blobs in strips.
		// eval with a "strip" and a blob or list of "blobs".
		eval(strip:"put",children->list(blobs));
		set my("blobs", my("blobs") -- list(blobs));
	);
	
	o:"popblob" := (
		// Handles returning Blobs back to World from Strip.
		// eval with a "strip" to pop from and optional "index"
		index = if(isundefined(index),1,index);
		set my("blobs", my("blobs") :> strip:"children"_index);
		eval(strip:"remove",children->list(strip:"children"_index));
		
		my("blobs")_(-1); // Return popped Blob
	);

	o:"removeblob" := (
		// Handles deletion of Blobs.
		// eval with a number of blobs ("numofblobs") to remove.
		
		// Remove free blobs first (starting at the end of the list)
		while(numofblocks > 0 & my("#blobs") > 0,
			set my("blobs", my("blobs") -- [my("blobs")_(-1)]);
			numofblocks = numofblocks - 1;
		);

		// Continue removing from strips, starting from the last one
		forall(reverse(my("strips")), strip,
			if(numofblocks > 0,
				forall(reverse(strip:"children"),
					if(numofblocks > 0,
						strip:"children" = strip:"children" -- [#];
						numofblocks = numofblocks - 1;
					);
				);
				my("positionstrips");
			);
		);
	);	

	o; // Return World;
);

// C.2 | Blob container representing sets of divisor-many or
// remainder-many Blobs
new Strip(coord) := (
	regional(o);
	o = new VAMobject("Strip");
	
	o:"coord" = if(!isundefined(coord),coord,[6,6]); // bottom left corner
	o:"color" = color_1; // color of strip
	o:"drawstrip" = true; // draw connecting strip between children
	o:"children" = []; // contains Blobs
	o:"size" := length(my("children"));
	o:"padding" := padding; // horizontal distance between adjacent Blobs
	o:"shape" := (
		regional(width, height);
		width = if(my("size")>0,
			my("size") * (my("children")_1):"size" * 2 +
			(my("size")-1) * my("padding");
		,
			0
		);
		height = if(my("size")>0,(my("children")_1):"size" * 2,0);
		rectangle(my("coord"),width,height);
	);

	// Use with eval()
	o:"put" := (
		// Put list of elements in the strip.
		// eval children with a list of blobs or single blob
		children = list(children);
		forall(children,
			// add new parent
			#:"parent" = self();
			// add as child if not already a child of self
			if(!contains(my("children"), #),
				set my("children",my("children") :> #);
			);
			// Align children inside strip
			my("positionchildren");
		);
	);

	o:"remove" := ( 
		// Remove child or list of children from list of children of the strip.
		// eval children with a list of blobs or single blob.
		children = list(children);		
		// Reset parent of Blob to own parent (should be World) 
		forall(children, #:"parent" = my("parent"));
		// remove children from childeren-list
		set my("children", my("children") -- children);
		// recalculate new blob positions
		my("positionchildren");
	);

	o:"positionchildren" := (
		regional(children);
		children = my("children");

		// animation
		repeat(my("size"),
			new animationobject(
				children_#, //object
				"coord", // property
				children_#:"coord", // startvalue
				my("coord") + [
					(2*#-1)*children_#:"size" +
						(#-1)*my("padding"),
						children_#:"size"
				];, // endvalue
				timing, // duration
				"accel" // timeflow
			);
		);

//		// w/o animation
//		repeat(my("size"),
//			children_#:"coord" = my("coord") + [
//					(2*#-1)*children_#:"size" +
//						(#-1)*my("padding"),
//					children_#:"size"
//				];
//		);
	);

	o:"draw" := (
		// Debug: Draw bounding box
		if('debuglevel > 0, 
			drawpoly(my("shape"));
			draw(my("coord"));
		);

		// Draw strip between children
		if(my("drawstrip") & my("size") > 0,
			regional(strip, radius, delta);
			strip = my("shape");
			radius = my("children")_1:"size";
			delta = radius / 8;

			strip_1 = strip_1 + [radius,delta];
			strip_2 = strip_2 - [radius,-delta];
			strip_3 = strip_3 - [radius,delta];
			strip_4 = strip_4 + [radius,-delta];
			fillpoly(strip,alpha->0.3,color->my("color"));
		);

		// Draw children
		forall(my("children"),#:"draw");

	);
	
	o; // Return o;
);

// C.3 | Displayable element
new Blob() := (
	regional(o);
	o = new VAMobject("Blob");
	
	o:"ismoveable" = false;
	o:"size" = size;
	o:"parent" = nada;
	o:"color" := if(!isundefined(my("parent"):"drawstrip"),
			if(my("parent"):"drawstrip",color_1,color_2),
			color_2;
		);
	o:"ishot" := mouse().xy_1 - my("coord")_1 < my("size");
	o:"coord" = ( // Set coordinate randomly inside viewport
		regional(screen);
		// Get screen bounds
		screen = screenbounds();
		screen = [(screen_4).xy, (screen_2).xy]; // [lower left, upper right]
		// Make bounding box smaller by size of Blobs
		screen_1 = screen_1 + 1.2 * [o:"size",o:"size"];
		//screen_2 = screen_2 - 1.2 * [o:"size",o:"size"];
		[
			screen_1_1 + randominteger(screen_2_1 - screen_1_1),
			screen_1_2 + randominteger(screen_2_2 - screen_1_2)
		]; // Return random center point
	);

	o:"draw" := (
		// Draw to be used by parent
		fill(
			circle(my("coord"),my("size")),
			color->my("color")
		);
		
		//draw( // draw border
		//	circle(my("coord"),my("size")),
		//	color->grey(0.2),
		//	size->3.5
		//);
	);

	o; // Return blob.
);

// D | Initialization
world = new World();
obj = obj :> world;

// Template behavior
world:"#divisors" = divisor;
repeat(blobs, world:"makeblob");
if(divisor != 0,
	repeat(ceil(blobs/divisor), // Create strips rounding up.
		tostrip = []; // blobs that go into each strip
		repeat(divisor, d, if(world:"#blobs" >= d, // fill list and catch it's end
			tostrip = tostrip :> world:"blobs"_d
		));
		world:"makestrip"; // make a new strip
		eval(world:"putblob",strip->world:"strips"_(-1),blobs->tostrip); // put in blobs
	);
);

// toggle strip drawing for last blob depending on if it is full or not
if(mod(blobs,divisor) != 0,world:"strips"_(-1):"drawstrip" = false);

world:"positionstrips";

forall(world:"uielements", obj = obj :> #);
); // end vam-if
  `
  + // VAM numbercards
  `// v3
// Zahlenkarten
if(vam == "numbercards",

// A | Documentation
'doctextpos = [9,15.5];
'doc = "
>> Konfigurierbarer Zustand | VAM 'numbercards'
color: <bool> # Darstellung in Farbe? (oder Graustufen)
colortoggle: <bool> # Schalter zum Wechsel zwischen Farbe/Grau anzeigen?
alpha: <float> # Transparenz einer Karte, wenn ausgeklappt
cards: <int> # Anzahl der Karten (siehe Doku)
x: <float> # x-Koordinate der Karte
y: <float> # y-Koordinate der Karte
value: <uint> # zahlenwert der Karte
edit: <string> # Konfiguriert, welche Stellen editierbar sind (siehe Doku)
unfold: <bool> # Karte zu Beginn ausgeklappt?
separator: <char> # Trennzeichen für 3er-Gruppen von Ziffern
==========================================================
>> Results | VAM 'numbercards'
...siehe Doku
";

// B.1 | Divomath config
// States
// Config number of cards to create, default: 1
regional (numofcards, cards, item);
numofcards = if(!isundefined('dmstate.cards),max(1,'dmstate.cards),1);

// Config array of representations of numbercard parameters
// Create default numbercard objects
cards = [];
repeat(numofcards,
	cards = cards :> {};
	cards_#:"c" = [3,14];
	cards_#:"val" = 12310642;
	cards_#:"max" = 3;
	cards_#:"edit" = [false,true,true,false,true,true,true,true];
	cards_#:"unfold" = true;
);

// Configure x-locations "c"_1
item = 'dmstate.x;
item = [4,1,5,7];
item = if(!islist(item) & !isundefined(item), [item], item); // force list
repeat(min(numofcards,length(item)),
	cards_#:"c"_1 = item_#
);
println(item);
// Configure y-locations "c"_2
item = 'dmstate.y;
item = if(!islist(item) & !isundefined(item), [item], item); // force list
repeat(min(numofcards,length(item)),
	cards_#:"c"_2 = item_#
);

// Configure initial value "val"
item = 'dmstate.value;
item = if(!islist(item) & !isundefined(item), [item], item); // force list
repeat(min(numofcards,length(item)),
	cards_#:"val" = if(islist(item),item_#,item)
);
// Configure editable list "edit"
item = 'dmstate.edit;
item = if(!islist(item) & !isundefined(item), [item], item); // force list
repeat(min(numofcards,length(item)),
	cards_#:"edit" = [];
	// Loop over every character of the item-string
	// Add true/false to "edit" respectively in reverse order (-i)
	repeat(length(text(item_#)), i,
		cards_#:"edit" = cards_#:"edit" :> if(item_#_(-i)=="t",true,false);
	);
);

// Configure max value "max"
forall(cards, card, card:"max" = length(card:"edit"));

// Configure folded flag "fold"
item = 'dmstate.unfold;
item = if(!islist(item) & !isundefined(item), [item], item); // force list
repeat(min(numofcards,length(item)),
	cards_#:"fold" = item_#
);

// Configure, if placecards are colorful (true) or not (false)
item = 'dmstate.color;
monte = if(!isundefined(item), item, true);

// Configure, if montessori switch is shown, default: true
item = 'dmstate.colortoggle;
showtogglemonte = if(!isundefined(item), item, true);

// Configure fading of numbercard, default: 0.2
item = 'dmstate.alpha;
alpha = if(!isundefined(item), item, 0.2);

// Configure seperator every 3rd digit (space, dot, underscore, ...)
item = 'dmstate.separator;
separator = if(!isundefined(item), item_1, " ");

// Configure result handling and setState.
// Overwrite divomath result updating function.
divomathUpdateResults() := (
	divomathClearResult();
	
	regional(cardnr, placevaluenames);
	cardnr = 1; // for naming results of multiple cards
	placevaluenames = ["E","Z","H","T","ZT","HT","M","ZM","HM"];
	forall(if(obj_(-1):"type"=="Button",obj -- [obj_(-1)],obj), card,
		// Add number value as a whole		
		divomathAddResult("nc"+cardnr, card:"value"); // numbercard value
		if('debuglevel > 1, 
			println(">Result added: "+"nc"+cardnr + "=" + card:"value")
		);
		// Add individual place values by hand.
		// (Can't be done with children, might not have any)
		regional(remainder, digit, place);
		remainder = card:"value";
		place = 1;
		while(remainder > 0,
			digit = mod(remainder,10);
			remainder = floor(remainder/10);
			divomathAddResult("nc" + cardnr + "_" + if(
				// Use numerical indicator for numbers >10^10-1
				!isundefined(placevaluenames_place),
				placevaluenames_place,
				place
			), digit);
			if('debuglevel > 1, 
			println(">Result added: "+
				"nc" + cardnr + "_" + if(
					!isundefined(placevaluenames_place),
					placevaluenames_place,
					place) + "=" + digit
			)
		);
			place = place + 1;
		);

		// Add result, if numbercard is folded
		divomathAddResult("nc" + cardnr + "_unfolded", card:"expanded");
		if('debuglevel > 1, 
			println(">Result added: " +
				"nc" + cardnr + "_unfolded" + "=" + card:"expanded"
			)
		);

		// Go to next card, if any
		// (toggle button gets checked to, if visible)
		cardnr = cardnr + 1;
	);

	divomathSendResult();
);

// Overwrite divomath setState()
divomathSetState() := ();

// C | Class definitions
// C.1 | Placecard
new Placecard (c, initialvalue, maxplaces) := (
	regional (o);
	o = new VAMobject("placecard");	
	o:"coord" 			= c;
	o:"maxplaces"		= maxplaces;
	o:"width" 			= maxplaces;
	o:"height" 			= 1;
	o:"value" 			= initialvalue;
	o:"color" 			= MONTEGREY;
	o:"bgcolor" 		= MONTEGREY;
	o:"mix" 				= 0;
	o:"edit"				= false;
	o:"ismoveable"	= true;
	o:"downbutton"	= {"center": [-10,-10], "radius": 0};
	o:"upbutton"		= {"center": [-10,-10], "radius": 0};

	o:"ishot" := or(
		dist(my("upbutton"):"center",mouse().xy) < my("upbutton"):"radius",
		dist(my("downbutton"):"center",mouse().xy) < my("downbutton"):"radius"
	);

	o:"shape" := rectangle(
		my("coord"), 
		my("width"),
		my("height")
	);

	o:"draw" := (
		if(my("value")>0, // Draw the filled placecard
			fillpoly(
				my("shape"),
				color->(1-my("mix"))*my("bgcolor")+my("mix")*my("color")
			);
			drawpoly(
				my("shape"),
				size->1,
				color->(1-my("mix"))*my("bgcolor")+my("mix")*my("color")
			);				
			drawpoly(
				my("shape"),
				color->grey(0)
			);
			
			// Draw card text
			regional(ps);
			ps = pixelsize(
				"0",
				size->screenresolution(),
				family->schulschrift
			);

			repeat(my("maxplaces"),
				// Draw digit
				drawtext(
					my("coord") + (
						my("maxplaces") - # + .5 - 2*floor((#-1)/3)/ps_1, // adjust x
						(ps_3) / 4 / screenresolution() // adjust y
					),
					if(# == my("maxplaces"), my("value"), "0"),
					align->"center",
					size->screenresolution(),
					family->schulschrift
				);
				// Draw seperator
				if(mod(#,3) == 0 & # < my("maxplaces"),
					drawtext(
						my("coord") + (
							my("maxplaces") - # - .15, // adjust x
							(ps_3) / 4 / screenresolution() // adjust y
						),
						separator,
						align->"center",
						size->screenresolution(),
						family->schulschrift
					);
				);
			);
		, // else draw empty rectangle
			drawpoly(
				my("shape"),
				size->1,
				color->(1-my("mix"))*my("bgcolor")+my("mix")*my("color")
			);			
			drawpoly(my("shape"),
				size->2,
				color->MONTEPALETTE_(mod(1-my("maxplaces"),3) + 1))
		);

		// Draw + and - buttons
		regional(circ);
		if(my("edit"),
			if(my("value") < 9, // can become more
				
				// Create upbutton
				self():"upbutton" = {
					"center": my("coord") + [
						my("width") + 2*my("height"),
						my("height")/2
					],
					"radius": my("height")/2
				};
				circ = my("upbutton");

				// Draw upbutton
				fillcircle(circ:"center",circ:"radius", color->DIVOBLUE);
				drawtext(
					circ:"center"-[circ:"radius",circ:"radius"]+[.54,.1],
					"+",
					color->MONTEGREY,
					size->screenresolution(),
					align->"center"
				);
			, // inner else
				self():"upbutton" = {"center": [-10,-10], "radius": 0};;
			);

			if(my("value")>0, // can become less

				// Create downbutton
				self():"downbutton" = {
					"center": my("coord") + [
						my("width") + my("height") - 0.2,
						my("height")/2
					],
					"radius": my("height")/2
				};
				circ = my("downbutton");

				// Draw downbutton
				fillcircle(circ:"center",circ:"radius", color->DIVOBLUE);
				drawtext(
					circ:"center"-[circ:"radius",circ:"radius"]+[.54,.22],
					"-",
					color->MONTEGREY,
					size->screenresolution(),
					align->"center"
				);
			, // inner else
				self():"downbutton"={"center": [-10,-10], "radius": 0};;
			);
		);

		// Debug Draw
		if('debuglevel > 0,
			draw(my("shape"));
			draw(my("coord"));
		);
	);

	o:"click" := (
		if(dist(my("downbutton"):"center",mouse().xy) < my("downbutton"):"radius",
			self():"value" = my("value") - 1;
			my("parent"):"value" = my("parent"):"value"-10^(my("maxplaces")-1)
		);	
		if(dist(my("upbutton"):"center",mouse().xy) < my("upbutton"):"radius",
			self():"value" = my("value") + 1;
			my("parent"):"value" = my("parent"):"value"+10^(my("maxplaces")-1)
		);
	);

	o; // Return placecard.
);

// C.2 | Numbercard
new Numbercard (c,initialvalue, maxplaces, editable) := (
	regional (o);
	o = new VAMobject("numbercard");
	o:"coord" 			= c;
	o:"maxplaces" 	= maxplaces;
	o:"width" 			= maxplaces;
	o:"height" 			= 1;
	o:"editable"		= editable; // bool array of editable placecards
	o:"value" 			= initialvalue;
	o:"expanded" 		= false;
	o:"children" 		= [];
	o:"alpha" 			= 1;
	o:"offset"			= 1;
	o:"fadetime" 		= 3/5;
	o:"foldtime" 		= 5/5;
	o:"color" 			= MONTEGREY;
	o:"fadealpha"		= alpha;
	o:"ismoveable" 	= true;
	o:"montessori" 	= monte;

	o:"hitbox" := rectangle(
		my("coord") - 2*(1.4,0),
		2*1.4 + my("maxplaces"), 
		my("height")
	);

	o:"ishot" := or(
		inrectangle(my("hitbox"),	mouse().xy),
		listor(apply(my("children"),#:"ishot"));
	);

	o:"shape" := rectangle(
		my("coord"),
		my("width"),
		my("height")
	);

	o:"draw":= (
		regional(value, dodraw, ps);

		// Draw the card
		fillpoly(
			my("shape"),
			color->my("color"),
			alpha->my("alpha")
		);
		drawpoly(
			my("shape"),
			size->2,
			color->grey(0),
			alpha->my("alpha")
		);

		// Draw the value
		value = my("value");
		dodraw = true;
		ps = pixelsize(
			"0",
			size->screenresolution(),
			family->schulschrift
		);
		repeat(my("maxplaces"),
			if(dodraw,
				drawtext(
					my("coord") + (
						my("maxplaces") - # + .5 - 2*floor((#-1)/3)/ps_1,
						(ps_3)/4/screenresolution()
					),
					mod(value,10),
					align->"center",
					size->screenresolution(),
					family->schulschrift,
					alpha->my("alpha")
				);
				// Draw seperator
				if(mod(#,3) == 0 & # < my("maxplaces"),
					drawtext(
						my("coord") + (
							my("maxplaces") - # - .15, // adjust x
							(ps_3) / 4 / screenresolution() // adjust y
						),
						separator,
						align->"center",
						size->screenresolution(),
						family->schulschrift
					);
				);
			);
			value = floor(value/10);
			dodraw = (value>0);
		);

		// Unfold Button
		regional(rect, size, rectcol, barcol, offset);
		offset = (1.4,0);
		rect = roundedrectangle(self():"coord"-offset, 1, self():"height",.1);
		size = 2;
		rectcolor = DIVOBLUE;
		barcol = MONTEGREY;

		draw(rect, color->rectcolor, size->size);
		fill(rect, color->rectcolor);
		repeat(if(my("expanded"),1,4),
			fillpoly(rectangle(
				(self():"coord")+(-offset_1-0.1+.2*#,-.05+.2*(5-#)),
				(5-#)*.2,.1
			), 
			color->barcol);
		);
		forall(my("children"), #:"draw");

		// Color Button
		regional(rect);
		rect = roundedrectangle(self():"coord"-2*offset, 1, self():"height",.1);
		
		if(my("montessori"), // Colorful button
			regional(circ0, circ1, circ2);
			circ0 = circle(self():"coord"-2*offset+[1,0], 2);
			circ1 = circle(self():"coord"-2*offset+[1,0], 1);
			circ2 = circle(self():"coord"-2*offset+[1,0], .5);
			fill(rect~~circ0, color->MONTEBLUE);
			fill(rect~~circ1, color->MONTERED);
			fill(rect~~circ2, color->MONTEGREEN);
		, // WHITE BUTTON
			fill(rect, color->MONTEGREY);
		);
		draw(rect, color->DIVOBLUE, size->size);

		// DEBUG DRAW
		if('debuglevel > 0,
			drawpoly(my("hitbox"));
			draw(my("hitbox")_1,color->[1,0,0]);
			draw(my("coord"));
		);
	);

	o:"move" := if(self():"ismoveable", self():"coord" = coord);
	
	o:"active" := inrectangle( // If condition in self():"click"
		rectangle(
			my("coord") - (1.4,0), 
			2 + my("maxplaces"),
			my("height")
		), 
		mouse().xy
	);

	o:"colortoggle" := (
		regional(offset);
		offset = (1.4,0);
		inrectangle(
			rectangle(self():"coord"-2*offset, 1, self():"height"),
			mouse().xy
		);
	);

	o:"click" := (
		if(my("active"), // Fold / Unfold action
			regional(children,pc,offset,fadetime,foldtime);
			fadetime=my("fadetime");
			foldtime=my("foldtime");
			children=[];
			self():"expanded" =
				if(my("expanded"),
					new animationobjectwithdelay(
						self(),
						"alpha",
						my("fadealpha"),
						1,
						fadetime,
						if(my("showalways"),"accel","jump"),
						foldtime
					);
					setpropertylater(
						self(),
						"children",
						[],
						fadetime + foldtime
					);
					forall(my("children"), child,
						child:"edit"=false;
						new animationobject(
							child,
							"coord",
							child:"coord",
							my("coord")+(my("maxplaces")-child:"maxplaces",0),
							foldtime,
							"accel"
						);
						new animationobjectwithdelay(
							child,
							"mix",
							1,
							0,
							fadetime,
							"accel",
							foldtime
						);
					);
					false // set my("expanded")
				, // else to if(my("expanded"))
					regional(val);
					val = my("value");
					repeat(my("maxplaces"), place,
						if(true % val>0 % place==1, 
						// create a card every time to allow for null-slots
							offset = (
								my("maxplaces")-place,
								1.2*(place-my("offset")-my("maxplaces"))
							);
							pc = new Placecard(
								my("coord") + (my("maxplaces")-place,0),
								mod(val,10),place
							);
							pc:"parent" = self();
							pc:"color" = if(my("montessori"), // colorful
								MONTEPALETTE_(mod(my("maxplaces")-place-1,3) + 1)
							, // else grey
								MONTEGREY
							);
							new animationobjectwithdelay(
								pc,
								"coord",
								my("coord")+(my("maxplaces")-place,0),
								my("coord")+offset,
								foldtime,
								"accel",
								fadetime
							);
							new animationobject(
								pc,
								"mix",
								0,
								1,
								fadetime,
								"accel"
							);
							setpropertylater(
								pc,
								"edit",
								my("editable")_place,
								foldtime+foldtime
							);
							children = [pc] ++ children
						); // end if
						val = floor(val/10);
					); // end repeat
					new animationobjectwithdelay(
						self(),
						"alpha",
						1,
						my("fadealpha"),
						foldtime,
						"accel",
						fadetime
					);
			  	self():"children" = children;
					true; // set my("expanded")
				); // end if(my("expanded")) ~100 lines earlier.
			); // end "active"-if

			// Check if Color-Button has been clicked
			if(my("colortoggle"),
				// Toggle montessori flag
				self():"montessori" = !self():"montessori";
				// Change color attribute of children accordingly
				forall(my("children"),
					#:"color" = if(my("montessori"), // colorful
						MONTEPALETTE_(mod(2-#:"maxplaces",3) + 1)
					, // else grey
						MONTEGREY
					);
				);
			);

			// handle click on children
			forall(my("children"), if(#:"ishot", #:"click"));
	);

	o:"getaction" := (
		action = if( // condition
			inrectangle(
				rectangle(
					my("coord")-(2,0),
					2+my("maxplaces"),
					my("height")
				), 
				mouse().xy;
			)
		, // if body
			"move"
		, // else body
			"adjust"
		); 
	);
	
	o; // Return numbercard.
);

// D | Initialization
// Init numbercards
forall(cards, card,
	thing = new Numbercard( // Create card based on configured array.
		card:"c",
		card:"val",
		card:"max",
		card:"edit"
	);
	
	// Unfold card according to configuration.
	if(card:"unfold", // card is supposed to be displayed unfolded
		// @TODO: Refactor, code basically identical to parts of "click".
		regional(val, offset);
		val = thing:"value";
		repeat(thing:"maxplaces", place,
			offset = (
				thing:"maxplaces"-place,
				1.2*(place-thing:"offset"-thing:"maxplaces")
			);
			pc = new Placecard(
				thing:"coord" + (thing:"maxplaces"-place,0),
				mod(val,10),place
			);
			pc:"parent" = thing;
			pc:"color" = if(thing:"montessori", // colorful
				MONTEPALETTE_(mod(thing:"maxplaces"-place-1,3) + 1)
			, // else grey
				grey(.95)
			);
			pc:"coord" = thing:"coord"+offset;
			pc:"mix" = 1;
			pc:"edit" = thing:"editable"_place;
			children = [pc] ++ children;
			val = floor(val/10);
		); // end repeat
		thing:"alpha" = thing:"fadealpha";
		thing:"children" = children;
		thing:"expanded" = true;
	); 
	obj = obj :> thing; // Add card to obj list.
);

); // End VAM-if
  `
  + // VAM strapwork
  `// v2
// Parkettierung / Bandornamente
if(vam == "strapwork",
// A | Documentation
'doc = "
	@TODO
";

// local constants
regional(shapemap, colormap);
SHAPEMAP = { // Maps shape names (use k+"gon" for k>8)
	"0":"circle", "3":"triangle", "4":"square", "5":"pentagon",
	"6":"hexagon", "7":"heptagon", "8":"octagon"
};
COLORMAP = {
	"1":"blue", "2":"red", "3":"green",
	"4":"violet", "5":"grey", "6":"black"
};

// B | Divomath config
// States
regional (item, row, size, drawborders, drawseparator, 
	numofpolys, vertices, polys, colors, limit
);

// Config number of Containers
item = 'dmstate.rows;
if(!isundefined(item), rows = item, rows = 1);

// Config limit of Container
item = 'dmstate.limit;
if(!isundefined(item),
	if(islist(item), limit = item);
	if(isinteger(item),
		repeat(rows, limit = limit :> item);
	);
);
if(isundefined(item), limit = [-1]); // default
// If rows is specified and limit array is longer, strip last entries.
if(!isundefined('dmstate.rows) & rows < length(limit),
	limit = limit_(1..rows)
);

// Config general size (@Todo: not properly implemented yet, only for Workbench)
item = 'dmstate.size;
if(!isundefined(item), size = item, size = 1);

// Config drawing of borders of polys
item = 'dmstate.borders;
if(!isundefined(item), drawborders = item, drawborders = false);

// Config drawing of containers "rootseparator"
item = 'dmstate.drawseparator;
if(!isundefined(item), drawseparator = item, drawseparator = true);

// Configure number of polys or list of number of vertices
item = 'dmstate.polys;
vertices = [];
if(!isundefined(item),
	if(islist(item), vertices = item);
	if(isinteger(item),
		repeat(item, vertices = vertices :> (#+1));
	);
);
if(isundefined(item), vertices = [0,3,4]); // default
numofpolys = length(vertices);

// Configure colors of the polygons
item = 'dmstate.polycolors;
if(!isundefined(item),
	if(islist(item), colors = item);
	if(isinteger(item),
		repeat(item, colors = colors :> #+1);
	);
);
if(isundefined(item), colors = 1..numofpolys); // default

// Configure result handling and setState.
// Overwrite divomath result updating function.
divomathUpdateResults() := (
	divomathClearResult();

	regional(containers, shape, color, index);
	// Get all Containers from obj.
	containers = [];
	forall(obj, if(#:"type" == "Container", containers = containers :> #));
	// 
	forall(containers, c, // Post name of each RegPoly of Container as state
		index = 1;
		forall(c:"children",
			divomathAddResult(
				"#" + c:"cid" + "_gap" + index, // Key
				#:"name" // Value ("form"_"farbe")
			); // numbercard value
			if('debuglevel > 1, 
				println(">Result added: #" + c:"cid" + "_gap" + index + " = " + #:"name")
			);
			index = index + 1;
		);
	);

	divomathSendResult();
);

// Overwrite divomath setState()
divomathSetState() := ();

// C | Class definitions
// C.1 | Regular Polygon
new RegPoly(center,radius,vertices,rotation,palettecolor):= ( 
	regional(o);
	o = new VAMobject("regpoly");
	o:"name"				= ( // Name or posting to divomath
		if(vertices < 9, SHAPEMAP:vertices, vertices + "gon") + // name of shape
		"_" + 
		COLORMAP:palettecolor; // generic name of color ("blue", "red", ...)
	);
	o:"coord" 			= center;
	o:"radius" 			= radius;
	o:"vertices"		= if(vertices < 3, 0, vertices);
	o:"rotation"		= rotation;
	o:"ismoveable" 	= true;
	o:"copyonmove"	= false;
	o:"parent" 			= nada; // should be a Workbench or Container
	o:"clones"			= []; // copies of original thing
	o:"colorkey"		= palettecolor;
	o:"color" 			= DIVOPALETTE_(mod(palettecolor-1,	length(DIVOPALETTE)) + 1);

	o:"shape" := ( // Circle if not at least 3 vertices
		if(my("vertices") < 3,
			circle(my("coord"),my("radius"))
		, // else polygon (as list, not shape)
			regularpolygon(
				my("coord"), // center
				my("radius"), // radius
				my("vertices"), // vertices
				my("rotation") // rotation
			);
		);
	);

	o:"draw" := (
		regional(shape);
		shape=my("shape");

		if(islist(shape), // shape is polygon
			fillpoly(shape,color->my("color"));
			if(drawborders,drawpoly(shape,color->grey(0),size->bordersize));
		, // else shape is circle
			fill(shape,color->my("color"));
			if(drawborders,draw(shape,color->grey(0),size->bordersize));
		);

		// Debug
		if('debuglevel > 0, draw(my("coord")));
	);

	o:"ishot" := (
		regional(shape);
		shape=my("shape");

		if(islist(shape), // shape is polygon
			inpoly(shape,mouse().xy);
		, // else shape is circle
			dist(my("coord"),mouse().xy) <= my("radius");
		);
	);

	o:"copy" := (
		regional(copy);
		copy = new RegPoly(
			my("coord"),
			my("radius"),
			my("vertices"),
			my("rotation"),
			my("colorkey");
		);
		
		// Handle clones
		self():"clones" = my("clones") :> copy;
		copy:"clones" = nada; // copies cannot have clones
		copy:"cloneof" = self(); // remember original RegPoly

		copy; // Return copy of RegPoly
	);
	
	o:"moveend" := ( // Handle dropped RegPolys
		// Handle drop on Container
		regional(droptargets,droptarget);
		droptargets = select(
			select(
				obj,
				i,
				i:"type" == "Container"
			),
			#:"ishot"
		);
		droptarget = if(length(droptargets)>0,droptargets_1);
		if(my("parent") != droptarget,
			// chip must be removed from parent
			eval(my("parent"):"remove",child->self());
			self():"parent"=NADA;
		);
		eval(droptarget:"dropped",dropobject->self());

		if(isundefined(my("parent")),obj = obj -- [obj_(-1)]);
	);
	o; // Return the RegPoly
);

// Separator for RegPolys inside a Container
new Separator (parent, coords, radius, height) := (
	regional(o);
	o = new VAMobject("Separator");
	o:"parent"			= parent;
	o:"coord" 			= coords;
	o:"radius" 			= radius;
	o:"todraw"			:= if(!isundefined(my("parent"):"parent"),false, drawseparator);
	o:"height"			= height;
	o:"ismoveable" 	= true;
	o:"copyonmove"	= true;
	o:"clones"			= [];
	o:"hitbox"			:= rectangle(
		my("coord") - [my("radius"),my("radius")],
		2 * my("radius"),
		my("height") + my("radius")
	);

	o:"ishot" := (
		inrectangle(my("hitbox"), mouse())
	);

	o:"draw" := if(my("todraw"),
		// Draw circle around "coord"
		fillcircle(
			my("coord"),
			my("radius"),
			color->grey(0.3)
		);

		// Draw vertical line along the left edge of parent Container
		draw([
				my("coord"), 
				my("coord") + [0,my("height")]
			],
			color->grey(0.3),
			size->5
		);

		// Debug
		if('debuglevel > 0, draw(my("coord")));
	);

	o:"copy" := if(my("ismoveable"),
		regional(copy); 
		copy = new Separator(
			nada,
			my("coord"),
			my("radius"),
			my("height")
		);
		copy:"copyonmove" = false;

		// Handle clones
		self():"clones" = my("clones") :> copy;
		copy:"clones" = nada; // copies cannot have clones
		copy:"cloneof" = self(); // remember original Separator

		copy; // Return copy.
	);
	o:"moveend" := if(my("ismoveable"), // Handle dropped Separators
		regional(wb);
		wb = my("cloneof"):"parent";
		// Handle removing of RegPolys
		if( // is a clone AND gets dropped on workbench
			!isundefined(my("cloneof")) & 
			inrectangle(wb:"shape", my("coord"))
		, // then remove Element
			newanimation(
				self(),
				"radius",
				my("radius"),
				0,
				0.15,
				"accel",
				0,
				true
			);
		);
	
		// Handle drop on Container
		// @TODO: Copied from RegPoly, works, but needs checking
		regional(droptargets,droptarget);
		droptargets = select(
			select(
				obj,
				i,
				i:"type" == "Container"
			),
			#:"ishot"
		);
		droptarget = if(length(droptargets)>0,droptargets_1);
		if(my("parent") != droptarget,
			// chip must be removed from parent
			eval(my("parent"):"remove",child->self());
			self():"parent"=NADA;
		);
		eval(droptarget:"dropped",dropobject->self());
	);

	o; // Return Separator
);

// Container to hold RegPolys and Separators
new Container(center, height, limit) := (
	regional(o);
	o = new VAMobject("Container");
	o:"cid"					= nada;
	o:"coord"				= center;
	o:"parent"			= nada;
	o:"limit"				= if(!isundefined(limit),limit,-1);
	o:"timing"			= .2;
	o:"padding"			= .2;
	o:"height"			= 2*height + 2*o:"padding";
	o:"width"			:= if(my("limit") < 0,
		my("height") * (length(my("children")) + .5),
		my("height") * (my("limit") + .5);
	);
	o:"color"			= dzlmcolorlight;
	o:"children"	= [];
	o:"rootseparator" := new Separator(
		self(),
		my("coord") - [0, my("height")/2 ], // lower left corner of Container
		0.25,
		my("height")
	);

	o:"ismoveable"	= true;
	o:"shape" := rectangle(
		my("coord") - (0, my("height"))/2,
		my("width"),
		my("height")
	);
	o:"ishot" := inrectangle(my("shape"),mouse().xy);
	o:"draw" := (
		// Fill rectangle
		fillpoly(
			my("shape"),
			color->my("color")
		);

		// Draw Separator
		my("rootseparator"):"draw";

		// Draw children
		forall(my("children"), child, child:"draw");
	
		// Debug: Draw container id (cid)
		if('debuglevel > 0,drawtext(my("coord")+[0.3,0],my("cid")));
		if('debuglevel > 0, draw(my("coord")));
);
	
	o:"move" := (
		regional(delta);
		delta = coord-my("coord");
		
		if(self():"ismoveable",
			self():"coord" = coord
		);

		// Move children
		forall(my("children"), 
			eval(#:"move",coord->(#:"coord"+delta))
		)
	);

	// eval with RegPoly (or other) as "dropobject"
	o:"dropped" := (
		local(position,oldpos,index);
		
		// Find position, where to insert dropobject
		position = min( // position at which to insert object
			length(my("children")) + if(dropobject:"parent"==self(),0,1),
			round(((mouse.xy-my("coord"))/my("height"))_1+.5)
		);

		// 1: If container is already parent of thing
		if(dropobject:"parent"==self(),
			
			// Find previous position of dropobject
			index=0;
			forall(my("children"),
				index = index + 1;
				if(#==dropobject, oldpos = index)
			);
	
			// 1.1: IF dropobject gets dragged to the right
			if(oldpos <= position,

				// Animate children to the left to fill gap
				forall(oldpos+1..position,
					new animationobjectwithdelay(
						my("children")_#,
						"coord",
						(my("children")_#):"coord",
						(my("children")_#):"coord"-(my("height")-my("padding"), 0),
						my("timing"),
						"accel",
						(#-1-oldpos)/10
					)
				);

				// Animate dropobject to correct position
				new animationobjectwithdelay(
					dropobject,
					"coord",
					dropobject:"coord",
					my("coord") +
					(my("height")/2,0) +
					(my("height")-my("padding"),0) * (position-1),
					.2,
					"accel",
					(position-oldpos)/10
				);

				// Build new children array
				self():"children" = my("children")_(1..(oldpos-1)) ++ // up to old position
					my("children")_((oldpos+1)..position) ++ // old position to new position
					[dropobject] ++ // dragged thing at new position
					my("children")_((position+1)..length(my("children"))); // rest

			,	// 1.2: ELSE dropobject gets dragged to the left

				// Animate children to the right to fill gap
				forall((position)..(oldpos-1),
					new animationobjectwithdelay(
						my("children")_#,
						"coord",
						(my("children")_#):"coord",
						(my("children")_#):"coord" + (my("height")-my("padding"),0),
						.2,
						"accel",
						(oldpos-1-#)/10
					)
				);
				
				// Animate dropobject to correct position
				new animationobjectwithdelay(
					dropobject,
					"coord",
					dropobject:"coord",
					my("coord") +
					(my("height")/2,0) +
					(my("height"),0) * (position-1),
					.2,
					"accel",
					(oldpos-position)/10
				);

				// Build new children array
				self():"children" = my("children")_(1..(position-1)) ++ 
					[dropobject] ++ my("children")_(position..(oldpos-1)) ++  
					my("children")_((oldpos+1)..length(my("children")));
			); // END 1.1/1.2

		, // 1.ELSE: Container is not already parent of dropped thing

			// Animate children to the right to make a gap
			forall(position..length(my("children")),
				new animationobjectwithdelay(
					my("children")_#,
					"coord",
					(my("children")_#):"coord",
					(my("children")_#):"coord"+(my("height")-my("padding"),0),
					.2,
					"accel",
					(length(my("children"))-#)/10
				)
			);

			// Animate dropobject to correct position
			new animationobjectwithdelay(
				dropobject,
				"coord",
				dropobject:"coord",
				my("coord") +
				(my("height")/2,0) +
				(my("height")-my("padding"),0) * (position-1),
				.2,
				"accel",
				(length(my("children"))-position+1)/10
			);

			// Build new children array
			self():"children" = my("children")_(1..position-1) ++ 
				[dropobject] ++  
				my("children")_(position..length(my("children")));
			dropobject:"parent"= self();
			
			// Remove last element at size limit of container
			if(length(my("children")) > my("limit") & my("limit") > -1,
				// Animate last child to the right
				new animationobject(
				my("children")_(-1), //object
				"coord", // property
				my("children")_(-1):"coord", // startvalue
				my("children")_(-1):"coord" + [my("height"),0];, // endvalue
				.2, // duration
				"accel" // timeflow
				);

				// Remove
				setpropertylater(
					self(), // object
					"children", // property
					my("children") -- [my("children")_(-1)], // value
					.2 //delay
				);
			);
			
			// Remove dropped object from obj list (gets drawn by parent)
			obj = obj -- [dropobject];
		); // End if 1
	);

	o:"clickcopy" := (
			regional(chips);
			chips = select(
				my("children"),
				c,
				eval(c:"ishot",mouse->mouse)
			); 
		if (length(chips)==0,self(),chips_1);
	);

	o:"remove" := (
		regional(moveit,delay);
		moveit = false;
		delay = 0;
		forall(my("children"), c,
			if(moveit,
				new animationobjectwithdelay(
					c,
					"coord",
					c:"coord",
					(c:"coord")-(my("height"),0),
					.2,
					"accel",
					delay/10
				)
			);
			delay = delay + 1;
			moveit = moveit % (c==child));	
			self():"children" = my("children") -- [child];
	);

	o; // Return Container
);

// Container that holds RegPolycontainers for mutlilinedisplay
new Supercontainer() := (
	regional(o);
	o = new VAMobject("Supercontainer");
	o:"color" = DZLMCOLORLIGHT;
	o:"children" = []; // should be container
	o:"coord" = [3,8];
	o:"width" := (
		regional(width);
		width = 0;
		forall(my("children"), width = max(width,#:"width"));
		width;
	);
	o:"height" := (
		regional(height);
		height = 0;
		forall(my("children"), height = height + #:"height");
		height;
	);
	o:"rootseparator" = (
		regional(sep);
		sep = new Separator(o,o:"coord",0.25,o:"height");
		sep:"ismoveable" = false; // moving not part of specification
		sep;
	);
	o:"resetbutton" = (
		regional(btn);		
		btn = new Button(o:"coord" - [1.5,0.5], 1,1, unicode("21BA"), 26);
		btn:"handle" = o;
		btn:"cornerradius" = 1;
		btn:"color" = DARKBLUE;
		btn:"bordercolor" = DARKBLUE;
		btn:"fontcolor" = grey(1);
		btn:"script" := (
			// Reset initial Container config (empty Containers for now @Todo)
			forall(my("handle"):"children", #:"children" = []);
		);
		btn;
	);
	o:"shape" := rectangle(
		my("coord"), my("width"), my("height"));
	o:"draw" := (
		//fillpoly(my("shape"), color -> my("color"));
		drawpoly(my("shape"),color->grey(0));
	);
	o:"addchild" := ( // eval with Container as "child"
		// Set coordinates
		child:"coord" = my("coord") + [0,child:"height"/2] + [0,my("height")];
		child:"parent" = self();
		child:"ismoveable" = false;
		set my("children", my("children") :> child);
	);

	o; // Return Multicontainer.
);

// D | Initialization
// Init Container and Supercontainer
regional(cid, super);
cid = 1; // ID for uniquely identifying Container (used for divomathUpdate)

super = new Supercontainer();
repeat(rows, // fill with Containers
	eval(super:"addchild", child -> new Container(nada,size,limit_#));
	super:"children"_(-1):"cid" = cid;
	cid = cid + 1;
);

super:"rootseparator":"height" = super:"height";

// Init polys
regional(polys);
polys = []; // List of all polys
repeat(numofpolys,
	polys = polys :> new RegPoly(nada, size, vertices_#, PI/4, colors_#);
);

// Init workbench based on number of polys and workbench separator
regional(padding, wbwidth, wbheight, wb);
padding = .2;
wbwidth = size * 2 * numofpolys + padding * (numofpolys+1);
wbheight = size * 2 + padding * 2; // padding
wb = new Workbench([0,0], wbwidth, wbheight, DZLMCOLORDARK);

// Configure all polys and Workbench
index = 1;
apply(polys,
	#:"parent" = wb; 
	wb:"children" = wb:"children" :> #;
	#:"copyonmove" = true;
	#:"coord" = #:"parent":"coord" + 
		[0,1] * (#:"radius" + padding) +
		[index,0] * padding +
		[2*index-1,0]*#:"radius";
	index = index + 1;
);
wb:"isclickable" = false;
wb:"ishot" = false;

// Draw
obj = obj :> super;
obj = obj ++ super:"children";
obj = obj :> super:"rootseparator";
obj = obj :> super:"resetbutton";
obj = obj :> wb;
obj = obj :> template;
obj = obj ++ polys;
);
  `
  + // .debugging
  `// v1
// Debug print divomath details
if('debuglevel > 9 & false,
	println("=============DIVOMATH SETTINGS=============");
	println("divomath base object: " + divomathConfig);
	println("Screenbounds: " + screenbounds());
	println("Config: " + 'dmconf);
	println("State: " + 'dmstate);
	println("Prev Answer: " + 'dmprevans);
	println("bgcolor: " + 'bgcolor);
	println("debuglevel: " + 'debuglevel);
	println("isVIEWER?: " + 'dmisviewer);
	println("-------------------------------------------");
	divomathSetState(); // Prints warning, if function is not overwritten
	println("===========================================");
);
  `,
  mousedown: `// v1
mousedown = !mousedown;
mousepressedtime=seconds();

// Finde alle Elemente, die beweglich sind, wenn die Maus an der aktuellen Stelle ist (mouse().xy)
hotlist = select(obj,eval(#:"ishot",coord->mouse().xy));

// auch Typeorder fürs anklicken beachten
hotlist = flatten(apply(typeorder,to,select(hotlist,o,o:"type"==to)))
					++select(hotlist,o,not(contains(typeorder,o:"type")));

//err(sum(apply(hotlist,#:"name"+" ")));	

if(!isundefined(oldaction), 
	hotlist = [oldaction];
);

//err(apply(hotlist,#:"info"));

// Wenn es ein Element in der Hotlist gibt, dann finde die relative Distanz zwischen Referenzpunkt und Maus.
if(length(hotlist)>0,
		hot = hotlist_(length(hotlist));
    startmouse = mouse().xy;
    oldmouse = mouse().xy;
		//err("pressed:"+hot:"name");

    clickcopy = hot:"clickcopy";
		if(not(isundefined(clickcopy)),
				//clickcopy:"clickcopy"=NADA;
				obj = obj :> clickcopy;
        hot=clickcopy;
		);
	
    startcoord = hot:"coord";
	  localcoord = startmouse - hot:"coord";

		action=eval(hot:"getaction",coord->startmouse, delta->localcoord, mouse -> mouse().xy);

		//err("pressed:"+action);//err(hot:"moveable");

		obj = (obj -- [hot])++ [hot];
		// dieses Movetofront geht so nicht, zerstört andere Stellen, die 
		// mit globalem typeorder-Konzept arbeiten
		//if(ifdefined(hot:"movetofront",true),obj = (obj -- [hot])++ [hot]);
		//err(hot:"movetofront");

		//err(sum(apply(obj,#:"name"+" ")));

		// angefasste Elemente kommen nach vorn
		x=0; //verhindert das seltsame Verhalten, dass bei Drücken nicht gezeichnet wird
,
    hot = NADA; // explizit auf "undefiniert" setzen.
);
  `,
  mousemove: `// v1
// Falls ein Element bewegt wird (also hot definiert ist), aktualisiere seine Koordinate

if(!isundefined(oldaction),
 //err(action); // err(startmouse); err(startcoord); err(mouse().xy);

 act(oldaction,action+"sticky",startmouse, startcoord, mouse().xy, mouse().xy-oldmouse);
 oldmouse = mouse().xy;

 //err(oldaction);
 clrscr();
 forall(obj, #:"draw");
 forall(objpreview, eval(#:"draw",preview->true));
 repaint();

);

// Handle divomath Result printing
if(!isundefined(divomathConfig),
	divomathUpdateResults();
);
  `,
  mousedrag: `// v1
// Falls ein Element bewegt wird (also hot definiert ist), aktualisiere seine Koordinate

if(!isundefined(hot),
 //err(action); // err(startmouse); err(startcoord); err(mouse().xy);

 if(not(isundefined(hot:"deletecopyifnotmovedandsubstitutebyoriginal")), 
			hot:"deletecopyifnotmovedandsubstitutebyoriginal"=NADA); 
		
 //err(dist(mouse().xy,startmouse) +" "+pinchsensitivity/10);
 act(hot,action,startmouse, startcoord, mouse().xy, mouse().xy-oldmouse);
 oldmouse = mouse().xy;
);
  `,
  mouseclick: `// v1
if(false,

// Der gesamte Code von Cklic wird jetzt bei release ausgeführt
// solange die Sensitiviät auf Klicks in CindyJS nicht verbessert ist

// Bei IPad und wird press, release UND cklick ausgelöst
// Will man mausklick, muss man press/release abfangen

// Teste alle Objekte, ob sie hot sind und sende ihnen gegebenfalls ein "click"
forall(obj,o,
		if(o:"ishot",
		if(isundefined(o:"deletecopyifnotmovedandsubstitutebyoriginal"), 
			o:"click"; 
			,
			obj=obj--[o]; // Kopie wieder löschen
			hot=o:"deletecopyifnotmovedandsubstitutebyoriginal"; //gemerktes Original wiederaktivieren
			//hot:"click";
			);
		//err("click:"+o:"name");
		);
);

if(!isundefined(oldaction),
  act(oldaction,action+"end",startmouse, startcoord, mouse().xy, mouse().xy-oldmouse);
  oldaction=NADA;
);

// Alternative Formulierung (schöner?):
//forall(select(obj,#:"ishot"),#:"click");
);
  `,
  mouseup: `// v1
// Code für RELEASE
if(!isundefined(hot),
  //err("released:"+action);

	act(hot,action,startmouse, startcoord, mouse().xy, mouse().xy-oldmouse);

  //Allgemeiner "drop on" event – entscheiden, ob der vor, nach oder vor und nach act(...) sein soll.
  if(!isundefined(action),
		forall(select(obj,o,eval(o:"ishot",coord->mouse())),droptarget, eval(droptarget:"dropevent", dropobject->hot);
	); 
	);

  if(isundefined(hot:"sticky"),
			act(hot,action+"end",startmouse, startcoord, mouse().xy, mouse().xy-oldmouse);
	);
  if(!isundefined(hot:"sticky"),
			if(!(hot:"sticky"),
			act(hot,action+"end",startmouse, startcoord, mouse().xy, mouse().xy-oldmouse),
			act(hot,action+"pause",startmouse, startcoord, mouse().xy, mouse().xy-oldmouse)

  ););
);

if(hot:"sticky", oldaction = hot);


// Code für CLICK = Release when close

//err(dist(startmouse,mouse().xy)+" "+pinchsensitivity);

if(dist(startmouse,mouse().xy)<pinchsensitivity,
// then click

forall(obj,o,
		if(o:"ishot",
		if(isundefined(o:"deletecopyifnotmovedandsubstitutebyoriginal"), 
			o:"click"; 
			,
			obj=obj--[o]; // Kopie wieder löschen
			hot=o:"deletecopyifnotmovedandsubstitutebyoriginal"; //gemerktes Original wiederaktivieren
			//hot:"click";
			);
		//err("click:"+o:"name");
		);
);

if(!isundefined(oldaction),
  act(oldaction,action+"end",startmouse, startcoord, mouse().xy, mouse().xy-oldmouse);
  oldaction=NADA;
);

);
  `,
  keydown: ``,
  multidown: ``,
  multidrag: ``,
  multiup: ``,
  tick: `// v1
animations = select(animations, a,
	regional(λ,γ,value,now);
  now=seconds();
  if(isundefined(a:"exec"),

  λ = min(1,(now-(a:"starttime"))/((a:"endtime")-(a:"starttime")));
 if(λ>0,
	if (a:"timeflow" == "linear",  
				//default  
	,
	if (a:"timeflow" == "accel",
			λ = 5/2*λ^3-3/2*λ^5;
	,
	if (a:"timeflow" == "jump",
			if(λ<1, λ=0);
	,
	)));
	if (a:"timeflow" == "set",
		(a:"object"):(a:"property") = if(λ<1, a:"startvalue",a:"endvalue"),
		if (isundefined(a:"movepath"), 
			  (a:"object"):(a:"property") = a:"endvalue"* λ + a:"startvalue" * (1 - λ)
				,
				(a:"object"):(a:"property")=eval((a:"movepath"):"f",start->a:"startvalue",end->a:"endvalue",α->λ)
		);
	);
);

  );
 	// forall(ANI u,a, call(a,"recalc:"));
	running = now < a:"endtime";
	if (!running & !isundefined(a:"command"), a:"object":(a:"command"));
	if (!running & a:"kill", obj = select(obj,# != a:"object"));
	running
);

if(length(animations)==0, stopanimation());
  `,
  move: ``,
  draw: ` // v2
// Color background.
fill(screen(),color->'bgcolor);

// DEBUGGING
if('debuglevel > 1,
	repeat(10,drawcircle([0,0],2^#,color->[0.95,0.95,0.95]));
	draw(join([0,0],[1,0]),color->[0.8,0.8,0.8]);
	draw(join([0,0],[0,1]),color->[0.8,0.8,0.8]);
);

if('debuglevel > 9, 
	drawtext('doctextpos,'doc)
);

// Globale Screenparameter
getscreenparams();
copyrighttext.xy = (screenbounds()_3).xy-(225,-10)/screenresolution();

// Zeichne alle Objekte, die in der Liste "obj" sind
// zuerst alle types entsprechend der Typreihenfolge in typeorder, dann den Rest
forall(typeorder,to,
		forall(obj,o, if(o:"type"==to, o:"draw"))
);

forall(obj,o,
		if(not(contains(typeorder,o:"type")),o:"draw")
);
`,
},
defaultAppearance: {
  dimDependent: 0.7,
  fontFamily: "sans-serif",
  lineSize: 1,
  pointSize: 5.0,
  textsize: 12.0
},
angleUnit: "°",
geometry: [
  {name: "copyrighttext", type: "Button", pos: [3.945205479452055, -4.0, 0.48088512286386786], color: [1.0, 1.0, 1.0], fillcolor: [0.278, 0.467, 0.522], fillalpha: 1.0, pinned: true, script: "if(cindyjs, \n  javascript(\"window.open('\"+url+\"','_blank')\"),\n  openurl(url)\n);", text: "VAM by Leuders & Kortenkamp (DZLM), CC-BY-NC 4.0", textsize: 8.0}
],
animation: {
  autoplay: false,
  controls: false,
  speed: 0.5,
  speedRange: [0.0, 1.0],
  accuracy: 1
},
autoplay: false,
animcontrols: false,
ports: [{
  width: 747,
  height: 516,
  id: "CSCanvas",
  transform: [{visibleRect: [-0.14428501372721858, 16.432459896711006, 23.807027264991067, -0.11222167734339224]}],
  background: "rgb(255,255,255)"
}],
csconsole: false,
cinderella: {build: 2075, version: [3, 0, 2075]}
});
