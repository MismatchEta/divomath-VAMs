# divoVAM Nutzerdokumentation

> Stand 7b426

divoVAM ist eine Sammlung virtueller Arbeitsmittel für den Mathematikunterricht,
umgesetzt als CindyJS-Widgets. Alle Arbeitsmittel stecken in einer einzigen
Datei — welches erscheint und wie es sich verhält, ist konfigurierbar.

Es gibt zwei Wege der Einbindung, die dieselben Arbeitsmittel und dieselben
Einstellungen verwenden:

- **In divomath**, als Komponente. Konfiguriert über
  [Komponentenverhalten](#komponentenverhalten) und
  [Zustand](#konfiguration-des-zustands-eines-vams). Nur hier gibt es
  [Validierung](#validierung) und [Referenzierung](#referenzierung-divomath).
- **Als eigenständige Seite** auf abako, konfiguriert über
  [URL-Parameter](#standalone-betrieb) mit denselben Namen. Dieser
  Weg trägt auch die Einbettung in bspw. Articulate Storyline.

Der Hauptteil dieser Dokumentation beschreibt die Einstellungen der einzelnen
Arbeitsmittel. Sie gelten für beide Wege; die wenigen Stellen, an denen das
nicht so ist, sind gekennzeichnet.

Beispielhafte Einbindungen im divomath-Editor:
<https://editor.divomath-nrw.de/folien/634fa76ad6627092d00ffb24/6697a005040ef4466b6d5342/6697a02b69fcc16c3e49d692/0/6a79a78eae9dd79ab405da92>


## Standalone-Betrieb

Für den Standalone-Betrieb kann `out/divoVAM.html` mit allen Abhängigkeiten lokal eingebunden oder gehostet werden. Das ist zum Beispiel unter `https://www.abako.dzlm.de/cindy/vam` der Fall. `divoVAM.html` beinhaltet alle Arbeitsmittel. Welches erscheint, entscheidet der Parameter `vam`. Ein Beispiel

```
https://abako.dzlm.de/cindy/vam/divoVAM.html?vam=percentagebar&basevalue=120&barvalue=0.5
```

Diese URL lädt das VAM `percentagebar` und setzt darüber hinaus die VAM-spezifischen Parameter `basevalue` und `barvalue`. Näheres zu VAM-spezifischen Konfigurationen im Abschnitt über [Arbeitsmittel](#die-arbeitsmittel).

Dieser Weg trägt auch die Einbettung in Articulate Storyline und alles andere,
was eine Webseite in einen Rahmen stellen kann.

### Grundlagen

#### Aufbau einer URL

Auf die Adresse der Datei folgt ein `?`, danach die Parameter, getrennt durch
`&`. Die Namen sind identisch zu den Schlüsseln im
[Zustand](#einbindung-in-divomath) einer divomath-Komponente — was hier steht,
gilt dort analog.

Für die Schreibweise der Werte:

- **Keine Anführungszeichen und keine Leerzeichen.** Auch nicht bei Listen:
  `hidetoggles=arch,overflow`, nicht `hidetoggles="arch, overflow"`.
- **Listen von Zahlen** in eckigen Klammern: `custompercentages=[0.25,0.5]`
- **Wahrheitswerte** als `true` oder `false`
- **Dezimalzahlen** mit Punkt: `barvalue=0.5`
- **Groß- und Kleinschreibung** zählt. Alle Parameternamen sind kleingeschrieben.

Unbekannte Parameter werden stillschweigend ignoriert. Ein Tippfehler im Namen
führt also nicht zu einer Fehlermeldung, sondern dazu, dass die Einstellung
einfach nicht wirkt.

#### Allgemeine Einstellungen

Diese gelten für alle Arbeitsmittel:

| Parameter | Bedeutung | Voreinstellung |
|---|---|---|
| `vam` | Welches Arbeitsmittel gezeigt wird | `default` (zeigt einen Hinweis) |
| `bgcolor` | Hintergrundfarbe als `[R,G,B]` mit Werten aus [0,1] | Weiß |
| `uiscale` | Skaliert die Bedienelemente gemeinsam, ohne das Arbeitsmittel selbst zu verändern | `1` |
| `debuglevel` | `LOGNONE` aus, `LOGERROR` Fehler, `LOGWARN` zusätzlich Warnungen, `LOGDEBUG` zusätzlich Debug-Ausgaben | `LOGNONE` |

Zulässige Werte für `vam`:
- `distributive`,
- `divisors`,
- `numbercards`,
- `percentagebar`,
- `strapwork`,
- `thales`.

> **Im Produktivbetrieb gehört `debuglevel` auf 0.** Ab Stufe 3 werden
> Hilfslinien, der sichtbare Bereich und der Dokumentationstext des
> Arbeitsmittels mitgezeichnet.

Zum Erheben von Prozessdaten:

| Parameter | Bedeutung | Voreinstellung |
|---|---|---|
| `loggingenabled` | Schaltet das Ereignisprotokoll ein | `false` |
| `userid` | Kennung, unter der die Ereignisse abgelegt werden | zufällig vergeben |
| `maxlogmessages` | Wie viele der letzten Debug-Meldungen vorgehalten werden | `50` |

#### Ausschnitt und Fenstergröße

Die Arbeitsmittel rechnen in Welteinheiten, nicht in Pixeln. Welcher Ausschnitt
dieser Welt zu sehen ist, bestimmt `rect`; wie groß die Zeichenfläche im Browser
ist, bestimmt `full`.

| Parameter | Wirkung |
|---|---|
| `full` | Die Zeichenfläche füllt das Browserfenster statt der festen Größe 885 × 519 |
| `rect=divomath` | Ausschnitt 24,5 × 18,9 — die Voreinstellung, entspricht der Darstellung in divomath |
| `rect=classic` | 38,2 × 22,1 — mehr Platz in der Breite |
| `rect=wide` | Der Ausschnitt der früheren Datei `divoVAM-full.html` |
| `rect=a,b,c,d` | Freier Ausschnitt als vier Zahlen [links, oben, rechts, unten] |

`full` steht allein, ohne Wert: `divoVAM.html?vam=thales&full`. Bei einer
ungültigen Angabe für `rect` greift die Voreinstellung.


#### Das Kritzel-Overlay

Ein Stiftwerkzeug, das sich als zweite Zeichenfläche über das Arbeitsmittel
legt: drei Stiftfarben, Radierer, ein- und ausklappbare Werkzeugleiste. In
divomath stellt die Plattform so etwas bereit, im Standalone-Betrieb nicht —
daher diese Option.

| Parameter | Wirkung | Voreinstellung |
|---|---|---|
| `draw` | Schaltet das Werkzeug ein (steht allein, ohne Wert) | aus |
| `drawpen` | Strichstärke des Stifts in Pixeln | `4` |
| `drawerase` | Kantenlänge des Radierers in Pixeln | `20` |
| `drawpos` | Position des Stift-Knopfs relativ zur Zeichenfläche, Werte aus [0,1] | `0.4,0.05` |
| `drawdir` | Richtung, in die die Leiste aufklappt: `right`, `left`, `up`, `down` | `right` |
| `drawmoveable` | Erlaubt es, die Werkzeugleiste zu verschieben | aus |

**Voraussetzung:** `freehand-drawing.js` muss neben der HTML-Datei auf dem Server
liegen. Der Build legt sie mit ins Ausgabeverzeichnis. Ohne `draw` wird sie gar
nicht erst geladen.

**Zur Bedienung:** Solange der Stift aktiv ist, liegt die Zeichenfläche über dem
Arbeitsmittel — dieses ist dann nicht bedienbar. Ein erneuter Klick auf den
Stift-Knopf gibt es wieder frei; die Zeichnung bleibt dabei sichtbar.

> **Bekannte Einschränkung:** Die Zeichenfläche wird beim Laden positioniert und
> folgt einer späteren Änderung der Fenstergröße nicht.

### Der Link-Generator

Solche Links von Hand zu schreiben ist fehleranfällig. Unter
<https://abako.dzlm.de/cindy/vam/> steht je Arbeitsmittel ein Formular bereit,
das die Adresse erzeugt. **Das ist der empfohlene Weg** — die HTML-Datei selbst
muss dafür nicht bearbeitet werden.

Die Seite wird von Hand gepflegt und hinkt neuen Parametern gelegentlich
hinterher. Was dort fehlt, lässt sich immer noch an die erzeugte Adresse
anhängen.


## Einbindung in divomath

In divomath wird das Framework als Komponente eingebunden. Nach dem Import 
steht über sie jedes der [Arbeitsmittel](#die-arbeitsmittel) zur Verfügung. 
Zwei Textfelder steuern das: **Komponentenverhalten** legt fest, welches 
Arbeitsmittel erscheint, **Zustand** konfiguriert es.

Beispielhafte Einbindungen:
<https://editor.divomath-nrw.de/folien/634fa76ad6627092d00ffb24/6697a005040ef4466b6d5342/6697a02b69fcc16c3e49d692/0/6a79a78eae9dd79ab405da92>

> Die Konfiguration über [URL-Parameter](#standalone-betrieb) wirkt hier **nicht**.
> Innerhalb von divomath kommen alle Einstellungen aus den beiden Textfeldern.

### Komponentenverhalten

Unter dem Schlüssel `configuration`:

| Schlüssel | Bedeutung |
|---|---|
| `cindyJsPrefix` | Muss **genau** `divomath` lauten. Das Framework erwartet diesen Präfix für die Rückrufe der Plattform. |
| `vam` | Welches Arbeitsmittel erscheint. Zulässige siehe [Arbeitsmittel](#die-arbeitsmittel), default `default` — zeigt einen Hinweis zur richtigen Konfiguration. |
| `debuglevel` | `0` bis `3`. Im Produktivbetrieb gehört hier `0` hin. default `0` |
| `bgcolor` | Hintergrundfarbe als Liste dreier Werte aus [0,1] für Rot, Grün und Blau. |

Eine Minimalkonfiguration für die Zahlenkarten:

```yaml
configuration:
  cindyJsPrefix: divomath
  vam: numbercards
```

> ⚠️ **Der Name der Komponente darf keine Leerzeichen und keine Klammern
> enthalten.** Er geht unverändert in einen JavaScript-Aufruf ein — ein Name wie
> `Prozentstreifen (test)` erzeugt dort einen Syntaxfehler, und die Komponente meldet
> nichts mehr zurück.

### Zustand

Unter dem Schlüssel `cindyjs`. Die Schlüssel sind dieselben, die unter
[Die Arbeitsmittel](#die-arbeitsmittel) beschrieben sind:

```yaml
cindyjs:
  color: true
  colortoggle: false
  alpha: 0.2
  cards: 1
```

Alles, was nicht angegeben ist, behält seinen Standardwert. Unbekannte Schlüssel
werden stillschweigend übergangen.

> **Zur Schreibweise:** divomath reicht sämtliche Werte als Zeichenketten an
> CindyJS weiter. Das Framework wandelt sie zurück, deshalb funktionieren `true`,
> `0.5` und `[1,2,3]` wie erwartet. Ein Wert, der als Text gemeint ist, kommt
> ebenfalls unbeschadet an.

### Validierung

Jedes Arbeitsmittel meldet nach jeder Handlung Werte zurück, die sich zum Prüfen
von Lösungen verwenden lassen. Der Zugriff erfolgt über den Namen der Komponente
und den Bezeichner:

```
meinvam\{RESULT_rows}
```

Darauf lassen sich die üblichen Validierungsoperatoren anwenden (`EQUALS`,
`GREATER`, …).

Welche Bezeichner es je Arbeitsmittel gibt, steht bei den
[Arbeitsmitteln](#die-arbeitsmittel) jeweils unter *Rückgabewerte*. Zusätzlich
gilt für alle:

- **Jedes Arbeitsmittel meldet auch seine Zustandsparameter zurück.** Auch dort,
  wo keine eigenen Bezeichner aufgeführt sind, lässt sich also auf die
  Einstellungen zugreifen.
- **`timestamp` und `datetime`** werden bei jeder Rückmeldung automatisch
  mitgeschickt.

### Zustand über Folienwechsel

Verlässt eine Lernende die Folie, sichert die Komponente ihren Zustand; beim
Zurückkommen wird er wiederhergestellt. Beides geschieht von selbst, es ist
nichts zu konfigurieren.

Beim Aufbau der Folie können mehrere Quellen denselben Schlüssel liefern. Sie
gelten in dieser Reihenfolge, von stark nach schwach:

1. **Eine eigene Abgabe auf dieser Folie** — was zuletzt zurückgemeldet wurde
2. **Eine Referenz** aus dem `cindyjs`-Objekt (siehe [Referenzierung](#referenzierung))
3. **Eine Referenz** auf Top-Level
4. **Der gesicherte Zustand** vom letzten Verlassen der Folie
5. **Die Vorgabe aus dem Editor**, also das `cindyjs`-Objekt

Eine eigene Abgabe schlägt damit auch eine Referenz auf eine frühere Folie. Wer
also einen Wert aus einer vorherigen Aufgabe übernimmt und ihn dann verändert,
behält beim Zurückkommen seine eigene Änderung.


### Referenzierung

Eine Komponente kann Werte anderer Komponenten übernehmen, um damit ihren eigenen
Zustand zu setzen — auch über Folien hinweg. Dazu wird der Zustandsschlüssel mit
zwei Unterstrichen vorangestellt: Aus `size` wird `__size`.

Der Wert ist ein Verweis aus Folienname, Komponentenname und Bezeichner:

```
FOLIENNAME/komponentenname/{RESULT_bezeichner}
```

#### Wo die Referenzen stehen dürfen

**Empfohlen: im `cindyjs`-Objekt.** Dort wirken sie sowohl im Editor als auch im
Viewer.

Auf Top-Level funktionieren sie ebenfalls, allerdings nur im **Viewer** — im
Editor reicht divomath sie nicht weiter, was das Prüfen der Konfiguration
erschwert. Steht derselbe Schlüssel an beiden Stellen, gewinnt der aus dem
`cindyjs`-Objekt.

#### Beispiel

Zwei Folien, *ZAHLENKARTEN* und *ZAHLENKARTEN-2*, mit den Komponenten
*vam-karten* und *vam-karten2*. Die zweite übernimmt Wert und Klappzustand der
ersten:

```yaml
# --- Im Zustand von "vam-karten2"
cindyjs:
  __value: ZAHLENKARTEN/vam-karten/{RESULT_value}
  __unfold: ZAHLENKARTEN/vam-karten/{RESULT_unfold}
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

Die beiden `__`-Zeilen überschreiben das weiter unten stehende `value: 12123` und
`unfold: true`. Ohne eine erreichbare Referenz — etwa wenn die erste Folie noch
nicht bearbeitet wurde — greifen die Werte darunter.

#### Sonstiges

Grundsätzlich lassen sich so auch Ergebnisse anderer Komponenten übernehmen, etwa eines Textfelds. **Das ist bisher nicht großartig erprobt.**


## Die Arbeitsmittel

Dieser Abschnitt beschreibt die Einstellungen der einzelnen Arbeitsmittel. Die
Namen gelten für beide Einbindungswege: als URL-Parameter im
[Standalone-Betrieb](#standalone-betrieb) und als Schlüssel im *Zustand* einer
[divomath-Komponente](#einbindung-in-divomath).

Jedes Arbeitsmittel meldet außerdem Werte zurück, mit denen sich in divomath
Lösungen prüfen lassen. Diese stehen jeweils unter *Rückgabewerte* und wirken
nur dort — im Standalone-Betrieb gibt es niemanden, der sie entgegennimmt.

### Farbangaben

Wo unten eine Farbe erwartet wird, ist entweder einer dieser Bezeichner* zulässig oder
eine dreielementige Liste `[R,G,B]` mit Werten aus [0,1].

| Name | | Name | |
|---|---|---|---|
| `DARKRED` | (228,26,28) | `DIVOGREEN` | (129,239,104) |
| `DARKGREEN` | (77,175,74) | `DIVOVIOLET` | (150,59,216) |
| `DARKBLUE` | (55,126,184) | `DIVOGREY` | (130,149,192) |
| `DZLMCOLORLIGHT` | (207,221,225) | `DIVOBLACK` | (0,0,0) |
| `DZLMCOLORDARK` | (70,120,132) | `DIVORED` | (235,85,78) |
| `DZLMCOLORGOLD` | (239,182,96) | `DIVOBLUE` | (83,125,156) |
| `DZLMCOLORBLUE` | (127,127,247) | `PLACECOLORRED` | (102,194,165) |
| `DZLMCOLORRED` | (239,134,131) | `PLACECOLORGREEN` | (252,141,98) |
| | | `PLACECOLORBLUE` | (141,160,203) |

_\* und wahrscheinlich noch andere Bezeichner_

---

### distributive

Ein Rechteckfeld aus Plättchen, das sich in Zeilen oder Spalten gruppieren,
teilweise einfärben und zerschneiden lässt. Dazu erscheinen der zugehörige 
Term und seine verbale Beschreibung, die sich mit jeder Handlung mitverändern 
— gedacht zum Erarbeiten des Distributivgesetzes.

#### Parameter

**Das Feld**

- `gridposition`: *[\<float>, \<float>]*
  - Startposition des Rechteckfelds (linke untere Ecke)
  - default [10,8]
- `rows`: *\<int>* — Anzahl der Zeilen. default 5
- `cols`: *\<int>* — Anzahl der Spalten. default 7
- `gridmoveable`: *\<bool>* — Ob sich das ganze Feld verschieben lässt. default true

**Aussehen der Plättchen**

- `size`: *\<float>* — Größe der Plättchen. default 1
- `cornerradius`: *\<float>*
  - Eckradius. 0 zeichnet Quadrate (beste Leistung), sonst abgerundete Rechtecke.
    Höchstens die Hälfte von *size*.
  - default .5 (mit size=1 also ein Kreis)
- `verticalpadding`, `horizontalpadding`: *\<float>* — Abstände zwischen den Plättchen. default .1
- `groupspacing`: *\<float>* — Zusätzlicher Abstand zwischen Gruppen beim Gruppieren. default .2
- `cutwidth`: *\<float>* — Zusätzlicher Abstand zwischen den Teilen nach einem Schnitt. default .3
- `animationspeed`: *\<float>* — Je größer, desto schneller laufen alle Animationen. default .15

**Interaktion**

- `groupingtype`: *\<string>*
  - Welche Gruppierungen ein Klick erzeugen kann: **"NONE"**, **"ROW"**, **"COL"** oder **"ROWCOL"**
  - default "ROWCOL"
- `requiregrouping`: *\<bool>*
  - Färben und Schneiden erst möglich, nachdem eine Zeilen- oder Spaltenstruktur
    gewählt wurde. Der Werkzeug-Knopf ist bis dahin blass und lässt sich nicht
    umschalten.
  - **Achtung**: Die Sperre gilt auch rückwärts. Wer gruppiert, färbt,
    zerschneidet und dann auf „nix" zurückgeht, bekommt die Färbung von dort aus
    nicht mehr weg, ohne vorher wieder zu gruppieren.
  - default true
- `picturemode`: *\<bool>*
  - Nimmt dem Arbeitsmittel jede Interaktivität. Das Feld wird gezeichnet wie
    konfiguriert, reagiert aber auf nichts. Gedacht für Abbildungen in
    Aufgabentexten. Bedienelemente werden weiter gezeichnet, sind aber tot.
  - default false

**Werkzeug-Knopf**

- `tool`: *\<string>* — Werkzeug beim Start: **"hand"**, **"bucket"** oder **"scissors"**. default "hand"
- `drawtoolbutton`: *\<bool>* — Knopf zeichnen oder nicht. default true
- `buttonsize`: *\<float>* — Größe des Knopfs. default 2
- `buttonpadding`: *\<float>* — Abstand zum oberen und rechten Rand. default .4
- `toolbuttonx`, `toolbuttony`: *\<float>*
  - Feste Position. Ohne Angabe sitzt der Knopf oben rechts.
  - default NADA

**Term und Beschreibung**

- `drawexpression`: *\<bool>* — Term zeichnen. default true
- `drawverbal`: *\<bool>* — Verbale Beschreibung zeichnen. default true
- `fontsize`: *\<int>* — Schriftgröße für beides. default 18
- `expressionposition`, `verbalposition`: *[\<float>, \<float>]*
  - Feste Positionen. Ohne Angabe automatisch.
  - default NADA
- `expressionmoveable`, `verbalmoveable`: *\<bool>* — Verschiebbar oder nicht. default false
- `labelpadding`: *\<float>* — Abstand des Ausgabetexts zum oberen und linken Rand. default 10.3
- `showexpressiontoggle`: *\<bool>* — Schalter zum Ein- und Ausblenden von Term und Beschreibung. default false
- `expressiontogglestate`: *\<bool>* — Zustand dieses Schalters beim Start. default true

**Zustand beim Start**

- `groupby`: *\<string>* — Gruppierung: **"ROW"**, **"COLUMN"** oder **"NONE"**. default "NONE"
- `coloredrowindex`: *\<int>* — Ab welcher Zeile nach unten gefärbt wird. default NADA (keine Färbung)
- `coloredcolindex`: *\<int>* — Ab welcher Spalte gefärbt wird. default NADA (keine Färbung)
- `cuthorizontally`: *\<bool>* — Feld waagerecht geschnitten. default false
- `cutvertically`: *\<bool>* — Feld senkrecht geschnitten. default false

#### Rückgabewerte

> Nur in divomath. (seit 5.2.3)

| Bezeichner | Bedeutung |
|---|---|
| `rows` | Anzahl der Zeilen |
| `columns` | Anzahl der Spalten |
| `coloredrows` | Anzahl der gefärbten Zeilen |
| `coloredcolumns` | Anzahl der gefärbten Spalten |
| `cuthorizontally` | Ob das Feld waagerecht geschnitten ist |
| `cutvertically` | Ob das Feld senkrecht geschnitten ist |
| `groupby` | Gruppierung, eins von "ROW", "COLUMN", "NONE" |

> ⚠️ Die Bezeichner `columns` und `coloredcolumns` weichen von den
> Zustandsschlüsseln `cols`, `coloredrowindex` und `coloredcolindex` ab, und
> `coloredrows`/`coloredcolumns` zählen die gefärbten Zeilen bzw. Spalten,
> während die Zustandsschlüssel den Index angeben, ab dem gefärbt wird.

---

### divisors

Eine Menge von Plättchen wird in Bänder gleicher Länge aufgeteilt. Anzahl und
Gruppengröße lassen sich über Knöpfe oder einen senkrechten Balken einstellen,
darunter erscheinen Rechnung und Ergebnis mit Rest — gedacht zum Erarbeiten der
Division mit Rest und des Teilerbegriffs.

#### Parameter

**Plättchen und Bänder**

- `blobs`: *\<int>* — Anzahl der Plättchen zu Beginn. default 0
- `maxblobs`: *\<int>* — Höchstzahl an Plättchen. default 100
- `divisor`: *\<int>* — Gruppengröße zu Beginn. default 1 (keine Gruppen)
- `maxcols`: *\<int>* — Größte einstellbare Gruppengröße. default 10
- `color`: *[\<string>, \<string>]*
  - Zwei Farben (siehe [Farbangaben](#farbangaben)): die erste für Plättchen in
    einem vollen Band, die zweite für die übrigen.
  - default [DIVOGREY, DIVORED]
- `size`: *\<float>* — Größe der Plättchen. default .7
- `blobmargin`: *\<float>* — Abstand der Plättchen innerhalb eines Bandes. default .2
- `stripmargin`: *\<float>* — Abstand der Bänder untereinander. default .5
- `sequentialorder`: *\<bool>* — Steuert, wie die Plättchen beim Umsortieren wandern. default false
- `timing`: *\<float>* — Dauer der Umsortier-Animation. default .5

**Bedienelemente**

- `drawblobbuttons`: *\<bool>* — Knöpfe für die Anzahl der Plättchen. default true
- `drawdivbuttons`: *\<bool>* — Knöpfe für die Gruppengröße. default true
- `drawbar`: *\<bool>* — Senkrechter Balken zum Einstellen der Gruppengröße. default true

**Textausgaben**

- `displaycalc`: *\<bool>* — Rechnung „a : b". default true
- `displayresult`: *\<bool>* — Ergebnis „= c R d". default true
- `displaydescription`: *\<bool>* — Die zwei beschreibenden Textzeilen. default true
- `displayblobcount`: *\<bool>* — Anzahl der Plättchen. default true
- `displaydivisorcount`: *\<bool>* — Gruppengröße. default true
- `fontsize`: *\<int>* — Schriftgröße der Texte unter den Bändern. default 16

#### Rückgabewerte

> Nur in divomath. (seit 7)

Eigene Bezeichner gibt es nicht. Alle Zustandsparameter werden zurückgemeldet
und lassen sich darüber prüfen und referenzieren, insbesondere `blobs` (Anzahl
der Plättchen) und `divisor` (eingestellte Gruppengröße).

---

### numbercards

Stellenwertkarten, die sich auf- und zuklappen lassen. Zugeklappt zeigen sie
eine Zahl, aufgeklappt deren Zerlegung nach Stellenwerten in Montessorifarben.

#### Parameter

Werden mehrere Karten verwendet, müssen die kartenbezogenen Parameter als
entsprechend lange Listen angegeben werden.

- `cards`: *\<int>* — Anzahl der Karten. default 1
- `x`, `y`: *\<list of floats>* oder *\<float>*
  - Koordinaten der Karten
  - default x: [10*#-7], y: [16] (Länge ergibt sich aus *cards*)
- `value`: *\<list of ints>* oder *\<int>*
  - Anfangswerte, größer oder gleich 0
  - default [1234]
- `edit`: *\<list of strings>* oder *\<string>*
  - Zeichenkette aus `t` und `f`, die zugleich die Länge der Karte festlegt und
    angibt, welche Stellen (von groß nach klein) geändert werden dürfen.
  - **Beispiel**: `"tft"` ist eine dreistellige Karte, deren Zehnerstelle fest ist.
  - default alles editierbar, Stellenzahl aus *value*
- `unfold`: *\<list of bools>* oder *\<bool>* — Karten zu Beginn aufgeklappt. default [true]
- `color`: *\<bool>* — Stellenkarten in Montessorifarben statt Graustufen. default true
- `colortoggle`: *\<bool>* — Schalter für *color* anzeigen. default true
- `alpha`: *\<float>* — Transparenz der Karte im aufgeklappten Zustand, aus [0,1]. default 0.2
- `separator`: *\<char>* — Trennzeichen für Dreiergruppen von Ziffern. default "" (keins)

#### Rückgabewerte

> Nur in divomath. (seit 1.0.0)

Die Bezeichner beginnen mit `nc` und einer Nummer, die die Karte identifiziert —
`nc1`, `nc2`, … entsprechend *cards*. Darauf folgt ein Unterstrich und der
eigentliche Bezeichner.

| Bezeichner | Bedeutung |
|---|---|
| `nc1` | Wert der Karte |
| `nc1_E` | Wert der Einerstelle |
| `nc1_Z`, `nc1_H`, `nc1_T`, `nc1_ZT`, `nc1_HT`, `nc1_M`, `nc1_ZM`, `nc1_HM` | Zehner bis Hundertmillionen |
| `nc1_unfolded` | Karte aufgeklappt (true) oder zugeklappt (false) |

Ab der Milliardenstelle sind die Bezeichner numerisch (`nc1_10`, `nc1_11`, …).

---

### percentagebar

Ein Prozentstreifen, der sich ziehen lässt, mit Beschriftungen für Anteil, Teil
und Ganzes. Die drei Größen hängen zusammen: Wird eine geändert, bleibt eine
zweite fest und die dritte rechnet sich neu.

#### Parameter

**Der Streifen**

- `numberofbars`: *\<int>* — Anzahl der Streifen. Mehrere teilen sich die Breite. default 1
- `barvalue`: *\<float>* — Anteil beim Start als Wert aus [0,1]. default 0
- `basevalue`: *\<float>* — Grundwert, der dem ganzen Streifen entspricht. default 1000
- `unit`: *\<string>* — Einheit hinter den Werten. default "MB"
- `subdivisions`: *\<int>* — In wie viele Schritte der Streifen unterteilt ist. default 1
- `barprecision`: *\<float>* — Schrittweite beim Ziehen, als Anteil. .01 sind 1 %. default .01
- `snapbar`: *\<bool>*
  - Der Streifen rastet beim Ziehen auf den Schritten ein statt in
    *barprecision*-Schritten. Wirkt nur, solange die Schritte angezeigt werden.
  - default false
- `isbardraggable`: *\<bool>* — Streifen mit Maus oder Finger veränderbar. default true
- `overflow`: *\<bool>*
  - Erlaubt Werte über 100 %. Wirkt auf Ziehen, Direkteingabe und Plus-Taste gleichermaßen.
  - default false
- `keepstable`: *\<string>*
  - Welche Größe konstant bleibt, wenn eine der anderen geändert wird:
    **"basevalue"** (Ganzes), **"value"** (Teil) oder **"percentage"** (Anteil)
  - default "basevalue"

**Darstellung**

- `barposition`: *[\<float>, \<float>]* — Position des Streifens (linke untere Ecke). default NADA (automatisch)
- `barwidth`: *\<float>*
  - Breite des Streifens. NADA passt sie an den sichtbaren Bereich an.
  - **Hinweis**: Bei Einbettung in Storyline gehört hier ein fester Wert hin.
    Sonst wirken Schrift und Streifen je nach Einbettung unterschiedlich groß
    zueinander.
  - default NADA
- `barheight`: *\<float>* — Höhe des Streifens. default 1.5
- `barpadding`: *\<float>* — Abstand zwischen mehreren Streifen. default 2.5
- `barcolor`: *\<string>* — Farbe des Streifens (siehe [Farbangaben](#farbangaben)). default DZLMCOLORGOLD
- `fontfamily`: *\<string>* — Schriftart der Beschriftungen. default NADA (Standardschrift)
- `decimalspercentage`: *\<int>* — Nachkommastellen bei Prozentangaben. default 2
- `decimalsvalue`: *\<int>* — Nachkommastellen bei Werten. default 2

**Bögen und Beschriftungen**

- `alwaysdrawarches`: *\<bool>*
  - Bögen von Anfang an anzeigen. Der Schalter bleibt dabei sichtbar und lässt
    sich weiter umschalten.
  - **Hinweis**: Bögen erscheinen nur, solange auch die Schritte angezeigt
    werden. Beide sind gekoppelt: Geht der letzte Schritte-Schalter aus, gehen
    die Bögen mit; wird der Bögen-Schalter eingeschaltet, geht die
    Schrittanzeige mit an.
  - default true
- `leftoutpercentages`, `leftoutvalues`: *\<list of floats>*
  - Anteile aus [0,1], deren Prozent- bzw. Wertbeschriftung **nicht** gezeichnet wird
  - default []
- `custompercentages`, `customvalues`: *\<list of floats>*
  - Zusätzliche Beschriftungen, die unabhängig von den Schritten immer erscheinen
  - default []

**Bedienelemente**

- `uiscale`: *\<float>*
  - Skaliert alle Bedienelemente gemeinsam: Schalter, Eingabefelder, Plus- und
    Minus-Tasten und die eingeblendete Tastatur. Der Streifen bleibt unberührt,
    er richtet sich weiter nach *barwidth* und *barheight*.
  - Gedacht für Einbettungen, in denen der Streifen die volle Breite nutzen soll,
    das Bedienfeld darunter aber unabhängig davon lesbar bleiben muss.
  - Bezugspunkt ist die linke untere Ecke des sichtbaren Bereichs; von dort
    wächst das Bedienfeld nach oben und rechts.
  - default 1
- `showbuttons`: *\<bool>* — Alle Schalter und Eingabefelder anzeigen. default true
- `hidetoggles`: *\<list of strings>*
  - Blendet einzelne Schalter aus, während die übrigen bleiben. Wirkt nur bei
    *showbuttons* true.
  - Zulässig: **percentage** (Anteil), **part** (Teil), **basevalue** (Ganzes),
    **parts** (Werte unten), **percentages** (Prozente oben), **arch** (Bögen),
    **showtf-div** (Anzahl der Schritte), **showtf-divpercentage** (Schrittgröße
    in %), **showtf-divvalue** (Schrittgröße), **showtf-perc** (Eingabe Anteil),
    **showtf-value** (Eingabe Teil), **showtf-base** (Eingabe Ganzes),
    **overflow**
  - default []
- `scaffoldbasevalue`, `scaffoldvalue`, `scaffoldpercentage`: *\<bool>*
  - Verdecken Grundwert, Prozentwert bzw. Prozentsatz mit einem grauen Feld — als
    Lücke für Aufgaben
  - default false

#### Rückgabewerte

> Bisher keine eigenen.

---

### strapwork

Bänder, in die regelmäßige Vielecke einsortiert werden, dazu ein Container für
Musterfolgen und wahlweise ein Referenzcontainer. Trennstriche gliedern die
Bänder — gedacht für Musterfolgen und das Erarbeiten von Zerlegungen.

#### Parameter

**Container und Bänder**

- `rows`: *\<int>* — Anzahl der Bänder. default 1
- `limit`: *\<list>*
  - Wie viele Polygone je Band erlaubt sind, ein Eintrag je Band. `-1` steht für
    unbegrenzt.
  - **Beispiel**: [3,5,-1] für drei Bänder mit 3, 5 und beliebig vielen Polygonen
    (von unten nach oben)
  - default [10,10,…]
- `state`: *\<list of strings>*
  - Welche Polygone zu Beginn in den Bändern liegen, als komma-getrennte Nummern
    je Band.
  - **Beispiel**: Für *polys*=[0,3,4] und *rows*=3 füllt ["1,2,2", "3,3,3", ""]
    das erste Band mit Kreis-Dreieck-Dreieck, das zweite mit drei Vierecken, das
    dritte bleibt leer.
  - default ["", "", …]
- `size`: *\<float>* — Allgemeine Größe von Container und Polygonen. default 1
- `polypadding`: *\<float>* — Abstand zwischen den Polygonen in einem Band. default .5

**Die Grundpolygone**

- `polys`: *\<list>*
  - Eckenzahlen der verfügbaren Polygone, `0` steht für den Kreis.
  - **Beispiel**: [3,3,4,4] erzeugt zwei Dreiecke und zwei Vierecke in
    verschiedenen Farben.
  - default [0,3,6]
- `polycolors`: *\<list>*
  - Farbe je Grundpolygon, mindestens so viele Einträge wie *polys*.
    1 blau, 2 dunkelblau, 3 rot, 4 grün, 5 violett, 6 grau, 7 schwarz
  - default [1..100]
- `drawborders`: *\<bool>* — Rahmen um die Polygone. default true

**Trennstriche**

- `drawseparator`: *\<bool>* — Trennsymbol an der linken Seite eines Containers. default true
- `sepsize`: *\<float>* — Größe der Trennstriche und des Reset-Knopfs. default 1
- `sepstate`: *\<string>*
  - Wo Trennstriche zu Beginn stehen, als komma-getrennte Zahlen. Jede Zahl gibt
    an, wie viele Polygone links davon liegen. **"1,3,5"** erzeugt einen Strich
    nach dem ersten, dritten und fünften Polygon — auch dann, wenn dort noch
    keine Polygone sind.
  - default "" (leer)

**Musterfolgen-Container**

- `drawpatterncontainer`: *\<bool>* — Container zeichnen. default true
- `patternstate`: *\<list of strings>* — Startbelegung, analog zu *state*. default ["", "", …]
- `patternlimit`: *\<int>*
  - Wie viele Polygone hineinpassen. **-1** erzeugt einen beliebig
    verlängerbaren Container. Das Limit gilt je Zeile — anders als *limit*.
  - default 5

**Referenzcontainer**

- `drawrccontainer`: *\<bool>* — analog *drawpatterncontainer*. default false
- `drawrcseparator`: *\<bool>* — analog *drawseparator*. default false
- `rcrows`: *\<int>* — analog *rows*. default 1
- `rcstate`: *\<list of strings>* — analog *state*. default ["", "", …]
- `rclimit`: *\<list>* — analog *limit*. default [10,10,…]
- `rcsepstate`: *\<string>* — analog *sepstate*. default "" (leer)

**Interaktion**

- `interactable`: *\<string>*
  - Womit interagiert werden darf, gesteuert über die Buchstaben **"c"**
    (Container), **"p"** (Polygon) und **"s"** (Trennstrich). **"cps"** lässt
    alles zu, **"cp"** sperrt die Trennstriche, übrige Kombinationen analog.
  - default "cps"
- `rcinteractable`: *\<string>*
  - Dasselbe für den Referenzcontainer. Ein leerer String macht ihn vollständig
    unbedienbar. Aus Kompatibilitätsgründen wird auch ein bool akzeptiert
    (**true** entspricht "cps").
  - default "" (nicht bedienbar)
- `drawresetbutton`: *\<bool>* — Reset-Knopf anzeigen. default true
- `buttonsize`: *\<float>* — Größe des Reset-Knopfs. default 1

#### Rückgabewerte

> Nur in divomath. (seit 1.0.0, zuletzt 3.0.0)

Abfragbar ist der Inhalt jeder Position in jedem Container. Der Schlüssel lautet
`<bandnummer>.<position>` — das fünfte Polygon im ersten Band ist also `1.5`.

Der Wert ist die Nummer des Grundpolygons, das dort liegt; die Grundpolygone
sind von links nach rechts ab 1 durchnummeriert. Der Wert **0** bedeutet, dass
an dieser Stelle ein Trennstrich steht.

Zusätzlich ist ein ganzes Band als Zeichenkette abfragbar, unter `row1`, `row2`
und so weiter. Eine Folge aus fünfmal dem ersten Polygon ergibt dort `11111`.

---

### thales

Ein Dreieck mit Umkreis, dessen Punkt C sich bewegen lässt — wahlweise fest auf
dem Thaleskreis oder frei. Winkel lassen sich einblenden, messen, stempeln und
als Spur aufzeichnen.

#### Parameter

**Geometrie**

- `A`, `B`, `C`: *[\<float>, \<float>]*
  - Startpositionen der drei Punkte. C ist der bewegliche.
  - default [7,5], [18,10], [12,12]
- `amoveable`, `bmoveable`: *\<bool>* — Ob auch A bzw. B bewegt werden dürfen. default false
- `softc`: *\<bool>*
  - Weiche Konstruktion: bei **true** klebt C nicht am Thaleskreis und lässt sich
    frei bewegen, bei **false** bleibt es auf dem Kreis.
  - **Achtung**: Die Bedeutung wurde in Version 7 umgedreht. Frühere
    Konfigurationen mit ausdrücklichem *softc* verhalten sich danach umgekehrt.
  - default true
- `snap`: *\<bool>* — Beim Bewegen von C auf den rechten Winkel einrasten. default true
- `snappingdifference`: *\<float>* — Fangbereich um den rechten Winkel, in Grad. default 5
- `generalsnapsize`: *\<float>* — Zusätzliches Einrasten auf Vielfache dieses Winkels, in Grad. 0 schaltet es ab. default 5
- `generalsnapdifference`: *\<float>* — Fangbereich dafür, in Grad. default .5
- `drawcircle`: *\<bool>* — Thaleskreis zeichnen. default true
- `drawcenter`: *\<bool>* — Mittelpunkt M zeichnen. default true

**Bedienelemente**

- `showstampbutton`, `showundobutton`, `showresetbutton`, `showconstructionbutton`, `showhelpbutton`: *\<bool>*
  - Einzelnes Ein- und Ausblenden der Schaltflächen (Stempel, Rückgängig,
    Zurücksetzen, Konstruktionsart, Hilfe)
  - default true
- `drawtogglealpha`, `drawtogglebeta`, `drawtogglegamma`, `drawtogglegamma1`, `drawtogglegamma2`, `drawtogglevalues`: *\<bool>*
  - Einzelnes Ein- und Ausblenden der Winkel-Schalter
  - default true
- `showalpha`, `showbeta`, `showgamma`, `showgamma1`, `showgamma2`, `showanglevalues`, `showhelp`: *\<bool>*
  - Zustand dieser Schalter beim Start. Wirkt auch dann, wenn der Schalter
    ausgeblendet ist.
  - default false, außer *showgamma* und *showhelp* (true)

**Stempeln und Spur**

- `stampmode`: *\<string>* — **"stamp"** setzt einzelne Stempel, **"trace"** zeichnet eine durchgehende Spur. default "stamp"
- `stampbuttonimage`: *\<string>* — Symbol der Schaltfläche: **"stamp"** oder **"measure-angle"**. default "stamp"
- `stickstampbuttontopoint`: *\<bool>* — Stempel-Schaltfläche an C heften statt an fester Position. default false
- `showstampedpoints`: *\<bool>* — Gestempelte Punkte anzeigen. default true
- `showstampedvalues`: *\<bool>* — Liste der gemessenen Winkel anzeigen. Einspaltig und bei Bedarf scrollbar. default true
- `jumptostamp`: *\<bool>* — Ein Klick auf einen Listeneintrag setzt C auf die zugehörige Position zurück. default false
- `stampgradient`: *\<bool>* — Stempel in einem Farbverlauf einfärben, abhängig vom Abstand zu M. default true
- `stampgradientstrength`: *\<float>* — Stärke des Verlaufs, aus [0,1]. 0 ist kein Verlauf. default .8
- `stampcolor`: *[\<float>, \<float>, \<float>]* — Farbe der Stempel, wenn *stampgradient* false ist. default [.8,.2,.2]
- `drawtrace`: *\<bool>*
  - Ob die Spur beim Start bereits aufgezeichnet wird.
  - **Hinweis**: Bereits gezeichnete Abschnitte bleiben sichtbar, auch wenn die
    Aufzeichnung pausiert wird.
  - default false
- `tracesize`: *\<float>* — Strichstärke der Spur. default 4
- `tracecolor`: *\<string>* — Farbe der Spur (siehe [Farbangaben](#farbangaben)). default DIVOBLUE
- `traceminstep`: *\<float>*
  - Mindestabstand zwischen zwei Spurpunkten. Verhindert, dass bei ruhendem Stift
    unnötig viele Punkte entstehen.
  - default .1

**Winkelanzeige und Beschriftung**

- `showcurrentanglevalue`: *\<bool>* — Aktuellen Wert von γ in einem Feld anzeigen. default true
- `anglevaluesinline`: *\<bool>* — Winkelwerte direkt am Winkel anzeigen statt nur in der Liste. default true
- `displayanglefully`: *\<bool>* — In der Liste „γ = " mit anzeigen statt nur den Wert. default false
- `displayanglefontsize`: *\<int>* — Schriftgröße der Winkelliste. default 24
- `defaultanglesizes`: *[\<float> ×5]* — Radien der fünf Winkelbögen, in der Reihenfolge [α, β, γ, γ₁, γ₂]. default [3,3,2,3,3]
- `anglelabelsize`: *\<int>* — Basis-Schriftgröße der Winkelbeschriftungen. default 18
- `anglelabelgammafactor`: *\<float>* — Faktor, um den γ größer beschriftet wird als die übrigen Winkel. default 1.3
- `anglelabelminscale`: *\<float>* — Untergrenze der Verkleinerung bei kleinen Winkeln. **1** schaltet die Skalierung ab. default .65

**Darstellung**

- `pointlabelsize`: *\<int>* — Schriftgröße der Punktnamen. default 24
- `linelabelsize`: *\<int>* — Schriftgröße der Seitennamen. default 18
- `linesize`: *\<float>* — Strichstärke des Dreiecks. default 1.5
- `circlelinesize`: *\<float>* — Strichstärke des Kreises. default 1.5
- `circlelinecolor`: *[\<float>, \<float>, \<float>]* — Farbe des Kreises. default .3*[1,1,1] (dunkelgrau)
- `imgoffset`: *[\<float>, \<float>]* — Versatz der Symbole auf den Schaltflächen. default [0,.65]

**Positionen**

Alle folgenden Parameter werden mit **NADA** automatisch positioniert. Ein
ausdrücklicher Wert überschreibt die automatische Ausrichtung — dann ist die
Position allerdings nicht mehr an den sichtbaren Bereich gekoppelt und muss bei
anderem Ausschnitt nachgezogen werden.

- `toolbarmargin`: *\<float>* — Randabstand der Schaltflächenleiste. default .3
- `backbuttoncoord`, `resetbuttoncoord`, `stampbuttoncoord`, `constructionbuttoncoord`, `helpbuttoncoord`: *[\<float>, \<float>]*
  - Positionen der einzelnen Schaltflächen. default NADA
- `togglerefcoord`: *[\<float>, \<float>]* — Bezugspunkt der Winkel-Schalter-Spalte. default NADA
- `gammadisplaycoord`: *[\<float>, \<float>]* — Position der aktuellen Winkelanzeige. default NADA
- `gammalistcoord`: *[\<float>, \<float>]* — Position der Winkelliste. Ohne Angabe steht sie rechtsbündig am Rand. default NADA

#### Rückgabewerte

> Bisher keine eigenen.
