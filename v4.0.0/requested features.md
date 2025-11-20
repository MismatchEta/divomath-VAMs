# strapwork
## 17.11.2025
- Reset Button wird von Scrollbar überlagert -> Hochrücken, wenn Scrollbar angezeigt.
- Reset Button löscht Musterfolge, soll aber aus Ausgangszustand (aus editor) zurücksetzen
- Reset Button Darstellung des Pfeils uneinheitlich auf verschiedenen Geräten/Browsern --> Lösung: Bild eines Pfeils?
- Mustercontainer wird nicht persistiert, wenn Folie vor und zurück gegangen wird.
- Scrollbar wird am Anfang nicht angezeigt, auch wenn es schon zu voll ist --> am anfang prüfen
- Separator verschiebt sich seltsam, wenn man scrollt und Folien wechselt
- Dreieck zu breit, sieht doof aus mit Marker --> Lösung: ?!

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
## früher
- **erledigt** Färben anders: Zeilenweises Markieren färbt markierte Spalten (nach RICHTUNG auffüllen, wenn in Mitte), und umgekehrt
- Einzeln geschnittene Teile mehr oder weniger beweglich (vollkommen frei)
- Zerschneiden an beliebiger Stelle und ohne Färben, beliebig oft
- --> Neues Tool zum Vereinfachen


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
