() => ({
scripts: {
  init: 
  // FW: divomath config
  `
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
  `
// Vars for configuring VAM behavior
// Convention - starts with single quote (')

// A | Common flags
isdebugging='isdebugging = false;	// Toggle debugging. (legacy)
// 'debuglevel = 0; // local overwrite for debuglevel set by divomath
mousepressedtime='mousepressedtime=false;

// B | Screen config parameters
'bordersize = .05; // default border size (equals 0.5 mm fineliner)
'pinchsensitivity = 1; // default pinch sensitivity
'doc = "No docstring for VAM.";
'doctextpos = (screenbounds()_1).xy+[1,-0.5];
// C | Overwrite VAM choice locally
// comment before production
//vam = "numbercards";
  `
  +  // FW: constants
  `
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

// A.3 | Divomath colors
divogreen=DIVOGREEN = (129,239,104)/255;
divoviolett=DIVOVIOLET = (150,59,216)/255;
divograu=DIVOGREY = (165,165,165)/255;
divoschwarz=DIVOBLACK = grey(0);
divorot=DIVORED = (255,84,84)/255;
divoblau=DIVOBLUE = (120,147,194)/255;

// A.* | Color palettes
// Color palettes consisting of colors above
vampalette=VAMPALETTE= [
	DARKRED,
	DARKBLUE,
	DARKGREEN,
	DZLMCOLORGOLD,
	DZLMCOLORDARK
];
placevaluepalette=PLACEVALUEPALETTE = [
	PLACECOLORGREEN,  // Hundreds
	PLACECOLORBLUE,		// Tens
	PLACECOLORRED			// Units
];
divopalette=DIVOPALETTE = [
	DIVOGREEN,
	DIVOVIOLET,
	DIVOGREY,
	DIVOBLACK,
	DIVORED,
	DIVOBLUE
];

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
  `
  +  // FW: general vars init
  `
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
  `
// Animations...@Todo: Document
animations = [];

//**Adds an animation objcet to 'animations' to be resolved in Timer script
//* @param...@TODO
//**
new animation(object, property, startvalue, endvalue, duration, timeflow, delay, kill) := (
	regional(now,then);
	now = seconds();
	then=now+delay;
	animations = animations :> 
		{ "object" : object, "property": property, 
			"startvalue" : startvalue, "endvalue" : endvalue,
	  		"starttime" : then, "endtime" : then + duration,
			"kill" : kill,
			"timeflow" : timeflow,   // should be linear, accel, or jump
			"movepath": movepath
		};
	playanimation();
);

//** LEGACY STUFF **//
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
  `
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

//**Generates a regular polygon with a specified number of verticies.
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
	regional(len, key, map, result);
	map = {	"0":0,"1":1,"2":2,"3":3,"4":4,
					"5":5,"6":6,"7":7,"8":8,"9":9,
					"a":10,"b":11,"c":12,"d":13,"e":14,"f":15,
					"A":10,"B":11,"C":12,"D":13,"E":14,"F":15
	};
	len = length(hex);
	result = 0;
	repeat(len,
		key = hex_(len+1-#);
		result = result + 16^(#-1) * map:key;
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
  `
// Base "Class" for VAMobject
new VAMobject(type) := (
	regional(obj);
	obj = {
		"coord" 			: [0,0],
		"type"  		  : type,
		"ismoveable"  : false,
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
  `
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
  `
new Button(coord,width,height,label,fontsize) := (
	regional(obj);
	obj = new VAMobject("Button");

	obj:"coord"  = coord;
	obj:"width"  = width;
	obj:"height" = height;
	obj:"cornerradius" = (width+height) / 50;
	obj:"color"	 = dzlmcolorlight;
	obj:"label"	 = label;
	obj:"fontsize" = if(fontsize==nada, 12, fontsize);
	obj:"ismoveable" = false;
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
		fillpoly(
			apply(my("hitbox"),#+[0.1,-0.1]),
			color->[0,0,0],
			alpha->0.2
		);
		
		// Draw box and border
		fill(
			my("shape"),
			color->if(my("ishot"),0.95*my("color"),my("color")),
			alpha->1
		);
		draw(
			my("shape"),
			color->dzlmcolorgold
		);
		// Draw Label
			drawtext(
				my("coord")+(my("width"),
				my("height")/2)/2, 
				align->"center",
				color->dzlmcolordark,
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
  `
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
  `
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
  `
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
  + // VAM numbercards v1
  `
// Zahlenkarten
if(vam == "numbercards",

// A | Documentation
'doctextpos = [9,15.5];
'doc = "
>> Konfigurierbarer Zustand | VAM 'numbercards'
color: true     # Farbige Stellenkarten oder Graustufen
colortoggle: false     # Anzeigen des Farbswitches
alpha: 0.2     # Transparenz der Zahlenkarte beim Aufklappen
cards: 1     # Anzahl der Karten*
x: 3     # Position, x-Koordinate
y: 14     # Position, y-Koordinate
value: 42     # Startwert der Zahlenkarte
edit: ttt     # editierbare Stellen (t=true,f=false - von groß nach klein)
unfold: false     # Stellenkarten zu Beginn ein-/ausblenden
==========================================================
>> Results | VAM 'numbercards'
nc1     # Wert der Zahlenkarte**
nc1_E     # Wert der Einer-Stelle
nc1_Z     # Wert der Zehner-Stelle
...
nc1_HM     # Wert der Hundert-Millionen Stelle***
nc1_unfolded # (bool) Karte ausgeklappt (true) oder nicht (false)
==========================================================
* Wenn größer 1, dann sollten die Parameter x,y,value,edit,unfold als 
entsprechend große Listen angelegt werden.
** nc=numbercard. Die folgende Zahl markiert die erste Karte. Wurden 
mehrere Karten konfiguriert, sind analoge Werte auch für nc2, nc3 etc. verfügbar.
*** Für die ersten Stellen werden die Buchstaben [E,Z,H,T,ZT,HT,M,ZM,HM] 
verwendet, danach wird die Stelle als Zahl ausgedrückt (10,11,...).
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
	cards_#:"val" = 42;
	cards_#:"max" = 3;
	cards_#:"edit" = [true,true,true];
	cards_#:"unfold" = false;
);

// Configure x-locations "c"_1
item = 'dmstate.x;
item = if(!islist(item) & !isundefined(item), [item]); // force list
repeat(min(numofcards,length(item)),
	cards_#:"c"_1 = item_#
);

// Configure y-locations "c"_2
item = 'dmstate.y;
item = if(!islist(item) & !isundefined(item), [item]); // force list
repeat(min(numofcards,length(item)),
	cards_#:"c"_2 = item_#
);

// Configure initial value "val"
item = 'dmstate.value;
item = if(!islist(item) & !isundefined(item), [item]); // force list
repeat(min(numofcards,length(item)),
	cards_#:"val" = if(islist(item),item_#,item)
);

// Configure editable list "edit"
item = 'dmstate.edit;
item = if(!islist(item) & !isundefined(item), [item]); // force list
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

// Configure folded flag "unfold"
item = 'dmstate.unfold;
item = if(!islist(item) & !isundefined(item), [item]); // force list
repeat(min(numofcards,length(item)),
	cards_#:"fold" = item_#
);

// Configure, if placecards are colorful (true) or not (false)
item = 'dmstate.color;
monte = if(!isundefined(item), item, true);

// Configure, if montessori switch is shown, default: true
item = 'dmstate.colortoggle;
showtogglemonte = if(!isundefined(item), item, false);

// Configure fading of numbercard, default: 0.2
item = 'dmstate.alpha;
alpha = if(!isundefined(item), item, 0.2);

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
	o:"width" 			= maxplaces;
	o:"height" 			= 1;
	o:"maxplaces"		= maxplaces;
	o:"value" 			= initialvalue;
	o:"color" 			= grey(.95);
	o:"bgcolor" 		= grey(.95);
	o:"mix" 				= 0;
	o:"edit"				= false;
	o:"ismoveable"	= true;

	o:"ishot" := or(
		intriangle(my("downbutton"), mouse().xy),
		intriangle(my("upbutton"), mouse().xy)
	);

	o:"shape" := rectangle(
		my("coord"), 
		my("width"),
		my("height")
	);

	o:"draw" := (
		if(my("value")>0,
			regional(ps);
			fillpoly(
				my("shape"),
				color->(1-my("mix"))*my("bgcolor")+my("mix")*my("color")
			);
			drawpoly(
				my("shape"),
				size->3,
				color->(1-my("mix"))*my("bgcolor")+my("mix")*my("color")
			);				
			drawpoly(
				my("shape"),
				color->grey(0)
			);
			repeat(my("maxplaces"),
				ps = pixelsize(
					"0",
					size->screenresolution(),
					family->schulschrift
				);
				drawtext(
					my("coord") + (
						my("maxplaces") - # + .5,
						(ps_3) / 4 / screenresolution()
					),
					if(# == my("maxplaces"), my("value"), 0),
					align->"center",
					size->screenresolution(),
					family->schulschrift
				)
			);
		, // else to draw-if
			drawpoly(
				my("shape"),
				size->3,
				color->(1-my("mix"))*my("bgcolor")+my("mix")*my("color")
			);			
			drawpoly(my("shape"),color->grey(0));
		);
		if(my("edit"),
			if(my("value") < 9, // can become more
				self():"upbutton" = apply(
					((-0.9,.55),(-.1,.55),(-.5,.9)),
					my("coord")+#
				);
				fillpoly(my("upbutton"), color->dzlmcolordark);
				drawtext(
					my("coord")+(-0.5,.6),"+",
					color->dzlmcolorlight,
					size->screenresolution() / 4,
					align->"center"
				);
			, // inner else
				self():"upbutton" = [];
			);
			if(my("value")>0, // can become less
				self():"downbutton" = apply(
					((-0.9,.45),(-.1,.45),(-.5,.1)),
					my("coord")+#
				);
				fillpoly(
					my("downbutton"),
					color->dzlmcolordark
				);
				drawtext(
					my("coord")+(-0.5,.2),
					"-",
					color->dzlmcolorlight,
					size->screenresolution()/4,
					align->"center"
				);
			, // inner else
				self():"downbutton"=[];
			);
		);
	);

	o:"click" := if(intriangle(my("downbutton"), mouse().xy),
		self():"value" = my("value") - 1;
		my("parent"):"value" = my("parent"):"value"-10^(my("maxplaces")-1)
	, 
		self():"value" = my("value") + 1;
		my("parent"):"value" = my("parent"):"value"+10^(my("maxplaces")-1)
	);

	o; // Return placecard.
);

// C.2 | Numbercard
new Numbercard (c,initialvalue, maxplaces, editable) := (
	regional (o);
	o = new VAMobject("numbercard");
	o:"coord" 			= c;
	o:"width" 			= maxplaces;
	o:"height" 			= 1;
	o:"maxplaces" 	= maxplaces;
	o:"editable"		= editable; // bool array of editable placecards
	o:"value" 			= initialvalue;
	o:"expanded" 		= false;
	o:"children" 		= [];
	o:"alpha" 			= 1;
	o:"offset"			= 1;
	o:"fadetime" 		= 3/5;
	o:"foldtime" 		= 5/5;
	o:"color" 			= grey(.95);
	o:"fadealpha"		= alpha;
	o:"ismoveable" 	= true;
	o:"montessori" 	= monte;

	o:"hitbox" := rectangle(
		my("coord") - (2,0),
		2 + my("maxplaces"), 
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
		fillpoly(
			my("shape"),
			color->my("color"),
			alpha->my("alpha")
		);
		drawpoly(
			my("shape"),
			size->3,
			color->grey(0),
			alpha->my("alpha")
		);
		value = my("value");
		dodraw = true;
		repeat(my("maxplaces"),
			ps = pixelsize(
				"0",
				size->screenresolution(),
				family->schulschrift
			);
			if(dodraw,
				drawtext(
					my("coord") + (my("maxplaces") - # + .5,
					(ps_3)/4/screenresolution()),
					mod(value,10),align->"center",
					size->screenresolution(),
					family->schulschrift,
					alpha->my("alpha")
				)
			);
			value = floor(value/10);
			dodraw = (value>0);
		);
		fillpoly(
			rectangle(self():"coord"-(2,0), 1, self():"height"),
			color->dzlmcolorlight
		);
		repeat(if(my("expanded"),1,4),
			fillpoly(
				rectangle(
					(self():"coord")+(-2.1+.2*#,-.05+.2*(5-#)),
					(5-#)*.2,.1
				),
				color->dzlmcolordark
			);
		);
		forall(my("children"), #:"draw");
	);

	o:"move" := if(self():"ismoveable", self():"coord" = coord);
	
	o:"active" := inrectangle( // If condition
		rectangle(
			my("coord") - (2,0), 
			2 + my("maxplaces"),
			my("height")
		), 
		mouse().xy
	);

	o:"click" := (
		if(my("active"),
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
								placevaluepalette_(mod(my("maxplaces")-place-1,3) + 1)
							, // else grey
								grey(.95)
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
			// handle click on children
			forall(my("children"), if(#:"ishot", #:"click"));
	);

	o:"getaction" := (
		action = if( // if condition
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
regional(run);
run = 1;

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
			);;
			pc:"parent" = thing;
			pc:"color" = if(thing:"montessori", // colorful
				placevaluepalette_(mod(thing:"maxplaces"-place-1,3) + 1)
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

// Init Montessori-Button
if(showtogglemonte,
	thing = new Toggle([.2,15.3],1,monte,"",nada);
	obj = obj :> thing;

	// Add button script to push state to placecards
	thing:"script" := (
		// Loop over every placecard
		forall(obj -- [obj_(-1)], card,
			// Apply toggle state
			card:"montessori" = thing:"state";
			// Recolor all children for immediate effect
			// @Todo: Refactor, snippet identical to placecard click method
			regional(place);
			place = 1;
			forall(card:"children", child,
				child:"color" = if(card:"montessori", // colorful
					placevaluepalette_(mod(card:"maxplaces"-place-1,3) + 1)
				, // else grey
					grey(.95)
				);
				place = place + 1;
			);
		);
	);
);

); // End VAM-if
  `
  + // VAM strapwork v1
  `
// Parkettierung / Bandornamente
if(vam=="strapwork",

// CONFIG / TOGGLES
// Divomath configuration
drawborders = if(!isundefined('dmstate.drawborders),
	'dmstate.drawborders
, 
	true
);
numofpolys = if(!isundefined('dmstate.numofpolys),
	'dmstate.numofpolys
,
	4
);
colors = if(!isundefined('dmstate.polycolors),
	'dmstate.polycolors
,
	[1,2,3,4]
);

vertices = if(!isundefined('dmstate.vertices),
	'dmstate.vertices
,
	[4,3,4,3]
);

// Regular Polygon
new RegPoly(center,radius,vertices,rotation,palettecolor):= ( 
	regional(o);
	o = new VAMobject("regpoly");	
	o:"coord" 			= center;
	o:"radius" 			= radius;
	o:"vertices"		= vertices;
	o:"rotation"		= rotation;
	o:"ismoveable" 	= true;
	o:"copyonmove"	= false;
	o:"parent" 			= nada; // should be a Workbench or Container
	o:"clones"			= []; // copies of original thing.
	o:"color" 			= DIVOPALETTE_(
		mod(
			palettecolor-1,
			length(DIVOPALETTE)
		)
		+ 1
	);

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
			if(drawborders,
				drawpoly(shape,color->grey(0),size->bordersize);
			);
		, // else shape is circle
			fill(shape,color->my("color"));
			if(drawborders,
				draw(shape,color->grey(0),size->bordersize);
			);
		);
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

	o:"move" := (
		if(my("ismoveable"),
			self():"coord" = coord;
		)
	); 
	
	o:"click" := (); // ?
	o:"copy" := (
		regional(copy);
		copy = new RegPoly(
			my("coord"),
			my("radius"),
			my("vertices"),
			my("rotation"),
			1;
		);
		copy:"color" = my("color");
		
		// Handle clones
		self():"clones" = my("clones") :> copy;
		copy:"clones" = nada; // copies cannot have clones
		copy:"cloneof" = self(); // remember original RegPoly

		copy; // Return copy of RegPoly
	);
	
	o:"moveend" := ( // Handle dropped RegPolys
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
		// damn. We cannot really use the generic drop method.
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

	o; // Return the RegPoly
);

// Seperator for RegPolys inside a Container
new Seperator (parent, coords, radius, height) := (
	regional(o);
	o = new VAMobject("Seperator");
	o:"parent"			= parent;
	o:"coord" 			= coords;
	o:"radius" 			= radius;
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

	o:"draw" := (
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
	);

	o:"copy" := (
		regional(copy); 
		copy = new Seperator(
			nada,
			my("coord"),
			my("radius"),
			my("height")
		);
		copy:"copyonmove" = false;

		// Handle clones
		self():"clones" = my("clones") :> copy;
		copy:"clones" = nada; // copies cannot have clones
		copy:"cloneof" = self(); // remember original Seperator

		copy; // Return copy.
	);
	o:"moveend" := ( // Handle dropped Seperators
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

	o; // Return Seperator
);

// Container to hold RegPolys and Seperators
new Container(center,height, size) := (
	regional(o);
	o = new VAMobject("Container");
	o:"coord"			= center;
	o:"height"		= height;
	o:"size"			= if(!isundefined(size),size,-1);
	o:"color"			= dzlmcolorlight;
	o:"children"	= [];
	o:"rootseperator" := new Seperator(
		self(),
		my("coord") - [0, my("height")/2 ], // lower left corner of Container
		0.25,
		my("height")
	);

	o:"moveable"	= true;
	o:"shape" := rectangle(
		my("coord") - (0, my("height"))/2,
		my("height") * (length(my("children"))+0.5),
		my("height")
	);
	o:"ishot" := inrectangle(my("shape"),mouse().xy);
	o:"draw" := (
		// Fill rectangle
		fillpoly(
			my("shape"),
			color->my("color")
		);

		// Draw Seperator
		my("rootseperator"):"draw";

		// Draw children
		forall(my("children"), child, child:"draw");
	);
	
	o:"move" := (
		regional(delta);
		delta = coord-my("coord");
		
		if(self():"moveable",
			self():"coord" = coord
		);

		// Move children
		forall(my("children"), 
			eval(#:"move",coord->(#:"coord"+delta))
		)
	);
	o:"dropped" := (
		local(position,oldpos,index);
		position = min(
			length(my("children")) + 
				if(dropobject:"parent"==self(),0,1),
			round(
				((dropobject:"coord"-my("coord"))/my("height"))_1+.5
			)
		);
		if(dropobject:"parent"==self(),
			// 1: If container is already parent of thing
			println("Dropped :: Branch if 1");
			index=0;
			forall(my("children"),
				index = index + 1;
				if(#==dropobject, oldpos = index)
			);
			if(oldpos<=position,
				// 1->2: Dropobject gets dragged to the right
				println("Dropped :: Branch if 2");
				forall((oldpos+1)..(position),
					new animationobjectwithdelay(
						my("children")_#,
						"coord",
						(my("children")_#):"coord",
						(my("children")_#):"coord"-(my("height"), 0),
						.2,
						"accel",
						(#-1-oldpos)/10
					)
				);
				new animationobjectwithdelay(
					dropobject,
					"coord",
					dropobject:"coord",
					my("coord") +
					(my("height")/2,0) +
					(my("height"),0) * (position-1) +
					if(dropobject:"type"=="Seperator",
						(0,-my("height")/2),
						(0,0)
					),
					.2,
					"accel",
					(position-oldpos)/10
				);
	  		self():"children" = my("children")_(1..(oldpos-1)) ++ 
					my("children")_((oldpos+1)..position) ++ 
					[dropobject] ++
					my("children")_((position+1)..length(my("children")));
		  ,	// 1->2.else: Dropobject gets dragged to the left
				forall((position)..(oldpos-1),
					new animationobjectwithdelay(
						my("children")_#,
						"coord",
						(my("children")_#):"coord",
						(my("children")_#):"coord" + (my("height"),0),
						.2,
						"accel",
						(oldpos-1-#)/10
					)
				);
				new animationobjectwithdelay(
					dropobject,
					"coord",
					dropobject:"coord",
					my("coord") +
					(my("height")/2,0) +
					(my("height"),0) * (position-1) +
					if(dropobject:"type"=="Seperator",
						(0,-my("height")/2),
						(0,0)
					),
					.2,
					"accel",
					(oldpos-position)/10
				);
	  		self():"children" = my("children")_(1..(position-1)) ++ 
					[dropobject] ++ my("children")_(position..(oldpos-1)) ++  
					my("children")_((oldpos+1)..length(my("children")));
			); // End if 2
		, // 1.else: Container is not already parent of dropped thing
			// Change height of a Seperator, to match Containers
			if(dropobject:"type" == "Seperator",
				dropobject:"height" = my("height");
			);
			forall(position..length(my("children")),
				new animationobjectwithdelay(
					my("children")_#,
					"coord",
					(my("children")_#):"coord",
					(my("children")_#):"coord"+(my("height"),0),
					.2,
					"accel",
					(length(my("children"))-#)/10
				)
			);
			new animationobjectwithdelay(
				dropobject,
				"coord",
				dropobject:"coord",
				my("coord") +
				(my("height")/2,0) +
				(my("height"),0) * (position-1) +
				if(dropobject:"type"=="Seperator",
					(0,-my("height")/2),
					(0,0)
				),
				.2,
				"accel",
				(length(my("children"))-position+1)/10
			);
			self():"children" = my("children")_(1..position-1) ++ 
				[dropobject] ++  
				my("children")_(position..length(my("children")));
			dropobject:"parent"= self();
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

// Init
// Init Container (/w root seperator)
regional(container);
container = [];
container = container :> new Container([1,7],2.5,1);
container = container :> new Container([1,15], 2.5,1);


// Init workbench based on number of polys and workbench seperator
regional(padding, screen, wbcoord, wbwidth, wbheight, wb);
padding = 0.2;
screen = screenbounds();

wbwidth = numofpolys * 2; // sum of diameter of all polys
wbwidth = wbwidth + 0.8; // width of Seperator
wbwidth = wbwidth + padding * (numofpolys+1+1); // padding

wbheight = 2; // diameter of a poly
wbheight = wbheight + padding * 2; // padding

wbcoord = (screen_3 + screen_4) / 2; // bottom center of screen
wbcoord = wbcoord + [0,(screen_1_2 - screen_4_2)/25,0]; // move up
wbcoord = wbcoord - [wbwidth/2, 0, 0]; // move left

wb = new Workbench(wbcoord.xy, wbwidth, wbheight, DZLMCOLORDARK);
wb:"isclickable" = false;
wb:"ishot" = false;

// Init workbench seperator
regional(wbsepradius, wbsep);
wbradius = 0.25;
wbsep = new Seperator(
	wb, 
	wbcoord.xy + [wbradius, wbradius] + [padding,padding], 
	wbradius, 
	wb:"height" - 2*padding - wbradius
);

// Init polys
regional(polys);
polys = []; // List of all polys
repeat(numofpolys,
	polys = polys :>
		new RegPoly(
			[
				wb:"coord"_1 + 2*wbsep:"radius" + wbheight/2 + 2*padding + (wbheight - padding) * (#-1), 
				wb:"coord"_2 + wb:"height" / 2 + padding
			], 
			wbheight / 2 - padding, 
			vertices_#, 
			PI/4, 
			colors_#
		); 
);

// Configure all polys and wb seperator
apply(polys, // Configure all polys
	#:"parent" = wb; 
	#:"copyonmove" = true;
);

// Draw
obj = obj :> wb;
obj = obj :> wbsep;
obj = obj ++ polys;
obj = obj ++ container;

//s = new Seperator(c1, [7,7], 0.4, 1);
//obj = obj :> s;

);
  `
  + // .debugging
  `
// Debug print divomath details
if('debuglevel > 0,
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
  mousedown: `
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
  mousemove: `
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
  mousedrag: `
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
  mouseclick: `
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
  mouseup: `
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
  tick: `
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
  draw: `
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

// Zeichne alle Objekte, die in der Liste "preview" sind die sind nur temporär vorhanden
// in den Vordergrund
//err(objpreview);
forall(objpreview, eval(#:"draw",preview->true));
// aktives nochmal drüber zeichnen
// WARUM IST DAS NOTWENDIG?
// TL: Damit "hot" vor preview gezeihnet wird. Kann man aber anders lösen
// Finde ich nicht gut, sollte dann notfalls in objpreview mit reingenommen werden
// obj_(-1):"draw";
// AGENDA: Previewobjekte als ganz normale Objekte mit "preview"-label am Schluss zeichnen
// benutzt vor allem (nur?) bei bruchstreifen


//------
// Das hier muss in "Taste getippt", wenn es funktionieren soll
//forall(obj,o,if(o:"ishot",o:"keypress";););

// DEBUGGING
// Im debugging-Modus (siehe "Initialization" werden die Info-Texte aller Objekte angezeigt)
if('debuglevel > 1,
  forall(obj, drawtext(#:"coord",#:"info",align->"mid"));
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
