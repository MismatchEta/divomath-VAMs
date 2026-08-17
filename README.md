> v7b403

# divomath VAM Dokumentation

JS Framework zum Import als Komponente in divomath zur Verwendung von CindyJS Widgets im Editor. Nach dem Import der aktuellen Version des divoVAM Frameworks kann über die Komponente im Editor auf verschiedene CindyJS Widgets zugegriffen werden. Diese werden hauptsächlich über das [Komponentenverhalten](#komponentenverhalten) und den [Zustand](#konfiguration-des-zustands-eines-vams) konfiguriert.

Examplarische Einbindungen im Editor sind hier zu finden: <https://editor.divomath-nrw.de/folien/634fa76ad6627092d00ffb24/6697a005040ef4466b6d5342/6697a02b69fcc16c3e49d692/0/6a79a78eae9dd79ab405da92>

## Komponentenverhalten

### Generelles Verhalten

Über das Komponentenverhalten der Framework-Komponente wird deren generelles Verhalten gesteuert (insbesondere die Auswahl eines Widgets). Die Konfiguration des gewählten Widgets findet in [Zustand](#zustand) statt. Die folgenden Einstellungen werden im Komponentenverhalten unter dem Schlüssel "configuration" vorgenommen:

- cindyJsPrefix: divomath 
  - Genau so erforderlich. Wird Präfix der von divomath an CindyJS übergebenen Parameter (Komponentenverhalten und Zustand). Framework erwartet den Präfix "divomath"
- vam: *\<string>*
  - Switch für das gewünschte CindyJS Widget. Entsprechenden zulässigen [Namen](#strings-f%C3%BCr-vam-schl%C3%BCssel) verwenden
  - default "default": Zeigt Hinweis zum korrekten Komponentenverhalten an.
- debuglevel: *\<unsigned int>*
  - Möglicherweise von einigen Widgets zum debugging verwendet. Normalerweise nicht nötig zu setzen. Sollte im Produktivbetrieb 0 sein.
  - default 0: Kein Debugging.
- bgcolor: *[\<float>,\<float>,\<float>]*
  - Hintergrundfarbe. Liste von 3 floats aus [0,1]. Repräsentieren ROT, GRÜN, BLAU Anteil des Hintergrunds.

### Strings für *vam* Schlüssel

Folgende Strings sind für *vam* Schlüssel zulässig:

- divisors (seit: 2.0.0, letzte Änderung: 7)
- numbercards (seit: 1.0.0, letzte Änderung: 7)
- percentagebar (seit 3.0.0, letzte Änderung: 7)
- strapwork (seit: 1.0.0, letzte Änderung: 7)
- distributive (seit 4.0.0, letzte Änderung: 7)
- thales (seit: 7)

### Beispiel

Eine Minimalkonfiguration zur Darstellung der Zahlenkarten-Komponente ("numbercards").
``` yaml
configuration:
  cindyJsPrefix: divomath
  vam: numbercards
```

## Konfiguration des *Zustands* eines VAMs

Dieser Abschnitt stellt die möglichen Konfigurationen der verschiedenen VAMs dar. Diese werden grundsätzlich im *Zustand* einer Komponente vorgenommen. Die Konfigurationen sind widgetabhängig und finden unter dem Schlüssel "cindyjs" statt. Die Dokumentation hier spiegelt dabei nur den Stand der aktuellen wider. Unter Umständen wird eine Komponente in älteren Versionen anders konfiguriert.

### Beispiel

Das folgende Beispiel zeigt eine Konfiguration für das VAM *numbercards*. [Siehe unten](#zustand-numbercards) für Details.
``` yaml
cindyjs:
  color: true
  colortoggle: false
  alpha: 0.2
  cards: 1
```

### Zustand: distributive

- gridposition: *\[\<float>, \<float>]>*
  - Startposition des Rechteckfelds (referenziert linke untere Ecke.)
  - default [10,8]
- rows: *\<int>*
  - Anzahl der Zeilen des Rechteckfelds
  - default 5
- cols: *\<int>*
  - Anzahl der Spalten des Rechteckfelds
  - default 7
- size: *\<float>*
  - Die Größe der Blobs.
  - default 1
- cornerradius: *\<float>*
  - Der Eckradius der Blobs. 0 zeichnet Quadrate (beste Performance), sonst abgerundete Rechtecke. Sollte höchstens die Hälfte von *size* sein.
  - default .5 (mit size=1 ein Kreis)
- verticalpadding: *\<float>*
  - Der vertikale Abstand zwischen Blobs.
  - default .1
- horizontalpadding: *\<float>*
  - Der horizontale Abstand zwischen Blobs.
  - default .1
- groupspacing: *\<float>*
  - Der Abstand zwischen Gruppen, wenn nach Zeilen oder Spalten gruppiert wird (zusätzlich zum padding).
  - default .2
- cutwidth: *\<float>*
  - Der Abstand zwischen Teilen nach einem Schnitt (zusätzlich zum padding).
  - default .3
- gridmoveable: *\<bool>*
  - Schalter, ob das gesamte Rechteckfeld verschoben werden kann.
  - default *true*
- buttonsize: *\<float>*
  - Die Größe der Werk18zeug-Buttons.
  - default 2
- buttonpadding: *\<float>*
  - Abstand des Buttons zum oberen und rechten Rand.
  - default .4
- labelpadding: *\<float>*
  - Abstand des Output-Texts zum oberen und linken Rand.
  - default 10.3
- animationspeed: *\<float>*
  - Modifier für alle Animationen. Je größer, desto schneller laufen Animationen ab.
  - default .15
- fontsize: *\<int>*
  - Schriftgröße für Term- und Beschreibungsdarstellung.
  - default 18
- drawexpression: *\<bool>*
  - Term zeichen oder nicht
  - default true
- drawverbal: *\<bool>*
  - Verbale Beschreibung zeichnen oder nicht
  - default true
- drawtoolbutton: *\<bool>*
  - Tool Button zeichnen oder nicht
  - default true
- tool: *\<string>*
  - Eingestelltes Tool beim Starten des VAMs. Muss eins von **"hand"**, **"bucket"** oder **"scissors"** sein.
  - default "hand"
- toolbuttonx: *\<float>*
  - x-Koordinate des Tool Buttons. Wenn nicht definiert (NADA), dann am rechten Rand (mit padding).
  - default NADA
- toolbuttony: *\<float>*
  - y-Koordinate des Tool Buttons. Wenn nicht definiert (NADA), dann am oberen Rand (mit padding).
  - default NADA
- groupingtype: *\<string>*
  - Gibt an, welche Gruppierungen mit Klick auf das Rechteckfeld eingestellt werden können. Keine = **"NONE"** | nur Zeilen = **"ROW"** | nur Spalten = **"COL"** | Beides = **"ROWCOL"**
  - default "ROWCOL"
- coloredrowindex *\<int>*
  - Index, derjenigen Zeile, ab der die Zeilen nach unten gefärbt werden sollen
  - default NADA (keine Färbung)
- coloredcolindex *\<int>*
  - Index, derjenigen Spalte, ab der die Spalten nach unten gefärbt werden sollen
  - default NADA (keine Färbung)
- cuthorizontally *\<bool>*
  - Flag, ob das Feld horizontal (__) geschnitten sein soll
  - default false
- cutvertically *\<bool>*
  - Flag, ob das Feld horizontal ( | ) geschnitten sein soll
  - default false
- groupby *\<string>*
  - gibt an, wonach die Elemente des Felds gruppiert sein sollen (eins von **"ROW"**, **"COLUMN"** oder **"NONE"**)
  - default "NONE"
- expressionposition *\[\<float>, \<float>]>*
  - Position des Terms auf der Canvas als Punkt, e.g. **[3,1]**
  - default NADA (automatische Positionierung)
- expressionmoveable *\<bool>*
  - Term-Anzeige beweglich oder nicht
  - default false
- verbalposition *\[\<float>, \<float>]>*
  - Position der verbalen Beschreibung des Terms auf der Canvas als Punkt, e.g. **[3,1]**
  - default NADA (automatische Positionierung)
- verbalmoveable *\<bool>*
  - verbale Termbeschreibung beweglich oder nicht
  - default false
- requiregrouping *\<bool>*
  - Wenn true, können Färben und Zerschneiden erst genutzt werden, nachdem eine Zeilen- oder Spaltenstruktur gewählt wurde. Der Werkzeug-Button wird bis dahin blass dargestellt und lässt sich nicht umschalten.
  - **Achtung**: Die Sperre gilt auch für das Zurücknehmen. Wer gruppiert, färbt, zerschneidet und dann auf "nix" zurückgeht, kann die Färbung von dort aus nicht mehr entfernen, ohne vorher wieder zu gruppieren.
  - default true
- showexpressiontoggle *\<bool>*
  - Schalter zum Ein- und Ausblenden von Term und verbaler Beschreibung anzeigen
  - default false
- expressiontogglestate *\<bool>*
  - Zustand dieses Schalters beim Start
  - default true
- picturemode *\<bool>*
  - Entfernt jede Interaktivität aus dem VAM. Das Feld wird gezeichnet wie konfiguriert, reagiert aber auf keinerlei Eingaben. Gedacht für Abbildungen in Aufgabentexten.
  - Bedienelemente (Werkzeug-Button, Schalter) werden weiterhin gezeichnet, sind aber inaktiv.
  - default false

### Zustand: divisors

- color: *[\<string>,\<string>]*
  - Repräsentiert die beiden Farben, die von der Komponente genutzt werden. Der erste Werte bestimmt die Farbe der Blobs in einem vollen Band, die zweite Farbe die der "übrigen" Blobs.
  - Folgende Farbstrings sind u.a. möglich: 
    - DARKRED=(228,26,28)/255;
    - DARKGREEN=(77,175,74)/255;
    - DARKBLUE=(55,126,184)/255;
    - DZLMCOLORLIGHT = (207,221,225)/255;
    - DZLMCOLORDARK = (70,120,132)/255;
    - DZLMCOLORGOLD = (239,182,96)/255;
    - DZLMCOLORBLUE = (127,127,247)/255;
    - DZLMCOLORRED = (239,134,131)/255;
    - PLACECOLORRED = (102,194,165)/255;
    - PLACECOLORGREEN = (252,141,98)/255;
    - PLACECOLORBLUE = (141,160,203)/255;
    - DIVOGREEN = (129,239,104)/255;
    - DIVOVIOLET = (150,59,216)/255;
    - DIVOGREY = (130,149,192)/255;
    - DIVOBLACK = grey(0);
    - DIVORED = (235,85,78)/255;
    - DIVOBLUE = (83,125,156)/255;
  - Statt einem String geht auch eine 3-elementige Liste (R,G,B)
  - default [DIVOGREY, DIVORED]
- size: *\<float>*
  - Größe der Blobs
  - default .7
- blobmargin: *\<float>*
  - Abstand der Blobs innerhalb eines Bandes
  - default .2
- stripmargin: *\<float>*
  - Abstand der Bänder untereinander
  - default .5
- timing: *\<float>*
  - Zeit für die Animation bei der Bewegung der Blobs
  - default .5
- blobs: *\<int>*
  - Anzahl der Blobs zu Beginn
  - default 0
- maxblobs: *\<int>*
  - Maximale Anzahl an erlaubten Blobs
  - default 100
- divisor: *\<int>*
  - Gruppengröße zu Beginn
  - default 1 (bzw. keine Gruppen)
- maxcols: *\<int>*
  - Maximale Anzahl an erlaubten Spalten (größter Teiler)
  - default 10
- sequentialorder: *\<bool>*
  - Steuert Umordnungsverhalten der Blobs in den Bändern
  - default false
- drawblobbuttons: *\<bool> 
  - Zeichne Buttons zur Änderung der Anzahl der Blobs (true) oder auch nicht
  - default: true
- drawdivbuttons: *\<bool> 
  - Zeichne Buttons zur Änderung des Divisors (true) oder auch nicht
  - default: true
- drawbar: *\<bool> 
  - Zeichne vertikale Linie zur Änderung des Divisors (true) oder auch nicht
  - default: true
- displaycalc: *\<bool>*
  - Anzeige der Berechnungsvorschrift "a : b"
  - default true
- displayresult: *\<bool>*
  - Anzeige des Ergebnisses "= c R d"
  - default true
- displaydescription: *\<bool>*
  - Anzeige der 2 beschreibenden Textzeilen
  - default true
- displayblobcount: *\<bool>*
  - Anzeige der Anzahl der Blobs
  - default true
- displaydivisorcount: *\<bool>*
  - Anzeige der Gruppengröße
  - default true
- fontsize: *\<int>*
  - Schriftgröße der Texte unterhalb der Bänder
  - default 16

### Zustand: numbercards

- cards: *\<int>*
  - Anzahl der Zahlenkarten, Standardwerte entsprechen denen der folgenden Parameter.
  - Werden mehrere Karten verwendet, müssen die folgenden Parameter als entsprechend lange Listen angelegt werden.
  - default 1: eine Karte
- x: *\<list of floats>* oder *\<float>*
  - x-Koordinate(n) der Zahlenkarte(n)
  - default [10*#-7] (Länge bestimmt sich durch *cards*)
- y: *\<list of floats>* oder *\<float>*
  - y-Koordinate(n) der Zahlenkarte(n)
  - default [16] (Länge bestimmt sich durch *cards*)
- value: *\<list of ints>* oder *\<int>*
  - Initiale(r) Wert(e) der Zahlenkarte(n). Größer oder gleich 0.
  - default [1234] (Länge bestimmt sich durch *cards*)
- edit: *\<list of strings>* oder *\<string>*
  - String(s) aus chars "t" (true) oder "f" (false), welcher zum einen die Länge der Karte repräsentiert und zum anderen, welche Stellen (links nach rechts von groß nach klein) geändert werden können (t) und welche nicht (f).
  - Bsp: "tft" = Eine 3-stellige Karte bei der die Zehnerstelle nicht geändert werden kann, die Hunderter- und Einerstelle dagegen schon.
  - default ["t..t", ..] (Alles editierbar, Länge bestimmt sich durch *cards*, Anzahl der Stellen durch *values*)
- unfold: *\<list of bools>* oder *\<bool>*
  - Gibt an, ob die Zahlenkarte(n) zu Beginn ausgeklappt sein sollen (true) oder nicht (false).
  - default [true] (Länge bestimmt sich durch *cards*)
- color: *\<bool>*
  - Darstellung der Stellenkarten in Farbe oder Graustufen
  - default true: Montessori Farben
- colortoggle: *\<bool>*
  - Anzeigen eines Schalters zur Einstellung der Farbe ("color", s.o.)
  - default true
- alpha: *\<float>*
  - Transparenz der Zahlenkarte im ausgeklappten Zustand. (aus [0,1])
  - default 0.2
- separator: *\<char>*
  - Trennzeichen für 3er-Gruppen von Ziffern (Punkt, Leerzeichen oder sonstiges)
  - default "" (kein Trennzeichen)

### Zustand: percentagebar

#### Streifen

- numberofbars: *\<int>*
  - Anzahl der dargestellten Prozentstreifen. Bei mehr als einem teilen sich die Streifen die verfügbare Breite.
  - default 1
- barvalue: *\<float>*
  - Anteil des Streifens beim Start, als Wert aus [0,1]. 0.25 färbt also ein Viertel des Streifens.
  - default 0
- basevalue: *\<float>*
  - Grundwert, also der Wert, der dem ganzen Streifen entspricht.
  - default 1000
- unit: *\<string>*
  - Einheit, die hinter den Werten angezeigt wird.
  - default "MB"
- subdivisions: *\<int>*
  - Anzahl der Schritte, in die der Streifen unterteilt ist.
  - default 1
- barprecision: *\<float>*
  - Schrittweite beim Ziehen des Streifens, als Anteil. .01 entspricht 1 %.
  - default .01
- snapbar: *\<bool>*
  - Wenn true, rastet der Streifen beim Ziehen auf den eingestellten Schritten ein statt in *barprecision*-Schritten. Wirkt nur, solange die Schritte auch angezeigt werden.
  - default false
- isbardraggable: *\<bool>*
  - Streifen mit der Maus bzw. dem Finger veränderbar oder nicht.
  - default true
- overflow: *\<bool>*
  - Erlaubt Werte über 100 %. Wirkt auf Ziehen, Direkteingabe und die Plus-Taste gleichermaßen.
  - default false
- keepstable: *\<string>*
  - Bestimmt, welche Größe konstant bleibt, wenn eine der drei anderen geändert wird. Eins von **"basevalue"** (Ganzes), **"value"** (Teil) oder **"percentage"** (Anteil).
  - default "basevalue"

#### Darstellung

- barposition: *\[\<float>, \<float>]*
  - Position des Streifens (linke untere Ecke). NADA positioniert automatisch.
  - default NADA
- barwidth: *\<float>*
  - Breite des Streifens. NADA passt die Breite automatisch an den sichtbaren Bereich an.
  - **Hinweis**: Bei Einbettung in Storyline sollte hier ein fester Wert stehen. Die automatische Anpassung führt sonst dazu, dass Schrift und Streifen je nach Einbettung unterschiedlich groß zueinander wirken.
  - default NADA
- barheight: *\<float>*
  - Höhe des Streifens.
  - default 1.5
- barpadding: *\<float>*
  - Abstand zwischen mehreren Streifen.
  - default 2.5
- barcolor: *\<string>*
  - Farbe des Streifens. Farbnamen wie bei [divisors](#zustand-divisors).
  - default DZLMCOLORGOLD
- fontfamily: *\<string>*
  - Schriftart der Beschriftungen. NADA verwendet die Standardschrift.
  - default NADA
- decimalspercentage: *\<int>*
  - Nachkommastellen bei Prozentangaben.
  - default 2
- decimalsvalue: *\<int>*
  - Nachkommastellen bei Werten.
  - default 2

#### Bögen und Beschriftungen

- alwaysdrawarches: *\<bool>*
  - Bögen von Anfang an anzeigen. Der zugehörige Schalter ist dabei sichtbar und aktiviert, lässt sich also weiterhin umschalten.
  - **Hinweis**: Bögen werden nur gezeichnet, solange auch die Schritte angezeigt werden. Beide sind gekoppelt: Wird der letzte Schritte-Schalter ausgeschaltet, gehen die Bögen mit aus; wird der Bögen-Schalter eingeschaltet, geht die Schrittanzeige mit an.
  - default true
- leftoutpercentages: *\<list of floats>*
  - Anteile, deren Prozentbeschriftung **nicht** gezeichnet werden soll, als Werte aus [0,1].
  - default []
- leftoutvalues: *\<list of floats>*
  - Analog für die Wertbeschriftungen.
  - default []
- custompercentages: *\<list of floats>*
  - Zusätzliche Anteile, die immer als Prozentbeschriftung erscheinen, unabhängig von den Schritten.
  - default []
- customvalues: *\<list of floats>*
  - Analog für Wertbeschriftungen.
  - default []

#### Bedienelemente

- showbuttons: *\<bool>*
  - Alle Schalter und Eingabefelder anzeigen oder nicht.
  - default true
- hidetoggles: *\<list of strings>*
  - Blendet einzelne Schalter aus, während die übrigen sichtbar bleiben. Wirkt nur, wenn *showbuttons* true ist.
  - Zulässige Bezeichner: **percentage** (Anteil), **part** (Teil), **basevalue** (Ganzes), **parts** (Werte unten), **percentages** (Prozente oben), **arch** (Bögen), **showtf-div** (Anzahl der Schritte), **showtf-divpercentage** (Größe des Schritts in %), **showtf-divvalue** (Größe des Schritts), **showtf-perc** (Eingabe Anteil), **showtf-value** (Eingabe Teil), **showtf-base** (Eingabe Ganzes), **overflow**
  - **Hinweis**: In der URL komma-getrennt **ohne** Anführungszeichen und ohne Leerzeichen angeben, e.g. `hidetoggles=arch,overflow`.
  - default []
- scaffoldbasevalue: *\<bool>*
  - Verdeckt den Grundwert mit einem grauen Feld (als Lücke für Aufgaben).
  - default false
- scaffoldvalue: *\<bool>*
  - Analog für den Prozentwert.
  - default false
- scaffoldpercentage: *\<bool>*
  - Analog für den Prozentsatz.
  - default false

### Zustand: strapwork

- size: *\<float>*
  - stellt generelle Größe von Container und Polygonen ein
  - default 1
- sepsize: *\<float>*
  - stellt generelle Größe der Trennstriche (Separatoren) und des Reset-Buttons ein
  - default 1
- polys: *\<list>*
  - dient der genaueren Konfiguration der Basis-Polygone. Hier werden in einer Liste die Ecken der verfügbaren Polyone (und damit auch die Anzahl an Polygonen) definiert, e.g. [3,3,4,4] erzeugt zwei Dreiecke und zwei Vierecke (in verschiedenen Farben)
  - default [0,3,6]: Kreis, Dreieck, Viereck
- polycolors: *\<list>*
  - genaue Konfiguration der Farbe jedes Basis-Polygons. Muss mindestens so viele Einträge enthalten, *\<polys>* gibt.
  - Farben: 
    1. blau
    2. dunkelblau
    3. rot
    4. grün
    5. violett
    6. grau
    7. schwarz
  - default: [1..100]
- rows: *\<int>*
  - Anzahl der Zeilen/Streifen eines Containers
  - default 1: Eine Zeile
- state: *\<list of strings>*
  - Definiert, welche der über **vertices** und **colors** definierten Polygone im Container beim Start enthalten sein sollen.
  - **Beispiel**: Für **vertices**=[0,3,4] sowie **rows**=3 stellt ["1,2,2", "3,3,3", ""] den Container so ein, dass im ersten der drei Bänder die Polygone Nummer 1-2-2 enthalten sind (also Kreis-Dreieck-Dreieck), im zweiten Band 3-3-3 (Viereck-Viereck-Viereck) und das dritte Band leer ist.
  - default ["", "", ...]
- limit: *\<list>*
  - Definiert, wie viele Polygone pro Band 
    - Init Zustand **fontsize**: erlaubt sind. Muss (mindestens) so viele Einträge beinhalten wie **row** vorgibt. -1 für unendlich langes Band. Z.B. [3,5,-1] für 3 Container in die 3, 5 und unendlich viele Polygone psasen (von unten nach oben)
  - default [10,10,...] (potenziell 100 Bänder)
- interactable: *\<string>*
  - Konfiguriert, mit welchen Teilen des Containers interagiert werden kann, i.e. ob dort Polygone/Trennstriche verschoben, hinzugefügt oder entfernt werden können.
  - Gesteuert wird das über die Buchstaben **"c"** (Container), **"p"** (Polygon) und **"s"** (Separator/Trennstrich)
  - **"cps"** (default, s.u.) lässt also alles interagierbar
  - **"cp"** lässt nur den Container selbst und die Polygone interagierbar. Mit den Trennstrichen kann nicht interagiert werden
  - Restliche Kombinationen analog
  - default "cps"
- sepstate: *\<string>*
  - Definiert an welchen Stellen ein Trennstrich (Separator) initialisiert werden soll. Wird mit komma-getrennt Ganzzahlen angegeben, wobei jede Zahl angibtm wie viele Polyone links davon sind. Die Angbae\*\*"1,3,5"\*\* erzeugt einen Separator nach dem ersten, dritten und fünften Polygon. Diese werden auch erzeugt, falls nicht so viele Polygone im Container existieren.
  - default **""** (leer)
- patternlimit: *\<int> 
  - Limitiert, mit wie vielen Polygone der Mustercontainer gefüllt werden kann. **-1** erzeugt einen beliebig verlängerbaren Container. Das Limit bezieht sich (im Gegensatz zu **limit**) auf jede Zeile des Mustercontainers.
  - default: 5
- patternstate: *\<list of strings>*
  - Definiert, welche der über **vertices** und **colors** definierten Polygone im Mustercontainer beim Start enthalten sein sollen.
  - analog zu **state** (s.o.)
  - default ["", "", ...]
- drawpatterncontainer: *\<bool>*
  - true, wenn Mustercontainer gezeichnet werden soll.
  - default true
- drawseparator: *\<bool>*
  - Trennsymbol an der linken Seite eines Containers anzeigen (true) oder nicht (false)
  - default true
- drawborders: *\<bool>*
  - Rahmen um Polygone zeichnen (true) oder nicht (false)
  - default true
- drawresetbutton: *\<bool>*
  - Reset Button anzeigen (true) oder nicht (false)
  - default true
- buttonsize: *\<float>*
  - Größe des Reset-Buttons
  - default 1
- polypadding: *\<float> 
  - Abstand zwischen den Polygonen in einem Band
  - default .5
- rcrows: *\<int>*
  - analog rows
  - default 1
- rcstate: *\<list of strings>*
  - analog state
  - default ["", "", ...]
- rclimit: *\<list>*
  - analog limit
  - default [10, 10, ...]
- rcsepstate: *\<string>*
  - analog sepstate
  - default **""** (leer)
- drawrccontainer: *\<bool>*
  - analog drawpatterncontainer
  - default false
- drawrcseparator: *\<bool>*
  - analog drawseparator
  - default false
- rcinteractable: *\<string>*
  - Konfiguriert, ob und womit im Referenz-Container interagiert werden kann. Gleiche Systematik wie *interactable* (s.o.), also **"c"**, **"p"**, **"s"** in beliebiger Kombination.
  - Ein leerer String macht den Referenz-Container vollständig unbedienbar.
  - Aus Kompatibilitätsgründen wird auch noch ein bool akzeptiert (**true** entspricht **"cps"**).
  - default "" (nicht bedienbar)

### Zustand: thales

#### Geometrie

- A, B, C: *\[\<float>, \<float>]*
  - Startpositionen der drei Dreieckspunkte. C ist der bewegliche Punkt.
  - default [7,5], [18,10], [12,12]
- amoveable, bmoveable: *\<bool>*
  - Ob A bzw. B ebenfalls bewegt werden können.
  - default false
- softc: *\<bool>*
  - Weiche Konstruktion: Wenn **true**, klebt C nicht am Thaleskreis und kann frei bewegt werden. Bei **false** bleibt C auf dem Kreis.
  - **Achtung**: Die Bedeutung wurde in Version 7 umgedreht. Frühere Konfigurationen mit explizitem *softc* verhalten sich danach umgekehrt.
  - default true
- snap: *\<bool>*
  - Beim Bewegen von C auf den rechten Winkel einrasten.
  - default true
- snappingdifference: *\<float>*
  - Fangbereich um den rechten Winkel, in Grad.
  - default 5
- generalsnapsize: *\<float>*
  - Zusätzliches Einrasten auf Vielfache dieses Winkels, in Grad. 0 schaltet es ab.
  - default 5
- generalsnapdifference: *\<float>*
  - Fangbereich dafür, in Grad.
  - default .5
- drawcircle: *\<bool>*
  - Thaleskreis zeichnen.
  - default true
- drawcenter: *\<bool>*
  - Mittelpunkt M zeichnen.
  - default true

#### Bedienelemente

- showstampbutton, showundobutton, showresetbutton, showconstructionbutton, showhelpbutton: *\<bool>*
  - Einzelnes Ein- und Ausblenden der Schaltflächen (Stempel, Rückgängig, Zurücksetzen, Konstruktionsart, Hilfe).
  - default true
- drawtogglealpha, drawtogglebeta, drawtogglegamma, drawtogglegamma1, drawtogglegamma2, drawtogglevalues: *\<bool>*
  - Einzelnes Ein- und Ausblenden der Winkel-Schalter.
  - default true
- showalpha, showbeta, showgamma, showgamma1, showgamma2, showanglevalues, showhelp: *\<bool>*
  - Zustand dieser Schalter beim Start. Wirkt auch dann, wenn der jeweilige Schalter ausgeblendet ist.
  - default false, außer *showgamma* und *showhelp* (true)

#### Stempeln und Spur

- stampmode: *\<string>*
  - **"stamp"** setzt einzelne Stempel, **"trace"** zeichnet eine durchgehende Spur.
  - default "stamp"
- stampbuttonimage: *\<string>*
  - Symbol der Schaltfläche, **"stamp"** oder **"measure-angle"**.
  - default "stamp"
- stickstampbuttontopoint: *\<bool>*
  - Stempel-Schaltfläche an Punkt C heften statt an fester Position.
  - default false
- showstampedpoints: *\<bool>*
  - Gestempelte Punkte anzeigen.
  - default true
- showstampedvalues: *\<bool>*
  - Liste der gemessenen Winkel anzeigen. Die Liste ist einspaltig und bei Bedarf scrollbar.
  - default true
- jumptostamp: *\<bool>*
  - Ein Klick auf einen Listeneintrag setzt C auf die zugehörige Position zurück.
  - default false
- stampgradient: *\<bool>*
  - Stempel in einem Farbverlauf einfärben, abhängig vom Abstand zum Mittelpunkt M.
  - default true
- stampgradientstrength: *\<float>*
  - Stärke des Verlaufs, aus [0,1]. 0 = kein Verlauf.
  - default .8
- stampcolor: *\[\<float>, \<float>, \<float>]*
  - Farbe der Stempel, wenn *stampgradient* false ist.
  - default [.8,.2,.2]
- drawtrace: *\<bool>*
  - Ob die Spur beim Start bereits aufgezeichnet wird.
  - **Hinweis**: Bereits gezeichnete Spurabschnitte bleiben sichtbar, auch wenn die Aufzeichnung pausiert wird.
  - default false
- tracesize: *\<float>*
  - Strichstärke der Spur.
  - default 4
- tracecolor: *\<string>*
  - Farbe der Spur.
  - default DIVOBLUE
- traceminstep: *\<float>*
  - Mindestabstand zwischen zwei Spurpunkten. Verhindert, dass bei ruhendem Stift unnötig viele Punkte entstehen.
  - default .1

#### Winkelanzeige und Beschriftung

- showcurrentanglevalue: *\<bool>*
  - Aktuellen Wert von Gamma in einem Feld anzeigen.
  - default true
- anglevaluesinline: *\<bool>*
  - Winkelwerte direkt am Winkel anzeigen statt nur in der Liste.
  - default true
- displayanglefully: *\<bool>*
  - In der Liste "γ = " mit anzeigen statt nur den Wert.
  - default false
- displayanglefontsize: *\<int>*
  - Schriftgröße der Winkelliste.
  - default 24
- defaultanglesizes: *\[\<float> x5]*
  - Radien der fünf Winkelbögen, in der Reihenfolge [α, β, γ, γ₁, γ₂].
  - default [3,3,2,3,3]
- anglelabelsize: *\<int>*
  - Basis-Schriftgröße der Winkelbeschriftungen.
  - default 18
- anglelabelgammafactor: *\<float>*
  - Faktor, um den γ größer beschriftet wird als die übrigen Winkel.
  - default 1.3
- anglelabelminscale: *\<float>*
  - Untergrenze der Verkleinerung bei kleinen Winkeln. **1** schaltet die Skalierung ganz ab.
  - default .65

#### Darstellung

- pointlabelsize: *\<int>*
  - Schriftgröße der Punktnamen.
  - default 24
- linelabelsize: *\<int>*
  - Schriftgröße der Seitennamen.
  - default 18
- linesize: *\<float>*
  - Strichstärke des Dreiecks.
  - default 1.5
- circlelinesize: *\<float>*
  - Strichstärke des Kreises.
  - default 1.5
- circlelinecolor: *\[\<float>, \<float>, \<float>]*
  - Farbe des Kreises.
  - default .3*[1,1,1] (dunkelgrau)
- imgoffset: *\[\<float>, \<float>]*
  - Versatz der Symbole auf den Schaltflächen.
  - default [0,.65]

#### Positionen

Alle folgenden Parameter werden mit **NADA** automatisch positioniert. Ein expliziter Wert überschreibt die automatische Ausrichtung – dann ist die Position allerdings nicht mehr an den sichtbaren Bereich gekoppelt und muss bei anderem Ausschnitt nachgezogen werden.

- toolbarmargin: *\<float>*
  - Randabstand der Schaltflächenleiste.
  - default .3
- backbuttoncoord, resetbuttoncoord, stampbuttoncoord, constructionbuttoncoord, helpbuttoncoord: *\[\<float>, \<float>]*
  - Positionen der einzelnen Schaltflächen.
  - default NADA
- togglerefcoord: *\[\<float>, \<float>]*
  - Bezugspunkt der Winkel-Schalter-Spalte.
  - default NADA
- gammadisplaycoord: *\[\<float>, \<float>]*
  - Position der aktuellen Winkelanzeige.
  - default NADA
- gammalistcoord: *\[\<float>, \<float>]*
  - Position der Winkelliste. Ohne Angabe steht sie rechtsbündig am Rand.
  - default NADA

## Validierung

Je nach Komponente werden verschiedene Ergebnisse zurückgeliefert, welche zur Validierung genutzt werden können. Mindestens liefert eine Komponente ihre Zustandsparameter wieder als Ergebnis zurück. Der Zugriff erfolgt grundsätzlich über \<komponentenname>\\{RESULT\_\<bezeichner>}, e.g. "**meinvam**\\{RESULT\_**x**}. Es können die üblichen Validierungsoperatoren (GREATER, EQUALS, ...) verwendet werden.
Nachfolgend die von jeder Komponente gelieferten Ergebnisse (exklusive der Zustandsbeschreibung, dazu siehe [Referenzierung](#referenzierung-divomath)):

### Validierung: distributive

(seit 5.2.3) Folgende Bezeichner können aberufen werden:

- rows            : Anzahl der eingestellten Zeilen
- cols            : Anzahl der eingestellten Spalten
- coloredrows     : Anzahl der gefärben Zeilen
- coloredcols     : Anzahl der gefärben Spalten
- cuthorizontally : bool, ob das Feld horizontal geschnitten ist
- cutvertically   : bool, ob das Feld vertikal geschnitten ist
- groupby         : Grupperinung der Elemente (ist eins von "ROW", "COLUMN", "NONE")

### Validierung: divisors

(seit 7) Eigene Validierungsbezeichner gibt es nicht. Alle Zustandsparameter werden aber als Ergebnis zurückgemeldet und können darum zur Validierung und Referenzierung genutzt werden, insbesondere:

- blobs   : Anzahl der Plättchen
- divisor : eingestellte Gruppengröße

### Validierung: numbercards

(seit 1.0.0) Die Bezeichner beginnen stets mit "nc" (numbercard) gefolgt von einer Zahl (1,2,...), welche die Zahlenkarte identifiziert. Die Bezeichnungen beginnen entsprechend mit nc1, nc2, ... in Abhängigkeit davon, auf welchen Wert der Parameter cards im [Zustand](#1-numbercards) gesetzt wurde. Diesem Prefix folgt ein Unterstrich (\_), wiederum gefolgt von einem Bezeichner.

- nc1 \<int>: 
  - Wert der Zahlenkarte
- nc1_E \<int>: 
  - Wert der Einerstelle der Karte
- nc1_Z, nc1_H, nc1_T, nc1_ZT, nc1_HT, nc1_M, nc1_ZM, nc1_HM \<int>: 
  - Analog für Zehner, ..., Hundermillion(er)
  - Ab Milliardenstelle bezeichnung numerisch (10, 11, 12...)
- nc1_unfolded \<bool>: 
  - Karte aufklappt (true) oder zusammengefaltet (false)

### Validierung: percentagebar

> BISHER KEINE

### Validierung: thales

> BISHER KEINE

### Validierung: strapwork

(seit 1.0.0, letzte 3.0.0) Für die Validierung kann der Inhalt jeder Position in jedem Container abgefragt werden. Der abzufragende Schlüssel einer Position enthält die Bandnummer und die Position, genauer ist der Schlüssel "\<bandnummer>.\<position>".

Ist das **fünfte** Polygon im **ersten** Band gesucht ist der Schlüssel entsprechend "**1.5**". Der zugehörige Wert ist die ID des "Basis-Polygons", sprich desjenigen Polygons aus der unteren Zeile, das an dieser Stelle steht. diese werden von links nach rechts von 1 an durchnummeriert. Kommt für den Schlüssel **1.5** also der Wert **3** zurück, befindet sich an dieser Stelle das dritte Basis-Polygon (von links). Kommt als Wert eine **0** zurück ist an der Stelle ein Trennstrich.

Zusätzlich kann eine ganze Reihe referenziert werden analog zu oben als String. Soll in der 1. Zeile (Schlüssel: **row1**)beispielsweise eine Folge von 5 mal dem *ersten* Polyon stehen dann wäre der zugehörige Wert **11111**. Bei mehrreigen Bändern sind die Schlüssel der Zeilen entsprechend nummeriert als **row1**, **row2** etc.

## Referenzierung (divomath)

Jede Komponente kann in ihrem Zustand grundsätzlich Werte anderer Komponenten verwenden, um ihren eigenen Zustand zu definieren. Auf diese Weise können auch die unter [Validierung](#validierung) aufgeführten Zustandsdefinitionen überschrieben werden. Dafür sucht jedes VAM nach Bezeichnern, die denen der unter [Validierung](#validierung) aufgeführten entsprechen, aber mit zwei Unterstrichen ("\_\_") beginnen. Hat ein VAM bspw. einen Zustand mit der Bezeichnung *"size"*, dann kann dieser durch *"\__size"* überschrieben werden.

**Wo die Referenzen stehen dürfen**: Die Referenzen dürfen nur **top level** definiert werden, nicht im cindyjs Objekt. Dennoch sucht CindyJS auch dort nach Referenzen. Diese werden aber scheinbar nicht korrekt weitergereicht.

**Priorität**: Ein Wert, der als Referenz gesetzt wurde, schlägt den gespeicherten Zustand und die Editor-Vorgabe. Eine eigene, auf derselben Folie bereits abgegebene Antwort schlägt allerdings auch die Referenz.

### Beispiel

Am Bsp. der numbercards: Es seien zwei Folien gegegeben mit den Namen *"ZAHLENKARTEN"* und *"ZAHLENKARTEN-2"* auf denen jeweils die VAM-Komponenten *"vam-karten"* bzw. *"vam-karten2"* angelegt sind. Nachfolgend ein möglicher Zustand von *"vam-karten2"*, um auf das vorige VAM zuzugreifen.

``` yaml
# --- Im Zustand von "vam-karten2"
# Die Referenzen stehen im cindyjs-Objekt und ueberschreiben die
# darunter definierten Werte.
__value: ZAHLENKARTEN/vam-karten/{RESULT_value}
__unfold: ZAHLENKARTEN/vam-karten/{RESULT_unfold}
cindyjs:
  cards: 1
  x:
    - 3
  y:
    - 15
  value:
    - 12123
  edit:
    - tttff
  unfold:
    - true
  color: false
  colortoggle: true
  alpha: 0.5
  separator: .
```

Die beiden `__`-Zeilen sind dabei die Referenz auf *"vam-karten"*. Dort wird der *"value"* der Zahlenkarte übernommen, sowie der Zustand, ob die Karte eingeklappt ist oder nicht. Dies überschreibt auch die Zustandsdefinition weiter unten, in der *"value"* auf `12123` gesetzt wird und *"unfold"* auf `true`.

Dieselben Referenzen können auch auf Top-Level stehen (also neben `cindyjs:` statt darin). Das funktioniert im Viewer, im Editor aber nicht – siehe Hinweis oben.

### Sonstiges

Prinzipiell können so auch die Ergebnisse anderer Komponenten in divomath verwendet werden, etwa eines anderen VAMs, eines Textfeldes oder dergleichen. **Diese Funktion ist aber nicht getestet!**

## Standalone-Betrieb (abako.dzlm.de)

Dieselbe Datei lässt sich auch ohne divomath verwenden. Die Konfiguration
läuft dann über URL-Parameter, die Namen sind identisch zu den unter
[Zustand](#konfiguration-des-zustands-eines-vams) beschriebenen.

```
https://abako.dzlm.de/cindy/vam/divoVAM.html?vam=percentagebar&basevalue=120&barvalue=0.5
```

Einen solchen Link erzeugt die Editor-Seite unter
<https://abako.dzlm.de/cindy/vam/> über ein Formular je VAM. **Das ist der
empfohlene Weg** – die HTML-Datei selbst muss dafür nicht bearbeitet werden.

### Darstellung

- **?full**
  - Der Canvas füllt das Browserfenster statt der festen Größe 885 x 519.
  - **Achtung**: Bei Einbettung in Articulate Storyline **nicht** verwenden.
    Ohne feste Canvasgröße hängt das Größenverhältnis von Schrift und
    Objekten von der Einbettung ab, und die Darstellung wird unvorhersehbar.
- **?rect=\<preset>**
  - Wählt den sichtbaren Weltausschnitt. Zulässig: **divomath** (24.5 x 18.9,
    Voreinstellung), **classic** (38.2 x 22.1), **wide** (der Ausschnitt der
    früheren Datei `divoVAM-full.html`).
- **?rect=a,b,c,d**
  - Freier Ausschnitt als vier Zahlen [links, oben, rechts, unten]. Bei
    ungültiger Angabe greift die Voreinstellung.

`divoVAM-full.html` existiert weiterhin und leitet auf `divoVAM.html?full&rect=wide`
weiter, damit bestehende Links funktionieren.

### Freihandzeichnen

Ein Stiftwerkzeug, das sich als zweite Zeichenfläche über das VAM legt: drei
Stiftfarben, Radierer, ein- und ausklappbare Werkzeugleiste. In divomath wird
so etwas von der Plattform bereitgestellt, im Standalone-Betrieb nicht – daher
diese Option.

- **?draw**
  - Schaltet das Werkzeug ein.
  - **Voraussetzung**: `freehand-drawing.js` muss neben der HTML-Datei auf dem
    Server liegen. `build.py` legt sie mit ins Ausgabeverzeichnis.
- **?drawpen=\<int>**
  - Strichstärke des Stifts in Pixeln. Voreinstellung 2.
- **?drawerase=\<int>**
  - Kantenlänge des Radierers in Pixeln. Voreinstellung 20.
- **?drawpos=\<x>,\<y>**
  - Position des Stift-Knopfs, relativ zur Zeichenfläche (Werte aus [0,1]).
    Die Werkzeugleiste klappt von dort aus in die mit *drawdir* gewählte
    Richtung auf. Voreinstellung 0.4,0.05.
- **?drawdir=\<richtung>**
  - Richtung, in die sich die Leiste öffnet: **right**, **left**, **up** oder
    **down**. Voreinstellung right.
- **?drawmoveable**
  - Erlaubt es, die Werkzeugleiste zu verschieben.

**Hinweise zur Bedienung:** Solange der Stift aktiv ist, liegt die Zeichenfläche
über dem VAM – dieses ist dann nicht bedienbar. Ein erneuter Klick auf den
Stift-Button gibt es wieder frei. Die Zeichnung bleibt dabei sichtbar.

**Achtung**: Die Zeichenfläche wird beim Laden positioniert und folgt einer
späteren Änderung der Fenstergröße nicht.

## Changelog

### v7
- GENERAL:
  - Build-Prozess vereinheitlicht: **build.py** erzeugt aus einem Cinderella-Export und der zugehörigen .cdy beide Zielformate (gepatchte HTML für abako, vam.cdyjs für divomath) in ein out-Verzeichnis
  - Skripte werden aus dem .cdy-Archiv gelesen, nicht mehr aus dem HTML-Export (der lässt Skripte weg)
  - HTML-Export wird beim Build gepatcht: touch-action gegen das iPadOS-"Kritzeln", **?full** für fensterfüllende Darstellung, **?rect=** zur Wahl des sichtbaren Weltausschnitts – eine Datei statt zwei
- FRAMEWORK:
  - **ENVIRONMENTALPARAMS** als einheitliche Konfigurationsschnittstelle. **defaultstateto()** und die separaten `if(!ISDIVOMATH, ...)`-Blöcke entfallen in allen VAMs, stattdessen **default to()**
  - **VISIBLERECT** als Layout-Bezugsrechteck eingeführt (mit **VRTOPLEFT**, **VRTOPRIGHT**, **VRBOTTOMLEFT**, **VRBOTTOMRIGHT**). In divomath fest, sonst aus dem tatsächlichen Ausschnitt abgeleitet. Alle VAMs positionieren daran statt an screenbounds()
  - **FONTSCALE** eingeführt: Schriftgrößen sind in Pixeln definiert, alles andere in Welteinheiten – der Faktor hält das Verhältnis unabhängig von Canvasgröße und Ausschnitt konstant
  - **to json()** und **escape json()** hinzugefügt. Der divomath-State wird jetzt explizit serialisiert statt per Stringverkettung – Cinderella und CindyJS behandelten Strings in Dicts unterschiedlich, was in divomath zu Syntaxfehlern führte. Die VAMs setzen darum keine QUOTEs mehr von Hand
  - **divomath put result()** serialisiert den Wert ebenfalls über to json(). Undefined und Listen kommen damit korrekt an
  - Referenzierung: Dunder-Schlüssel werden jetzt im cindyjs-Objekt **und** auf Top-Level gesucht (cindyjs gewinnt), und das Präfix wird beim Ablegen entfernt – vorher landete der Wert unter einem Schlüssel, den niemand liest
  - Textausgabe neu gebaut: **draw label()** und **draw boxedlabel()** mit **mod'**-Modifier-Konvention (mod'font, mod'color, mod'bold, mod'alpha, mod'bgcolor). **draw textbox()** bleibt als Alias erhalten
  - Button: Label wird jetzt korrekt in der Hitbox zentriert, unabhängig von Schriftart und -größe. Gezeichnete Symbole (**drawplus**, **drawminus**, **drawcross**) statt Sonderzeichen, die sich nicht sauber zentrieren lassen
  - ImageButton: Bildgröße wird aus der Buttongröße abgeleitet (**imgfill**) statt über einen festen scale-Faktor, der von der Auflösung abhing
  - **list()**: Objekt-Zweig wieder entfernt – er zerlegte ein einzelnes VAM-Objekt in seine Feldwerte. Für diesen Zweck **values()** verwenden
- VAM:
  - **thales** (neu): Satz des Thales mit beweglichem Punkt C, Winkelbögen, Stempeln und Spur
    - Winkelliste einspaltig und scrollbar, folgt automatisch neuen Einträgen
    - Winkel- und Seitenbeschriftungen über generische Funktionen, Position hängt jetzt am Öffnungswinkel statt an handjustierten Offsets
    - Beschriftungen skalieren einheitlich und gedämpft (**anglelabelsize**, **anglelabelgammafactor**, **anglelabelminscale**)
    - Spur als Segmente: Pausieren löscht das Gezeichnete nicht mehr, Undo entfernt genau den letzten Abschnitt (**tracesize**, **tracecolor**, **traceminstep**)
    - Farbverlauf der Stempel korrigiert und konfigurierbar (**stampgradient**, **stampgradientstrength**, **stampcolor**)
    - **softc** dreht seine Bedeutung um: true = weiche Konstruktion (**Achtung**, bestehende Konfigurationen)
    - Reset- und Rückgängig-Button einzeln ausblendbar (**showundobutton**, **showresetbutton**), **showhistorybuttons** entfernt
  - percentagebar:
    - Fix: **numberofbars** und alle übrigen URL-Parameter wirkten nicht mehr (ENVIRONMENTALPARAMS wurde nach dem Einlesen überschrieben)
    - Fix: Snapbar wirkte nur auf den letzten Streifen; richtet sich jetzt nach den Schritten des jeweiligen Streifens und rastet nicht mehr ein, wenn die Schritte ausgeblendet sind
    - Bögen und Schrittanzeige gekoppelt
    - **alwaysdrawarches** ist jetzt Startwert des Schalters statt permanenter Überschreibung – der Schalter bleibt sichtbar und bedienbar
    - **overflow** und **hidetoggles** als Parameter hinzugefügt
    - Fix: Overflow-Verhalten der Plus-Taste war inkonsistent zu Ziehen und Direkteingabe
  - distributive:
    - Termdarstellung generisch aufgebaut: Klammern verschwinden, sobald zerschnitten wurde; nach dem Zusammenrücken auf "nix" erscheinen die Anzahlen statt der Malaufgaben
    - **requiregrouping** hinzugefügt: Färben und Zerschneiden erst nach Wahl einer Zeilen- oder Spaltenstruktur
    - Fix: **coloredcolindex** wurde beim Speichern nicht zurückgerechnet – der Wert kippte bei jedem Folienwechsel zwischen zwei Zuständen
    - Fix: Schnitte wurden beim Wiederherstellen umgeschaltet statt gesetzt
    - Fix: **cuthorizontally**/**cutvertically** waren nicht auswertbar, wenn sie false waren
    - Performance: Atome werden als Polygonzug gezeichnet statt als CSG-Vereinigung aus Kreisen und Rechtecken
  - strapwork:
    - Fix: Container ragte über den sichtbaren Bereich hinaus; die Platzberechnung greift jetzt auch bei endlichen Limits
    - Fix: Zu wenige Limit-Einträge führten zu Index-Fehlern
    - Fix: Validierung meldete an Trennerpositionen eine 0 statt des Polygons – Polygon und Trenner nutzten denselben Schlüssel
    - Fix: **rcstate** richtete sich nach **rows** statt nach **rcrows**
    - **rcinteractable** akzeptiert jetzt dieselbe Schreibweise wie **interactable**
  - divisors:
    - Fix: Plättchen wurden keinem Band zugeordnet, Endlosschleife beim Umsortieren
    - UI unterhalb der Bänder hängt an VISIBLERECT statt an festen Koordinaten
    - Rechnung wird als ein Text gesetzt statt aus vier gemessenen Fragmenten
    - **fontsize** hinzugefügt
  - numbercards:
    - Fix: Bei mehreren Karten erbten spätere Karten die Stellenkarten der früheren
    - Fix: Klicks auf die Plus/Minus-Knöpfe der Stellenkarten wurden nur zufällig erkannt
    - Fix: Schulschrift wurde nie verwendet (falscher Konstantenname)

### v5.194
- GENERAL:
  - Versionssystematik geändert zu <main>.<build> (momentan version 5, build 194)
  - Build erhöht sich über Versionen hinweg
- FRAMEWORK:
  - helper functions:
    - Funktionen zum Zeichnen von Kreisbögen (basierend auf einem Winkel) hinzugefügt **arc(), drawarc(), drawclosedarc(), drawangle()**
    - Convenience Funktionen (**vectorlength(), normalize(), todeg(), torad()**)
    - Convenience overwrite für drawtextbox hinzugefügt
    - numerals Funktion geändert: GIbt jetzt numeral von IRGENDEINER Zahl zurück nach Normung des Dudens (hinsichtlich Leerzeichen etc.)
    - Wrapper für divomath Funktionen hinzugefügt (**divomathPutResult()** für **divomathAddResult()**)
    - Sortierung in **defaultstateto()** geändert, sodass zuerst letztes divomath result herangezogen wird, danach erst overwrites
- VAM:
  - percentagebar:
    - Fix: Toggle Button "label" zeigte nicht die angegebene Einheit
    - Fix: "Eingabe P" Textfeld zeigte nicht die richtige Zahl
    - Fix: Verschiedene falsche Berechnungen bei der Interaktion der verschiedenen TextInputs
    - Parameter zur Konfiguration der Position des Prozentstreifens hinzugefügt
  - strapwork:
    - Resizing Verhalten des Reset Buttons geändert
    - Resizing Verhalten des Separators geändert
    - Fix: Separator reportete nicht richtig seine Position in Relation zu den Polygonen seines Containers
    - Reset Button resettet jetzt auf referenzierten Zustand
    - Handle zum individuellen Konfigurieren der Skalierung des Separators hinzugefügt (**sepsize**)
    - **interactable** handle zu String geändert, damit verschiedene Teile darüber (nicht-)interaktiv geschaltet werden können
    - Größeren Kreis and die Hitbox des Separators gebaut zum einfacheren Greifen
    - Fix: Separator übermittelt den State wo er gedropped wird, nicht wo er danach einsortiert wird (selbst wenn an der Stelle keine Polygone sind)
    - Zeichenreihenfolge der Polygone geändert
### v5.2.3
- VAM:
  - distributive:
    - divomath state und result reporting implementiert (Validierung und Referenzierung)
### v5.2.0
- VAM:
  - distributive:
    - Init Zustand **groupby**: Initialer Gruppierungszustand
    - Init Zustand **expressionposition**: Position der Term-Anzeige
    - Init Zustand **expressionmoveable**: Term beweglich oder nicht
    - Init Zustand **verbalposition**: Position der verbalen Termbeschreibung
    - Init Zustand **verbalmoveable**: verbale Termbeschreibung beweglich oder nicht
    - visuelle Linie zeigt Zerschnitten-Zustand zusätzlich zu Abstand an
    - Darstellung der Texte geändert
    - Fix: einige String URL-Parameter nicht mehr parsen (gibt sonst NADA)
    - gelöscht: Init Zustand **lblpadding**

### v5.1.0
- VAM:
  - distributive:
    - Init Zustand **fontsize**: Schriftgröße für Term und verbale Beschreibung
    - Init Zustand **drawexpression**: Term anzeigen
    - Init Zustand **drawverbal**: Verbale Beschreibung des Terms anzeigen
    - Init Zustand **drawtoolbutton**: Tool Button (nicht) anzeigen
    - Init Zustand **tool**: Bei Start eingestelltes Tool
    - Init Zustand **toolbuttonx**: x-Koordinate des Tool Buttons
    - Init Zustand **toolbuttony**: y-Koordinate des Tool Buttons
    - Init Zustand **groupingtype**: Welche Gruppierungen sind mit Klick möglich (Keine, Zeile, Spalte, Beide)

### v5.0.0
- FW:
  - constants:
    - Bild von kreisförmigen Button zu ICONS hinzugefügt
- CLASS:
  - Button:
    - Subklasse ImageButton() hinzugefügt
- VAM:
  - strapwork:
    - Fix: Scrollbar überlagert den Reset Button
    - Fix: Scrollbar wird nicht ordnungsgemäß beim Start angezeigt, wenn Container zu voll
    - Dreieck-Polygon wurde als zu groß geändert. Skaliert mit .9
    - Init Zustand **patternstate**: Zustand des Patterncontainers
    - Init Zustand **drawresetbutton**: Reset Button (nicht) anzeigen
    - Init Zustand **interactable**: Mit Container kann (nicht) interagiert werden

### v4.3.0
- VAM:
  - strapwork:
    - Referenzcontainer hinzugefügt

### v4.1.0
- VAM:
  - distributive:
    - neue Logik für das Färben. Jetzt färbt das Zeichnen einer Zeile die zugehörigen Spalten und umgekehrt.
    - divomath Zustandskontrollelemente hinzugefügt.
- FW:
  - constants:
    - VALUEMAP hinzugefügt, welche die Zahlwörter den Zahlen von 1 bis 12 zuordnet
  - helper functions:
    - numerals(\<int>) hinzugefügt: Gibt von einer Ganzzahl das zugehörige Zahlwort zurück, wenn die übergebene Ganzzahl kleiner als 13 ist. Gibt ansonsten die Zahl selbst (als Zahl) zurück.

### v4.0.0
- VAM:
  - neues VAM: (percentagebar, ) distributive
  - divisors: 
    - Workaround für divomath Problem, des nicht korrekten Zurückmeldens der Zustands-Werte implementiert
  - strapwork: 
    - Workaround für divomath Problem, des nicht korrekten Zurückmeldens der Zustands-Werte implementiert
    - Fix: Separator wird in Ergebnis für ganze Zeile nicht mit reportet.
    - Fix: Polygone wurden falsch umgeordnet, wenn mit Mustercontainer eingefügt
    - divomathUpdateResults() wird auch bei Update eines Separators ausgeführt
    - Hintergrund der Basispolygone von Gold zu einem dunkelgrauen Rand geändert
    - Kopien des Separators in hellerem Grau als Ur-Separator
    - Reset Button resettet jetzt auch Separators
    - Reset Button setzt in divomath auf den über den Editor konfigurierten Zustand zurück, nicht den letzten Zustand beim Folienaufruf
    - PatternContainer ist jetzt Multiline
    - PatternContainer kann jetzt ein Limit bekommen, Zustandvariable **patternlimit** hinzugefügt.
- CLASS:
  - Button: 
    - Fix: Falsche Farbdarstellung
    - Feature: isfloating flag, um Verschiebbarkeit des Buttons zu togglen
- FW:
  - draw: 
    - Debug Infos angepasst
    - 'firstdraw flag zum tracken, ob erster Aufruf der draw Funktion stattfindet
  - constants: 
    - Bilder hinzugefügt und entsprechende Konstante für Bildreferenzen (ICONS)
    - CDOT geändert, enthält jetzt Leerzeichen davor und danach
  - divomathconfig: 
    - usedivomath als flag für Wechsel zu storyline/web-config hinzugefügt
    - 'dmdefaultstate hinzugefügt, für direkten Zugriff auf das cindyjs-Objekt aus der divomath Editor Zustandsbeschreibung. Im Gegensatz zu 'dmstate, dem zuletzt gespeicherten Zustand beim Verlassen einer Seite.
  - helper functions: 
    - inpoly(): Check hinzugefügt, ob Lösung von linearsolve() definiert ist
    - +postValue(): postet eine Nachricht zur KOmmunikation mit dem Browser (oder dem SL-Player)
    - +incircle(): Checkt, ob ein Punkt in einem Kreis liegt
    - +getURLparam() und getURLparams(): Holt URL Suchparameter aus URL und übergibt gibt sie zurück
  - configuration: 
    - +'urlparams: Speichert alle URL Suchparameter als Dict.
    - vam switch für auszuspielendes VAM über 'urlparams konfigurierbar
    - 'debuglevel ebenfalls
    - debugging output hinzugefügt
  - mousedown: 
    - variable mousedown auf true setzen
  - mouseup: 
    - variable mousedown auf false setzen
  - keydown: 
    - "k/K": manueller Aufruf von divomathUpdateResults()
    - "+/-": Inkrementieren und Dekrementieren von 'debuglevel (nur Numblock?)
- build Prozess des divomath codes in separates Skript ausgelagert

### v3.1.0

- VAM: 
  - divisors: 
    - Fix: UI unten wird durch eine waagerechte Gerade optisch vom oberen Teil getrennt, nicht durch ein Rechteck
    - Fix: Blobs werden beim Erzeugen zufällig im Viewport der Welt angelegt, nicht irgendwo auf dem Bildschirm
    - Buttons sind jetzt einzeln ausblendbar (~~drawbuttons~~ --> drawblobbuttons & drawdivbuttons)
    - Vertikaler Balken zur Einstellung des Divisors ein-/ausblendbar (drawbar)
    - default timing von 1 auf .5 geändert
    - fix: Balken verschwindet, wenn die Seite neu geladen wird
  - numbercards: 
    - Fix: Alpha Wert wird auf 1 gesetzt, wenn Seite neu aufgerufen wird
    - Fix: Zeige immer Placecards, auch beim Start oberhalb der Numbercard
    - Fix: Falsche Farben und Farbwechsel, wenn zusammengeklappt wird (war falsch in constants definiert)
    - Aufruf von divomathUpdateResults() an Knopfdrücke gebunden
    - Workaround für divomath Problem, des nicht korrekten Zurückmeldens der Zustands-Werte implementiert
  - strapwork: 
    - Musterfolgencontainer nicht mehr fix in seiner Größe. Größe passt sich an den Inhalt an.
    - Aussehen des Separators angepasst (Ellipse statt Kreis)
    - Aufruf von divomathUpdateResults() an movepolysintoplace() Methode gebunden
    - divoYellow farbenen Hintergrund für Grundpolygone eingefügt
    - Layout angepasst (Container unten, Patterncontainer oben)
    - Submission reporting für ganze Zeile (als row1, row2, ...) hinzugefügt
- FW: 
  - global drawing: 
    - Aufruf von divomathUpdateResults() wenn 'fristdraw==true
  - configuration; 
    - 'firstdraw flag hinzugefügt, die am Ende des drawscripts false gesetzt wird.
  - constants: 
    - DIVOYELLOW als Farbe hinzugefügt
    - Fix: Farbdefinition von DIVORED und DIVOBLUE getauscht (waren falschherum)
  - helper functions: 
    - values() hinzugefügt: Gibt Werte aller Keys eines Objekts als Liste zurück
    - ellipse() hinzugefügt: Zeichnet Ellipsen basierend auf Achsen und Drehwinkel
    - defaultto() hinzugefügt: Weist einer Variablen einen Standardwert zu
    - defaultstateto() hinzugefügt: handlet divomath Zustand Definition aus verschiedenen Quellen
    - getboundingbox(3) mit neuer Definition überladen
    - label bg aus drawtextbox() entfernt --> funktioniert in HTML aus irgendwelchen Gründen nicht
    - tobool() und isbool() Funktionen hinzugefügt um in bool zu konvertieren und Typ einfach zu prüfen
  - **new** *keypressed*
    - hauptsächlich für debugging, zeigt momentan auf Druck von "k" einige hauptsächlich divomath-spezifische Infos an.
- CLASS: 
  - Button: 
    - Attribute labelheight und fontfamily hinzugefügt
  - TextInput: 
    - Attribute labelpadding und fontfamily hinzugefügt

### v3.0.0

- neues VAM: percentagebar als preview
- VAM: 
  - divisors: 
    - Konfiguration für Darstellung der UI Buttons hinzugefügt (**drawbuttons**)
    - Fix: **color** Konfiguration
  - numbercards: 
    - Farbbutton geändert. Ist jetzt grau, wenn auch die Karten grau sind und farbig, wenn die Karten farbig sind.
    - Klickverhalten der Numbercards geändert: 
      - Kinder Placecards werden nicht mehr nach der Animation gelöscht um eine Gesamtkarte zu bilden. Stattdessen bleiben die Placecards erhalten werden nur in der Position animiert. (~ Zeile 503, setpropertylater() auskommentiert)
      - Farben werden auch nicht mehr gefadet beim aus- und einklappen. Placecards (und Farben) sind auch im zusammengeklappten Zustand sichtbar. (~ Zeilen 523 & 562 auskommentiert, Animationskonstrukt aber erhalten)
  - strapwork: 
    - RegPolys sind "gleichgroß". Bei Polygonen mit gerader Eckenzahl sind gegenüberliegende Kanten 2*RADIUS weit entfernt, bei ungerader Eckenzahl, ist jede Ecke von ihrer gegenüberliegenden Kante 2*RADIUS weit entfernt. Vorher hatten alle den gleichen Umkreis mit RADIUS.
    - RegPolys werden mit der unteren Kante parallel zur x-Achse ausgerichtet, es sei denn, "rotation" wird spezifiziert (nicht dm-konfigurierbar)
    - Ist das RegPoly ein Kreis, wird es nicht mehr als Kreis verwaltet, sondern ein 100-Eck. Der Einheitlichkeit wegen. "shape" und "draw" entsprechend angepasst
    - dm-config: 
      - **vertices**: Polygone können nur noch als Liste an Ecken angegeben werden, nicht mehr Alternativ als Anzahl. Es geht also nur noch e.g. [3,6,9] Für ein Drei-, Sechs- und Neuneck. Nicht mehr e.g. "4", um vier Polygone mit steigender Anzahl Ecken zu bauen (Kreis, Dreieck, Viereck, Fünfeck)
      - **colors**: Analoges gilt für Farben. Es *MUSS* eine Liste angegeben werden, die die gleiche Länge hat wie **vertices** oder GAR NICHTS. Dann wird die Liste [1,2,3,...] verwendet (Standardreihenfolge der DIVOMATH Farbpalette).
      - NEU **state** ([ ] \<string>): Definiert, welche der über **vertices** und **colors** definierten Polygone im Container beim Start enthalten sein sollen. Für **vertices**=[0,3,4] sowie **rows**=3 stellt ["1,2,2", "3,3,3", ""] den Container so ein, dass im ersten der drei Bänder die Polygone Nummer 1-2-2 enthalten sind (also Kreis-Dreieck-Dreieck), im zweiten Band 3-3-3 (Viereck-Viereck-Viereck) und das dritte Band leer ist.
      - NEU **drawpatterncontainer** (\<bool>): true, wenn PatternContainer gezeichnet werden soll.
      - **borders** in **drawborders** umbenannt. Funktion gleich.
  - FW: 
    - mousedown Handler: 
      - Zeile 41 entfernt, die dafür sorgt, das hottes Element nach vorne geholt wird. Holt sonst bei **strapwork** im Zweifel Container vor Polygone. 

        > **@Todo**: Durch Layer-System und "movetofront" Attribut austauschen (mit Ulli abstimmen, geht das rückwärtskompatibel?!).
  - CLASS: 
    - Scrollbar: 
      - "script" wird nicht mehr auf "moveend" getriggered (zusätzlich zu "move"), sondern bei "click" (zusätzlich zu "move"), da sonst immer der "value" VOR der Änderung verwendet wird.

### v2.1.1

- VAM: 
  - numbercards: 
    - Fix: Anordnung der Montessorifarben korrigiert
    - Fix: divomath Einstellung, ob eine Karte eingeklappt dargestellt wird oder nicht ("unfold" Attribut)
  - divisors: 
    - neue divomath Konfiguration: "stripmargin"
    - divomath Konfig. "padding" umbenannt in "blobmargin"
    - Ausrichtung der Polygone angepasst (ungerade #Ecken => Spitze oben, gerade => Kante oben)
    - Aussehen des verschiebbaren Balkens rechts der Bänder geändert
    - Verhalten des verschiebbaren Balkens angepasst
    - fix: verschiebbarer Balken ordnet sich beim loslassen an den Bändern an
    - Attribute "width" und "height" für Strips hinzugefügt
  - CLASS: 
    - *new* Key: 
      - Eine Taste für eine Tastatur (erbt von Button)
    - *new* Keyboard: 
      - eine (momentan nur numerische) Tastatur, die eingeblendet werden kann, wenn ein Textfeld angeklickt wird o.ä.
    - *new* TextInput: 
      - eine Quasi-Textbox, die beim Auswählen ein "Keyboard" zur Eingabe steuern kann.
    - *new* Toggle: 
      - Toggle-Button, dessen "state" als bool verwendet werden kann. Ruft bei "click" sein "script" auf.
    - *new* Scrollbar: 
      - Scrollbalken, dessen "value" zur Konfiguration anderer Komponenten genutzt werden kann.
- FW: 
  - constants: 
    - unicode für verschiedene Pfeile hinzugefügt (LEFTARROW, RIGHTARROW, ...)
  - helper functions: 
    - incircle(): Prüft, ob ein Punkt innerhalb eines Kreises liegt

### v2.1.0

- VAM: 
  - strapwork: 
    - Animationsverhalten angepasst
    - Scrollbar hinzugefügt
    - Resetbutton hinzugefügt
- CLASS: 
  - Button: 
    - "hasborder" (bool) als Attribut hinzugefügt
  - *new* Scrollbar: 
    - Eine Scrollleiste um Content zu bewegen. Beim Bewegen der Scrollbar wird deren Wert aktualisiert. Was damit getan werden soll (am Ende eines move-Events) muss über das "script"-Attribut konfiguriert werden. "max" und "min" Attribute können einzeln gesetzt werden (default: 100 bzw. 0). Zugriff auf den aktuellen Wert über das Attribut "value". "value" ändert sich linear mit der Position der Scrollbar.

### v2.0.0

- neues VAM: "divisors"
- VAM: 
  - numbercards: 
    - Fix: Als Liste übergebene Listen (z.B. für x und y) werden jetzt korrekt verarbeitet.
    - Styling angepasst: schmalerer Rand, Aus-/Einklappbutton abgerundetes Rechteck, Farbbutton pro Karte und neues Styling, neues Layout für +/- Buttons, Farben an Montessorifarben angepasst
    - Trennzeichen zwischen 3er-Gruppen von Ziffern hinzugefügt, einstellbar über Editor ("separator")
    - Dokumentation angepasst
  - strapwork: 
    - divomath Zustandsdefinition angepasst
    - Eistellbarkeit zwischen fixer und flexibler Containerlänge hinzugefügt
    - löschen der letzten Komponente bei vollem Container hinzugefügt
- FW 
  - draw: 
    - Fix: debug Funktion entfernt, die überall nadas beim debuggen gezeichnet hat
    - objpreview entfernt, wird nicht benötigt
  - constants: 
    - colors: 
      - geändert: DIVOBLUE von (120,147,194) zu (83,125,156)
      - geändert: DIVORED von (255,84,84) zu (235,85,78)
      - geändert: DIVOGREY von (165,165,165) zu (130,149,192) --> eher blau
      - hinzugefügt: MONTERED, MONTEGREEN, MONTEBLUE, MONTEGREY für Montessorifarben. Zusätzliche MONTEPALETTE als Liste aller Montessorifarben
    - VALUEMAP: weist Zahlen von 1-12 die Wörter "Einer", "Zweier" ... "Zwölfer" zu
    - HEXMAP: weist den Strings "0" bis "9" sowie "A" bis "F" bzw. "a" bis "f" die Zahlen 1 bis 15 zu
    - COLORMAP: enthält die meisten vordefinierten Farben 
      - Farben: "DARKRED", "DARKBLUE", "DARKGREEN",	"DZLMCOLORGOLD", "DZLMCOLORDARK", "PLACECOLORGREEN", "PLACECOLORBLUE","PLACECOLORRED", "DIVOGREEN", "DIVOVIOLET", "DIVOGREY", "DIVOBLACK", "DIVORED", "DIVOBLUE"
  - helper functions: 
    - list(\<any>): Erzwingt eine Liste für irgendeine Übergabe (Zahl, Objekt). nada bleibt nada, list bleibt list, String wird char array.
    - centroid: 
      - centroid(list): Berechnet den Schwerpunkt einer Liste von Punkten (geometrisches Mittel)
    - centerofmass: 
      - centerofmass(list): Berechnet das arithmetische Mittel einer Liste von Punkten
- CLASS 
  - Button: 
    - Schatten des Buttons von generischem Rechteck zur tatsächlichen Button Form (shape Attribut) geändert
    - Attribut "show", zum Ein- und Ausblenden des Buttons hinzugefügt
    - Flag "hasshadow" hinzugefügt, um das Zeichnen des Schattens steuern zu können
    - Handles für "color", "bordercolor" und "fontcolor" eingefügt

### v1.0.0

- neue VAMs: "numbercards", "strapwork"
