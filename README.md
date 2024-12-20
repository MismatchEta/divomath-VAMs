# divomath VAM Dokumentation
JS Framework zum Import als Komponente in divomath zur Verwendung von CindyJS Widgets im Editor. Nach dem Import der aktuellen Version des divoVAM Frameworks kann über die Komponente im Editor auf verschiedene CindyJS Widgets zugegriffen werden. Diese werden hauptsächlich über das [Komponentenverhalten](#komponentenverhalten) und den [Zustand](#konfiguration-des-zustands-eines-vams) konfiguriert.

## Komponentenverhalten
### Generelles Verhalten
Über das Komponentenverhalten der Framework-Komponente wird deren generelles Verhalten gesteuert (insbesondere die Auswahl eines Widgets). Die Konfiguration des gewählten Widgets findet in [Zustand](#zustand) statt. Die folgenden Einstellungen werden im Komponentenverhalten unter dem Schlüssel "configuration" vorgenommen:
- cindyJsPrefix: divomath
  - Genau so erforderlich. Wird Präfix der von divomath an CindyJS übergebenen Parameter (Komponentenverhalten und Zustand). Framework erwartet den Präfix "divomath"
- vam: *\<string>*
  - Switch für das gewünschte CindyJS Widget. Entsprechenden zulässigen [Namen](#strings-für-vam-schlüssel) verwenden
  - default "default": Zeigt Hinweis zum korrekten Komponentenverhalten an.
- debuglevel: *\<unsigned int>* 
  - Möglicherweise von einigen Widgets zum debugging verwendet. Normalerweise nicht nötig zu setzen. Sollte im Produktivbetrieb 0 sein.
  - default 0: Kein Debugging.
- bgcolor: *[\<float>,\<float>,\<float>]*
  - Hintergrundfarbe. Liste von 3 floats aus [0,1]. Repräsentieren ROT, GRÜN, BLAU Anteil des Hintergrunds.

### Strings für *vam* Schlüssel
Folgende Strings sind für *vam* Schlüssel zulässig:
- divisors (seit: 2.0.0, letzte Änderung: 2.0.0)
- numbercards (seit: 1.0.0, letzte Änderung: 1.0.0)
- strapwork (seit: 1.0.0, letzte Änderung: 2.0.0)

### Beispiel
Eine Minimalkonfiguration zur Darstellung der Zahlenkarten-Komponente ("numbercards").
<pre>
configuration:
  cindyJSPrefix: divomath
  vam: numbercards
</pre>

## Konfiguration des *Zustands* eines VAMs
Dieser Abschnitt stellt die möglichen Konfigurationen der verschiedenen VAMs dar. Diese werden grundsätzlich im *Zustand* einer Komponente vorgenommen. Die Konfigurationen sind widgetabhängig und finden unter dem Schlüssel "cindyjs" statt. Die Dokumentation hier spiegelt dabei nur den Stand der aktuellen wider. Unter Umständen wird eine Komponente in älteren Versionen anders konfiguriert.

### Beispiel
Das folgende Beispiel zeigt eine Konfiguration für das VAM *numbercards*. [Siehe unten](#zustand-numbercards) für Details.
<pre>
cindyjs:
  color: true
  colortoggle: false
  alpha: 0.2
  cards: 1
</pre>

### Zustand: divisors
- color: *[\<string>,\<string>]*
  - Repräsentiert die beiden Farben, die von der Komponente genutzt werden. Folgende Farbstrings sind zulässig:
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
  - default [DIVOGREY, DIVORED]
- size: *\<float>*
  - Größe der Blobs
  - default .7
- padding: *\<float>*
  - Abstand der Blobs in einem Band
  - default .2
- timing: *\<float>*
  - Zeit für die Animation bei der Bewegung der Blobs
  - default 1
- blobs: *\<int>*
  - Anzahl der Blobs zu Beginn
  - default 0
- maxblobs: *\<int>*
  - Maximale Anzahl an erlaubten Blobs
  - default 100
- divisor: *\<int>*
  - Gruppengröße zu Beginn
  - default 0 (bzw. keine Gruppen)
- maxcols: *\<int>*
  - Maximale Anzahl an erlaubten Spalten (größter Teiler)
  - default 100
- sequentialorder: *\<bool>*
  - Steuert Umordnungsverhalten der Blobs in den Bändern
  - default false
- displaycalc: *\<bool>*
  - Anzeige der Berechnungsvorschrift "a : b"
  - default true
- displayresult: *\<bool>*
  - Anzeige des Ergebnisses "= c Rest d"
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

### Zustand: numbercards
- color: *\<bool>*
  - Darstellung der Stellenkarten in Farbe oder Graustufen
  - default true: Montessori Farben
- colortoggle: *\<bool>*
  - Anzeigen eines Schalters zur Einstellung der Farbe ("color", s.o.)
  - default false: Nicht anzeigen
- alpha: *\<float>*
  - Transparenz der Zahlenkarte im ausgeklappten Zustand. (aus [0,1])
  - default 0.2
- cards: *\<int>*
  - Anzahl der Zahlenkarten, Standardwerte entsprechen denen der folgenden Parameter.
  - Werden mehrere Karten verwendet, müssen die folgenden Parameter als entsprechend lange Listen angelegt werden.
  - default 1: eine Karte
- x: *\<float>*
  - x-Koordinate der Zahlenkarte(n)
  - default 3
- y: *\<float>*
  - y-Koordinate der Zahlenkarte(n)
  - default 14
- value: *\<int>*
  - Initialer Wert der Zahlenkarte(n). Größer oder gleich 0.
  - default 42
- edit: *\<string>*
  - String aus chars "t" (true) oder "f", welcher zum einen die Länge der Karte repräsentiert und zum anderen, welche Stellen (links nach rechts von groß nach klein) geändert werden können (t) und welche nicht (f).
  - Bsp: "tft" = Eine 3-stellige Karte bei der die Zehnerstelle nicht geändert werden kann, die Hunderter- und Einerstelle dagegen schon.
  - default "ttt": 3-stellige Zahl, alles editierbar.
- unfold: *\<bool>*
  - Gibt an, ob die Zahlenkarte(n) zu Beginn ausgeklappt sein sollen (true) oder nicht (false).
  - default false: Nicht ausgeklappt. 

### Zustand: strapwork
- rows: *\<int>*
  - Anzahl der Zeilen für ein Ornament
  - default 1: Eine Zeile
- size: *\<float>*
  - stellt generelle Größe der Objekte ein
  - default 1
- limit: *\<int>* oder *\<list>*
  - als *\<int>*: alle Container (rows) können maximal *limit* viele Objekte enthalten
  - als *\<list>*: *limit* jedes Containers einzeln konfigurierbar. Liste muss so viele Einträge haben, wie es Container gibt.
  - default [-1]: Liste für einen Container (-1 gibt an, dass der Container unendlich lang werden kann)
- borders: *\<bool>*
  - Rahmen der Polygone zeichnen (true) oder nicht (false)
  - default false
- drawseparator: *\<bool>*
  - Trennsymbol an der linken Seite eines Containers anzeigen (true) oder nicht (false)
  - default true
- polys: *\<int>* oder *\<list>*
  - als *\<int>*: Dann gibt polys die Anzahl der verfügbaren Polygone an. Die Polygone werden dann mit steigender Zahl von Ecken angelegt, also e.g. "Kreis, Dreieck, Viereck, Fünfeck", wenn polys den Wert 4 hat.
  - als *\<list>*: Dient der genaueren Konfiguration der Polygone. Hier werden in einer Liste die Ecken der verfügbaren Polyone (und damit auch die Anzahl an Polygonen) definiert, e.g. [3,3,4,4] erzeugt zwei Dreiecke und zwei Vierecke (in verschiedenen Farben)
  - default [0,3,4]: Kreis, Dreieck, Viereck
- polycolors: *\<int>* or *\<list>*
  - als *\<int>*: Setzt die Startfarbe der Polygone, die dann entsprechend der in Cindy hinterlegten divomath-Farben gewählt werden
  - als *\<list>*: genaue Konfiguration der Farbe jedes Containers. Muss so viele Einträge enthalten, wie es Container gibt.
  - Farben:
    1. blau
    2. rot
    3. grün
    4. violett
    5. grau
    6. schwarz
  - default: 1

## Validierung
Je nach Komponente werden verschiedene Ergebnisse zurückgeliefert, welche zur Validierung genutzt werden können. Der Zugriff erfolgt grundsätzlich über \<komponentenname>\\{RESULT_\<bezeichner>}, e.g. "**meinvam**\\{RESULT_**x**}. Es können die üblichen Validierungsoperatoren (GREATER, EQUALS, ...) verwendet werden.
Nachfolgend die von jeder Komponente gelieferten Ergebnisse:

### Validierung: divisors
> BISHER KEINE

### Validierung: numbercards
Die Bezeichner beginnen stets mit "nc" (numbercard) gefolgt von einer Zahl (1,2,...), welche die Zahlenkarte identifiziert. Die Bezeichnungen beginnen entsprechend mit nc1, nc2, ... in Abhängigkeit davon, auf welchen Wert der Parameter cards im [Zustand](#1-numbercards) gesetzt wurde. Diesem Prefix folgt ein Unterstrich (_), wiederum gefolgt von einem Bezeichner. 
- nc1 \<int>:
  - Wert der Zahlenkarte
- nc1_E \<int>:
  - Wert der Einerstelle der Karte
- nc1_Z, nc1_H, nc1_T, nc1_ZT, nc1_HT, nc1_M, nc1_ZM, nc1_HM \<int>:
  - Analog für Zehner, ..., Hundermillion(er)
  - Ab Milliardenstelle bezeichnung numerisch (10, 11, 12...)
- nc1_unfolded \<bool>:
  - Karte aufklappt (true) oder zusammengefaltet (false)

### Validierung: strapwork
Für die Validierung kann der Inhalt jeder Position in jedem Container abgefragt werden. Der Schlüssel enthält jeweils die Nummer des Containers und die Position, der Wert ist ein Text der Form und Anzahl der Ecken des dort befindlichen Polygons enthält. Zur besseren Orientierung, können mit einem debuglevel > 0 die IDs der Container angezeigt werden. Die genaue Struktur der Bezeichner ist wie folgt:
- #\<Container-ID>_item\<Objektposition>
  - wobei \<Container-ID> und \<Objektposition> jeweils durchnummeriert werden, z.B.
  - **#1_item3** bezeichnet die dritte Position in Container 1

## Changelog
### v1.0.0
- neue Komponenten: "numbercards", "strapwork"
### v2.0.0
- neue Komponenten: "divisors"
- VAM:
  - numbercards:
    - Fix: Als Liste übergebene Listen (z.B. für x und y) werden jetzt korrekt verarbeitet.
    - Dokumentation angepasst
  - strapwork:
    - divomath Zustandsdefinition angepasst
    - Eistellbarkeit zwischen fixer und flexibler Containerlänge hinzugefügt
    - löschen der letzten Komponente bei vollem Container hinzugefügt
    - 
- FW
  - draw:
    - debug Funktion entfernt, die überall nadas beim debuggen gezeichnet hat
    - objpreview entfernt, wird nicht benötigt
  - constants:
    - colors:
      - geändert: DIVOBLUE von (120,147,194) zu (83,125,156)
      - geändert: DIVORED von (255,84,84) zu (235,85,78)
      - geändert: DIVOGREY von (165,165,165) zu (130,149,192) --> eher blau
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