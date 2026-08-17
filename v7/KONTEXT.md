# Kontext divoVAM v7

Arbeitsnotizen für die Weiterentwicklung. Ergänzt README.md (Nutzerdoku) und
den Changelog darin. Stand: 2026-08-16.

---

## Build & Deployment

```
python3 build.py "divoVAM v7"
```

Erzeugt aus `divoVAM v7.cdy` + `divoVAM v7.html` beide Zielformate in `out/`:

- `divoVAM.html` — gepatcht, für abako.dzlm.de
- `divoVAM.cdyjs` — Modulform, für divomath

**Ablauf:** In Cinderella speichern → HTML exportieren → `build.py` → beides
hochladen. Das Skript warnt, wenn die `.cdy` deutlich älter ist als der Export
(`STALE_TOLERANCE`), also wenn das Speichern vergessen wurde.

**Warum zwei Quellen:** Der HTML-Export lässt Skripte weg. Die Skripte kommen
deshalb aus dem `.cdy`-Archiv, die Metadaten (geometry, appearance, animation)
aus dem Export.

### URL-Parameter der gepatchten HTML

| Parameter | Wirkung |
|---|---|
| `?full` | Canvas füllt das Browserfenster |
| `?rect=divomath` | 24.5 × 18.9 (Standard) |
| `?rect=classic` | 38.2 × 22.1 |
| `?rect=wide` | Ausschnitt der alten `divoVAM-full.html` |
| `?rect=a,b,c,d` | freier Ausschnitt [links,oben,rechts,unten] |

`divoVAM-full.html` ist eine Weiterleitungsdatei, die `?full&rect=wide`
anhängt — für Kompatibilität mit alten Dortmunder Links.

⚠️ **Für Storyline nie `?full` verwenden.** Ohne feste Portgröße hängt das
Verhältnis von Schrift zu Objekten an der Einbettung; das war Yasemins Fehler
im August. Feste Portgröße 885 × 519 ist der Standardfall und richtig.

---

## Fallstricke in CindyScript

Diese haben uns jeweils Stunden gekostet. Alle im Kernel verifiziert.

### `if()` mit undefinierter Bedingung führt KEINEN Zweig aus

```cindyscript
if(___, A, B)   // weder A noch B
```

Kein Fehler, keine Meldung. Betrifft jedes `if(my("feld"), …)` auf ein Feld,
das noch nicht gesetzt ist. **Lösung:** Felder mit `false` statt `NADA`
initialisieren, oder `tobool()` um die Bedingung.

### `"text" + ___` ergibt `___`

Eine einzige undefinierte Komponente macht die ganze Verkettung undefiniert.
Deshalb liefern Debug-Ausgaben oft gar nichts. Einzeln mit `isundefined()`
prüfen.

### Keine Mehrfachzuweisung

```cindyscript
[a, b] = [7, 9];   // beide bleiben ___
```

Stand im übernommenen Code an vier Stellen und hat dort nie funktioniert.

### `length(___)` verhält sich unterschiedlich

In Cinderella 0, in CindyJS undefined. Nie ungeprüft auf ein Ergebnis
anwenden, das undefined sein kann — das war die Ursache des
`to json`-Fehlers in divomath.

### `list and` / `list or` und undefinierte Einträge

`list or(l) := contains(l, true)` behandelt `___` wie false — richtig.
`list and` muss mit `tobool` arbeiten, sonst zählt `___` als „nicht false"
und die Konjunktion wird fälschlich wahr.

### Variablen sind case-sensitiv, Funktionen nicht

`nada` und `NADA` sind verschiedene Variablen (beide undefined, daher
austauschbar). `list or` und `listor` sind dieselbe Funktion.

### `regional()` sperrt aus Klassenmethoden aus

Methoden mit `:=` laufen nicht im Init-Skript-Scope. Konfigurationsvariablen,
die aus Methoden gelesen werden, dürfen **nicht** `regional` sein. Hat bei
strapwork, distributive, divisors und numbercards jeweils Fehler verursacht.

### Namen, die Modifier überschatten

Eine globale Variable namens `color`, `size`, `alpha`, `font` oder `bold`
überschattet den gleichnamigen Zeichen-Modifier. Deshalb in den VAMs
umbenannt: `blobcolors`, `cardalpha`, `maxdigits`, `linesize`.

### Cinderella vs. CindyJS

| | Cinderella | CindyJS |
|---|---|---|
| `pixelsize(..., font->)` | wertet aus | „Modifier not supported" |
| `fillpoly(..., color->)` | greift | greift bei manchen Punktlisten nicht |
| Strings in Dicts | ohne Quotes | mit eigenen Quotes |
| `length(___)` | 0 | undefined |

**Regel:** Alles, was gezeichnet oder serialisiert wird, muss im Export
gegengeprüft werden. Im Cinderella-Fenster sieht vieles richtig aus, was es
nicht ist.

---

## Framework-Konventionen

### Konfiguration

```cindyscript
'name = default to(ENVIRONMENTALPARAMS:"name", default, parse?);
'name = tobool('name);   // divomath meldet "" statt false zurück
```

`ENVIRONMENTALPARAMS` vereint URL, divomath-Zustand und Editor-Vorgabe.
`defaultstateto` und `if(!ISDIVOMATH, …)`-Blöcke sind abgeschafft.

**Priorität** (stark → schwach): PREVANSWER → Dunder aus `cindyjs` → Dunder
Top-Level → VARSTATE → Editor-Vorgabe.

⚠️ Offene Frage an Daniel: Soll eine eigene Abgabe wirklich die Referenz auf
eine frühere Folie schlagen?

### Layout

`VISIBLERECT` mit `VRTOPLEFT`, `VRTOPRIGHT`, `VRBOTTOMLEFT`, `VRBOTTOMRIGHT`.
In divomath fest 24 × 18, sonst aus `screenbounds()` abgeleitet.
`screenbounds()` nicht mehr direkt verwenden.

### Schriftgrößen

Pixelgrößen mit `FONTSCALE` multiplizieren — **dort, wo die Größe definiert
wird** (in den Klassen), nicht in den Zeichenfunktionen. `get boundingbox`
misst mit derselben Zahl, beide dürfen nicht auseinanderdriften.

### Textausgabe

`draw label(coord, text, size)` mit `mod'`-Modifiern: `mod'font`, `mod'color`,
`mod'bold`, `mod'alpha`. Das Präfix verhindert, dass ein nicht übergebener
Modifier eine gleichnamige Variable aus dem Umfeld einfängt.
`draw textbox` bleibt als Alias für die VAMs.

### Serialisierung nach JavaScript

`to json(value)` in `[FUN] Strings`. **Streng**: Strings werden dort quotiert
und escaped, die VAMs setzen keine `QUOTE` mehr von Hand.
`divomath put result` serialisiert ebenfalls darüber.

⚠️ Komponentennamen in divomath dürfen keine Leerzeichen oder Klammern
enthalten — der Name geht in den JS-Callback ein. `VAM (unstable)` erzeugt
einen Syntaxfehler.

### Performance

`roundedrectangle` mit `:=` ist teuer (vier Kreise + zwei Polygone + CSG pro
Aufruf). Bei vielen Objekten `rounded rectangle poly` und `fillpoly` nutzen.
Hat bei distributive den Unterschied gemacht.

---

## Offene Todos

### doublenumberline (in Arbeit)

Aus divoVAM 3.1.0 übernommen, Schichten 1–3d sind übertragen.

**🔴 Platzbedarf:** Das Bedienfeld braucht **38.5 × 23.5** Welteinheiten
(gemessen über alle 47 Positionen im Original). Passt knapp in `classic`
(38.2 × 22.1), **nicht** in divomath (24.5 × 18.9).

- `'barposition` als Parameter einführen, `barcoord()` daran verankern:
  `barcoord(x,y) := 'barposition + [x*'barwidth, y*'barheight]`
- Die 20 Wertmarkierungsfelder stehen auf absoluten Koordinaten und müssen
  ebenfalls `'barposition` addieren
- Startwert etwa `[-1.5, 15.5]`, testen mit `?rect=classic`
- Für divomath wäre ein echter Layout-Umbau nötig

**Weiter offen:**
- `generateURLParameters()` noch nicht übertragen (erzeugt Teilen-Link)
- `divomath set state()` / `update results()` stehen auf „Not implemented"
- Reihenfolge im Init: 3a bis Bar → 3b Textfelder → 3c Buttons → 3d
  Toggle-Skripte → Verdrahtungsblock D.3 aus 3a **zuletzt**
- ⚠️ Herkunft klären: „Mierswa" im Pfad, Betreuung unbekannt. Vor weiterer
  Arbeit klären, wer es pflegt und ob es nach divomath soll.

### Framework

- **percentagebar: UI-Skalierung** (neu, aus dem Termin mit Yasemin am 16.08.)
  Alles außer dem Streifen selbst soll gemeinsam skalierbar sein: Textfelder,
  Schriftgrößen, Schalter und vermutlich auch die Tastatur. Hintergrund ist die
  Storyline-Einbettung, wo der Streifen die volle Breite nutzen soll, das
  Bedienfeld aber unabhängig davon lesbar bleiben muss.
  - Vermutlich ein Parameter `uiscale`, der in die Konstruktoren von Toggle,
    TextInput, Button und Keyboard einfließt – analog zu FONTSCALE, aber
    konfigurierbar statt auflösungsabhängig.
  - ⚠️ Betrifft Framework-Klassen, die alle VAMs nutzen. Der Standardwert muss
    1 sein, damit sich für die anderen nichts ändert.
- **Freihandzeichnen: Brücke zum Event-Log.** Das Werkzeug schreibt nichts in
  die Ereignisdaten – eine Skizze, die niemand sieht, ist für die
  Prozessdatenauswertung verloren.
  - Vorbedingung: `log event` in `[FUN] Event Logging` steht noch in
    `if(false, ...)` mit dem Vermerk "Needs proper JSON serializer first".
    Den gibt es jetzt (`to json`), der Aufruf kann scharf geschaltet werden.
  - Offen: Was soll erhoben werden? Zeitpunkt und Farbe sind trivial. Die
    vollständige Punktfolge wäre auswertbar, aber viel Volumen; Bounding-Box
    und Strichlänge wären kompakt, sagen aber nichts über den Inhalt. Für die
    fachliche Semantik interessant wäre die Box in **Weltkoordinaten** – dafür
    bräuchte das JS Zugriff auf die CindyJS-Transformation.
  - Weg: `window.FREEHAND_APP` ist die Instanz; von dort per `cdy.evokeCS(...)`
    ins Framework, damit alle Ereignisse eine Reihenfolge und ID-Vergabe teilen.
- **Freihandzeichnen: Fenstergröße.** Die Zeichenfläche wird beim Laden
  positioniert und folgt einer späteren Änderung nicht (`@improvement`-Vermerk
  im Konstruktor).
- `draw textbox`-Aufrufstellen auf `draw label` umstellen, dann Alias entfernen
- `image scale`-Muster steht viermal fast identisch da (ImageButton,
  distributive-Toolbutton, zwei Thales-Toggles) — als Framework-Funktion
  herausziehen
- `roundedrectangle`-Performance auf percentagebar, numbercards, Button-Klassen
  übertragen
- `put result`: Wird der **Key** von divomath roh eingesetzt? Bisher
  unauffällig, also vermutlich quotieren sie selbst.
- FONTSCALE-Alternative: numbercards nutzt `size->screenresolution()`, dadurch
  ist die Schrift weltbasiert. Eleganter als der Faktor — Referenz für eine
  spätere Vereinheitlichung.

### Bei Dortmund liegend

- Kritzeln-Verifikation auf der iframe-Testseite (hängt seit Wochen)
- Daniels Gegentest zum `coloredcolindex`-Oszillieren
- Lenas Blick auf die neuen Sprachtexte im Distributivfeld

### Kleinkram

- Icon für den strapwork-Button in der Editor-Seite (`btn-vam-strapwork`)
- Veraltete `softc`-Kommentare im Thales
- Animationsleiste in Cinderella ausblenden (Oberflächensache, nicht Export)
- `README.pdf` ist veraltet

---

## Zusammenarbeit Dortmund

| Person | Zuständig für |
|---|---|
| Yasemin Platen | percentagebar, Storyline-Einbettung |
| Daniel | distributive, Validierung, divomath-seitig |
| Lena | distributive, Sprachtexte |
| Monika Post | (im Mutterschutz) |

Editor-Seite: `https://abako.dzlm.de/cindy/vam/` (`index.html` mit den
Templates je VAM — muss bei neuen Parametern mitgezogen werden).
