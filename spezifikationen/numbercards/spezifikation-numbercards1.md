# Spezifikation numbercards 1
Mail, Yannick, 22.11.2024

Ulli hatte uns in Cinderella die Zahlenbau-Karten Komponente gebaut, mit der wir Zahlen in ihre Stellenwerte zerlegen können: 

https://vam.dzlm.de/vams/beta/VAM-Framework-315U%20Zahlenbaukarten.html

## Konfiguration:

- Die verfügbaren Stellenwerte sollten durch Angabe des größten Stellenwerts festgelegt werden können (z. B.: "max_place_value: ZT“ stellt ein, dass E, Z, H, T, ZT Karten verfügbar sind)

- Die initialen Farben der Karten sollten durch einen booleschen Parameter im Editor voreingestellt werden können („montessori: true/false“). 

- Während der Nutzung sollten die Farben ein- und ausgeschaltet werden können. Vermutlich ist hier die beste/einfachste Lösung ein Button, der an der Komponente hängt. Ein solcher Button sollte im Editor durch einen booleschen Parameter verfügbar gemacht oder gesperrt werden können („toggle_button: true/false“)

- Das alpha der zusammengesetzten Zahl sollte im Editor mit einem Wert zwischen 0 und 1 festgelegt werden können („fade_alpha" 0 = vollständig transparent/unsichtbar, 0.2 = 20% transparent, 1 = undurchsichtig; 0.2 default)

- Die initial gelegte Zahl sollte als Wert im Editor voreingestellt werden können.

- Der initiale Zustand der Zahlenbau-Karten sollte durch einen booleschen Parameter als ein- oder ausgeklappt festgelegt werden können („initially_split: true/false“)

- Die Möglichkeit, alle Karten zu verändern, sollte durch einen booleschen Parameter im Editor voreingestellt werden können („editable: true/false“). Alternativ (nice-to-have): es sollte im Editor voreingestellt werden können, welche Karten veränderbar sind („editable: ZT, H, E“ würde nur diese Stellenwerte veränderbar machen).


## Validierung:

- Die gelegte Zahl (= Wert der Komponente) sollte für die Validierung ausgelesen werden können als Komponente/{NUMBER_VALUE}, o.ä.

- Auch die individuellen Stellenwerte sollten ausgelesen werden können, z. B. Komponente/{ZT_VALUE}, o.ä.

- Wenn möglich, sollte auch der ein- oder ausgeklappte Zustand ausgelesen werden können, um z. B. das Feedback zu geben, dass die Zahl vor der Überprüfung noch zusammengefügt werden muss.Eher nice-to-have, da sowas auch durch die Lehrkraft aufgefangen werden könnte.

- Die oben genannten Werte sollten von anderen Komponenten referenziert werden können (primär von Formel-/Textfeld).