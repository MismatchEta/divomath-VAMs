# strapwork
## 07.04.2026
- [[PRIO]] Referenzierung doof. Wenn ich von einer Folie vorher komme möchte ich zuerst Referenzierung nehmen, wenn ich von einer Folie später zurückkomme möchte ich die letzte Submission nehmen.
    - wie umsetzen? Submissions jeweils einen Zeitstempel mitgeben?
- Marker verschwinden auf zweiter Folie mit Markerreferenz, genau dann wenn ich auf Folie 2 Undo mache, dann zurückgehe und wieder vorwärts. Wenn ich aber nach Undo nochmal was ändere, dann passt es. Wahrscheinlich wird einfach der Zustand genommen, weil keine Submission gebaut wird, wenn Undo gedrückt wird?
- **09.04.2026, erledigt** rcinteractable ist aktuell true/false, rcinteractable aber "s,p,c" für separator, polys und container. Das finden wir gut.
- Wenn ich zweireihig einfügen will, wird nur die obere Zeile übernommen. siehe Mail von Sofia vom 20.03.2026
- **09.04.2026, erledigt** Animation am Anfang der Blobs wenn Folie startet ausschaltbar machen (default: keine Animation)
    - muss kein Schalter sein, einfach ausmachen
- **09.04.2026, erledigt** Abstände und Positionierung nochmal checken, werden je nach angezeigten Komponenten uneinheitlich dargestellt (wenn nur Container angezeigt, auch teilweise abgeschnitten)
    - was macht Skalierung des Browsers, was ist wirklich falsch positioniert?
- **09.04.2026, erledigt "buttonsize"** Handle für Größe des Undo Buttons


## 16.03.2026
- [[PRIO]] Referenzierung doof. Wenn ich von einer Folie vorher komme möchte ich zuerst Referenzierung nehmen, wenn ich von einer Folie später zurückkomme möchte ich die letzte Submission nehmen.
    - wie umsetzen? Submissions jeweils einen Zeitstempel mitgeben?
- **16.03.2026, erledigt** Balken ist auf der rechten Seite wieder größer, nochmal abschneiden
- **16.03.2026, erledigt** Scrollbar Hitbox vergrößern, ist schwer zu greifen
- **09.04.2026, erledigt** nimation am Anfang der Blobs wenn Folie startet ausschaltbar machen (default: keine Animation)
    - muss kein Schalter sein, einfach ausmachen
- **09.04.2026, erledigt** Abstände und Positionierung nochmal checken, werden je nach angezeigten Komponenten uneinheitlich dargestellt (wenn nur Container angezeigt, auch teilweise abgeschnitten)
    - was macht Skalierung des Browsers, was ist wirklich falsch positioniert?
- **16.03.2026, erledigt** Bild vom Reset Knopf skaliert nicht schön.
    - nicht mit 0.9 vom Knopf skalieren, sondern Bild mit fester Größe
    - vielleicht auch als extra handle
    - **KEINE feste Größe, skaliert jetzt stattdessen richtig mit sepsize mit und hat maximale Größe**

## 12.02.2026
**alles in nächste Meeting verschoben**
- Referenzierung doof. Wenn ich von einer Folie vorher komme möchte ich zuerst Referenzierung nehmen, wenn ich von einer Folie später zurückkomme möchte ich die letzte Submission nehmen.
    - wie umsetzen? Submissions jeweils einen Zeitstempel mitgeben?
- Balken ist auf der rechten Seite wieder größer, nochmal abschneiden
- Scrollbar Hitbox vergrößern, ist schwer zu greifen

## 29.01.2026
- **02.02.2026, erledigt** Marker behält seine nicht eingerastete Position, wenn ich auf neue Folie gehe
- **NEIN** Skalierung: Kann ich in Cinderella die Skalierung basierend auf der Größe des divomath Containers konfigurieren?
- **30.01.2026, erledigt** Marker eigener Skalierungsparameter
    - **30.01.2026, erledigt** Button skaliert mit gleichem Skalierungsparameter
- **30.01.2026, erledigt** Marker schwer anfassbar: Hitbox größer ohne optische Vergrößerung?
- **30.01.2026, erledigt** Container so konfigurieren, dass wenn gewünscht nur Marker verschiebbar, Formen aber nicht verschiebbar

## 15.01.2026
- **15.01.2026, erledigt** Validierung funktionier nicht mehr, wenn Folie neu besucht wird und die eigentlich richtige Sache schon eingestellt ist --> scheinbar doch
- **15.01.2026 erledigt** Wenn ich Blobs hinzufüge, dann verschwinden sie, wenn ich die Folie neu besuche.
- **15.01.2026, erledigt** Marker verschwinden nur, wenn ich von einer vorherigen Folie komme.
- **15.01.2026, erledigt** Wenn mit Button die Sichtbarkeit einer Komponente getoggled wird, dann ändert sich der Zustand, wenn ein zweites Mal die Sichtbarkeit getoggled wird. (Seit wann geht das überhaupt?)
- **15.01.2026, erledigt** Validierung generell nochmal anschauen, das reportet nicht immer korrekt. (Bsp.: https://editor.divomath-nrw.de/folien/68c27cc37fd72b7e7d0302f4/65f088073b0cce6f7059c307/68b561021e375bb973034763/4/6965eec81a99cc6f8003f5f3)
- **22.01.2026, erledigt** Marker soll nicht mit size mitskalieren
    - **Die Ellipse skaliert schon nicht mit, damit sie groß genug zum anfassen bleibt. Wahrscheinlich sollte die eigentlich skalieren?**
- **15.01.2026, erledigt** Rechter Rand der Box schmaler, wenn fixe Länge des strips, sonst sieht es so aus, als passe noch etwas hin

## 11.12.2025
- **13.01.2026, erledigt** Button sollte nicht mit size skalieren sondern feste Größe haben, oder Bild skaliert mit
- **14.01.2026, erledigt** Separator verschiebt sich seltsam, wenn man scrollt und Folien wechselt

## 27.11.2025
- **27.11.2025** normaler Container soll auch manchmal nicht interagierbar sein

## 17.11.2025
- **26.11.25, erledigt** Reset Button wird von Scrollbar überlagert -> Hochrücken, wenn Scrollbar angezeigt.
- **26.11.25, erledigt** Reset Button löscht Musterfolge, soll aber aus Ausgangszustand (aus editor) zurücksetzen
- **26.11.25, erledigt** Reset Button Darstellung des Pfeils uneinheitlich auf verschiedenen Geräten/Browsern --> Lösung: Bild eines Pfeils?
- **26.11.25, erledigt, jetz auch konfigbar** Mustercontainer wird nicht persistiert, wenn Folie vor und zurück gegangen wird.
- **26.11.25, erledigt** Scrollbar wird am Anfang nicht angezeigt, auch wenn es schon zu voll ist --> am anfang prüfen
- Separator verschiebt sich seltsam, wenn man scrollt und Folien wechselt
- **26.11.25, erledigt???** Dreieck zu breit, sieht doof aus mit Marker --> Lösung: custom scaling

## 09.10.2025
- **erledigt** Mehrere Container pro Folie (eigentlich aber nur ein zusätzlicher statischer Container mit Referenz aus voriger Folie)
- **erledigt** Resetknopf knapp oberhalb des Containers
- **erledigt** Abstand Container und Hauptpolys vergrößeren
- **TESTEN** Reset Knopf setzt zurück auf Ausgangswert aus "cindyjs" nicht RESULT Zustand
- **erledigt** Mustercontainer hat ein Limit für alle Strips
- **TESTEN** droppolys reparieren

## früher
- Mustercontainer erweitern auf gleiche Reihenanzahl wie Container
- **erledigt** In Validierung wird der Marker nicht angezeigt.
- **erledigt** Marker kann auch nicht referenziert werden.
- **?** Wenn Polygone aus Mustercontainer eingefügt werden, werden sie auch nicht referenziert.
- **erledigt** Mustercontainer wieder nach unten
- **erledigt** kein DZLMgoldener Hintergrund, sondern schwarzer Rahmen ohne Füllung
- **erledigt** Bildchen von Händen zusätzlich zu vernünftigen Figuren
- **erledigt** Wenn Polyone aus Mustercontainer eingefügt, dann Ordnung wild (weil nach Mauszeigerposition geordnet, siehe letztes Gespräch unten)
- **erledigt** Reset auf Startzustand, bei Klick nicht alles löschen.
- **erledigt** Container mit Blobs unten ausrichten
    --> in diesem Zuge auch Reset Button anders ausgerichtet
- **erledigt** Rahmen um die Ausgangsblobs
- **erledigt** Musterfolgencontainer und Standardblobs ausblendbar machen
- **nein?!...erledigt**wenn drawpatterncontainer:false, gehen ALLE Container weg.
- Wenn mit Patterncontainer RegPolys hinzugefügt und referenziert, dann wird nicht korrekt dargestellt
- Wenn Patterncontainer reingezogen, werden die Polygone getauscht, weil immer an Mauszeiger eingefügt wird.
- Wunsch: Patterncontainer Zeilen immer so viele wie richtiger Container

# divisors
## früher
- **erledigt** Schieberegler (war ausgeblendet) wird bei vor/zurück wieder eingeblendet


# numbercards
## früher
- **taucht das noch auf??** Wenn man schnell ein- und ausklappt wird +/- oben angezeigt


# distributive
## 15.12.2025
- **erledigt, 15.12.2025** neues Tool (kreativ zerlegen, 24.11.2025, s.u.) brauchen wir nicht mehr
- **erledigt, 15.12.2025** Text und Term präsenter und getrennt
- **erledigt, 07.01.2025** Text und Term Position konfigurierbar (aber nur in divomath)
- **15.12.2025, erledigt** Schnittlinie visuell anzeigen (nicht nur Lücke) (noch nicht, die Damen überlegen nochmal)
- **15.12.2025, erledigt** Voreinstellung des Felds (was ist gefärbt? was geschnitten? Sind die Reihen geteilt? in divomath)
- **erledigt, 07.01.2025** Referenzierung implementieren
- **erledigt, 07.01.2025** Validierung implementieren

## 24.11.2025
- **brauchen wir alles nicht mehr** neue Version: (Kreativ zerlegen)
    - im Prinzip genauso, aber man kann in jede Richtung 2 mal schneiden.
    - Färben umbauen, orange Markierung zeigt Farbe in der gerade markiert würde
    - Farben spalten und zeilenweise vordefiniert, werden nacheinander genutzt.
    - Nach links und rechts (bzw. oben und unten) Färben noch überlegen
- alte Version:
    - **27.11.2025, erledigt** Voreinstellen, ob Text angezeigt oder nicht
    - **27.11.2025, erledigt** Einstellbar, ob Toolbutton verfügbar
    - **27.11.2025, erledigt** Initiales Werkzeug voreinstellbar
    - **27.11.2025, erledigt** Textgröße änderbar, damit nicht über Button liegt (oder sinnvoll automatisch machen)
    - **27.11.2025, erledigt** Zahlen ausschreiben bis 30.
    - **27.11.2025, erledigt** Position des Buttons einstellbar
    - **27.11.2025, erledigt** Einstellbar, ob man in Spalten und Zeilen gruppieren kann oder NUR zeilenweise
    - **27.11.2025, könnte sich mit einstellbarer Gruppierung erledigt haben, da Animation neu** BUG: Wenn bei (auseinandergeschobene Reihen) neue Reihen hinzugefügt werden, dann sind die neuen manchmal zusammengedrängt


## früher
- **erledigt** Färben anders: Zeilenweises Markieren färbt markierte Spalten (nach RICHTUNG auffüllen, wenn in Mitte), und umgekehrt
- Einzeln geschnittene Teile mehr oder weniger beweglich (vollkommen frei)
- Zerschneiden an beliebiger Stelle und ohne Färben, beliebig oft
- --> Neues Tool zum Vereinfachen

# Thales (Elise)
- **erledigt** in VAM überführen

# übergeordnet
- **erledigt** VAM Zustand wird nicht in LK Ansicht angezeigt
    - Problem ist, dass der Zustand vor allem aus prevAns nicht wieder so zurückkommt, wie es eingegeben wurde. Es kommt alles irgendwie als String, besonders problematisch ist das für Zahlen und booleans. Für 4.0.0 für alle hemdsärmelig gefixt.
> Das Problem ist aber trotzdem, dass bei der Anzeige der Folien für die LK, die Eingaben der SuS nicht zu sehen sind. Das kann eigentlich nur daran liegen, dass für die Reinitialisierung nicht die Werte aus der Submission verwendet werden, sondern aus dem State. Der State ist aber nur während der Ausführung der Aufgabe vorhanden. Im vam-Code sehe ich nur einen einzigen Zugriff auf die Submission: 
'dmprevans = divomathPreviousAnswer;
Die Variable dmprevans wird dann aber im Code nie ausgewertet. Dies muss im vam-Code verbessert werden (vermutlich in defaultstateto()).
In meiner Beispiel-Komponente (Präfix: extApi) wird zuerst der Wert aus dem State verwendet und falls vorhanden mit dem Wert aus der Submission überschrieben:
if(!isundefined(extApiConfig.clickY),ty = extApiConfig.clickY);
if(!isundefined(extApiPreviousAnswer.clickY),ty = extApiPreviousAnswer.clickY); 

> ((von Siegfried 22.08.2025 10:24))

- **wahrscheinlich erledigt** wenn Browser geschlossen und neu geöffnet, wird letzter Zustand nicht gesichert. (sollte die gleiche Ursache haben)

- **OM Problem??** visibility Attribut aus Komponentenverhalten so machen, dass Cindy sich nur zeigt, wenn Knopf gedrückt
