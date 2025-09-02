übergeordnet:
- **hat OM erledigt?** VAM Zustand wird nicht in LK Ansicht angezeigt
> Das Problem ist aber trotzdem, dass bei der Anzeige der Folien für die LK, die Eingaben der SuS nicht zu sehen sind. Das kann eigentlich nur daran liegen, dass für die Reinitialisierung nicht die Werte aus der Submission verwendet werden, sondern aus dem State. Der State ist aber nur während der Ausführung der Aufgabe vorhanden. Im vam-Code sehe ich nur einen einzigen Zugriff auf die Submission: 
'dmprevans = divomathPreviousAnswer;
Die Variable dmprevans wird dann aber im Code nie ausgewertet. Dies muss im vam-Code verbessert werden (vermutlich in defaultstateto()).
In meiner Beispiel-Komponente (Präfix: extApi) wird zuerst der Wert aus dem State verwendet und falls vorhanden mit dem Wert aus der Submission überschrieben:
if(!isundefined(extApiConfig.clickY),ty = extApiConfig.clickY);
if(!isundefined(extApiPreviousAnswer.clickY),ty = extApiPreviousAnswer.clickY); 

> ((von Siegfried 22.08.2025 10:24))

- **noch testen** wenn Browser geschlossen und neu geöffnet, wird letzter Zustand nicht gesichert. (sollte die gleiche Ursache haben)

- visibility Attribut aus Komponentenverhalten so machen, dass Cindy sich nur zeigt, wenn Knopf gedrückt

# divisors
- **erledigt** Schieberegler (war ausgeblendet) wird bei vor/zurück wieder eingeblendet

# strapwork
- Reset auf Startzustand, bei Klick nicht alles löschen.
- **erledigt** Container mit Blobs unten ausrichten
    --> in diesem Zuge auch Reset Button anders ausgerichtet
- **erledigt** Rahmen um die Ausgangsblobs
- Musterfolgencontainer und Standardblobs ausblendbar machen
- wenn drawpatterncontainer:false, gehen ALLE Container weg.
- Wenn mit Patterncontainer RegPolys hinzugefügt und referenziert, dann wird nicht korrekt dargestellt
- Wenn Patterncontainer reingezogen, werden die Polygone getauscht, weil immer an Mauszeiger eingefügt wird.
- Wunsch: Patterncontainer Zeilen immer so viele wie richtiger Container