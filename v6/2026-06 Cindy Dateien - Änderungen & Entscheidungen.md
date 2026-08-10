Hier sind die To Do's aus dem Januar [[2026-01 Cindy Dateien - Änderungen & Entscheidungen]] und die To Do's auf Basis der ORW Pilotierung  (siehe Pages Dokument *Lernumgebung>Pilotierung >2026_01_08 Pilotierung ORW > Auswertung Pilotierung ORW* zusammengetragen)
## To Do's zur Programmierung

- [ ] Übergreifend @Marcus: kannst du mir bitte die Cindy - Datei erklären, sodass ich selbst Änderungen vornehmen kann (oder grob Bescheid weiß und es dann)
- [x] Warum sind die Dreiecke seit Freitag (nicht 05.06.) nicht mehr zu sehen? Hängt das mit Ullis Änderungen an Cindy zusammen? 

<mark style="background: #CACFD9;">kurzfristig:</mark>
- [ ] *Alle Applets:* | **Finger liegt auf Punkt C**, wenn man Touchscreen / iPad nutzt 
	- Apps zur Arbeit am iPad optimieren: Punkt C soll im Zugmodus so verschiebbar sein, dass man besser kontrollieren kann, wo man ihn hin verschiebt
	- Für iPad-Nutzung gibt es einen Toggle, womit man iPad-Modus einschalten kann 
	- Für mich gibt es Möglichkeit, diesen Toggle zu konfigurieren in der VAM-Erstellung
	- visuelles Feedback, wenn man C erwischt hat.
- [ ] *Applet 3* | **Winkelbeschriftung:** Beschriftungen der Winkel nicht so schön lesbar angeordnet, weil sie oft von den Dreiecksseiten durchquert werden. 
	- alle eher an der „Winkellinie“ anordnen (einfach dass es ein wenig schöner aussieht)
	- Oder bei Gamma_1 und Gamma_2 außerhalb des Winkels? 
	- Winkelbeschriftung verkleinern?
	 ![[Pasted Graphic 2.png|307x211]]
- [ ] *Alle Applets*| **Seitenbeschriftung:** Beschriftungen der Seiten liegen teilweise auf den Seiten 
- [ ] *Applet 2* | **Winkelliste:** Winkelliste verdeckt den Stempelbutton, sobald die Anzahl an Winkeln zu groß ist (3 Spalten erzeugt wurden) 
	- nur eine Spalte
	- Scrollbar
	- neuer Messwert erscheint immer ganz unten und ist immer sichtbar (Scrollbar ist also immer nach unten gescrollt) 
- [x] *Alle Applets*: **C bleibt am Bildschirmrand hängen** → kann so weit nach oben gezogen werden, dass man ihn nicht mehr zurückholen kann
	- Raum für C einschränken
- [ ] *Applet 3* | **Reset-Button/ Rückgängig-Button**: wird hier nicht benötigt 
	- Für VAM-Einstellungen Ausblenden des Reset-Buttons und des Rückgängig-Buttons (separat) ermöglichen
- [ ] *Applet 2* |**rückwirkende Zuordnung von Punkten zu Winkeln**  
	- Möglichkeit einbauen, dass dass man, wenn man auf den Winkel klickt, angezeigt bekommt, wo C lag (siehe [[2026-05-20 Ulli]] → wichtig, um die Implikationsrichtung klar zu machen)
	- Dreieck springt bei Klick auf den Winkel in die dazugehörige Konfiguration
- [ ] *Applet 1* |**Stempel in verschiedenen Farben** 
	- Stärkerer Farbverlauf
	- Möglichkeit, dass Stempel bei unterschiedlichen Winkeln verschiedene Farben hat, implementieren (nicht fix, sondern für Elise konfigurierbar einstellen! Ich finde nämlich, dass es auch Nachteil haben kann, dass Lernende dann die primär die Beobachtung in den Farben beschreiben)
- [ ] *Alle Applets* | **Abstürzen der Applets**
	- Wie verhindert man das? 
- [ ] *Alle Applets* | **VAM Einstellungen sortieren**
	- [ ] Elise: überlegt sich Sortierung am Ende
- [ ] *Applet 3* | **Winkelwert gamma**
	- Möglichkeit, den Winkelmesswert mit "gamma=" wie die anderen Winkel anzuzeigen (wieder konfigurierbar im VAM) oder nur "gamma" ohne Wert
	- → Möchte ich das dann auch wirklich in der Lernumgebung machen?
- [ ] *Applet 1b* | **Spur**
	- Stempel-Symbol auf Spur ändern (mit Toggle)
	- Spur dicker zeichnen, wie bei ggb (oder konfigurierbar machen, wie dick die Spur ist)
	- Toggle an: Spur wird gezeichnet 
	- Toggle aus: Spur wird nicht mehr gezeichnet, aber weiterhin angezeigt 
	- Rückgängig-Button: Der letzte Teil der Spur wird gelöscht (müssen nochmal schauen, wie viel sinnvoll ist) 
	- Reset-Button: Die gesamte Spur wird gelöscht / Konfiguration auf Ausgangssitutaion

<mark style="background: #CACFD9;">Langfristige Überlegungen / Änderungen:</mark>
- [ ] *Alle Applets* |**Zoom** 
	- Heranzoomen ermöglichen
- [ ] Mini-Magnete für Winkelgrößen alle 5° (oder 10°)?
- [ ] Wie bekomme ich es hin, dass die Kinder ihre Ergebnisse vom Stempeln sichern können, um darauf zurück zu greifen? (Export o.Ä.)
- [ ] Thema: Konstruktionswerkzeuge überdenken 
	- [ ] Einblendbare Toolbar einfügen? (Man kann in den Einstellungen der App entscheiden, ob man eine Toolbar zulassen möchte oder nicht)
	- [ ] Falls ich eine Tool-Bar mit Konstruktionstools nutze: DGS-Tools dezenter / kleiner in der Ecke und bei den anderen Tools (Vor-/Zurück-Button)anordnen
- [ ] alles in eine App gießen
- [ ] Digitale Hilfekarten, die erst nach einer bestimmten Interaktionszeit aufploppen (damit Lernende adaptiv Hilfe bekommen)

## To Do's zur Änderung der konkreten Apps für die Lernumgebung (mit VAM-Parametern)
- [ ] *Applet 1 & 2* | **"Bedingung erfüllt"-Signal:** Nochmal Nachdenken über Gestaltungsentscheidungen der zum Signalisieren von „Bedingung ist erfüllt“:
	- Einrastfunktion 
	- Farb-Signal bei erfüllter Bedingung
- [ ] *Applet 2:* Winkel permanent anzeigen oder nicht?