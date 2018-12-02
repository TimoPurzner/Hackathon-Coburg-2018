# Hackathon 2018 Alexa

Dies ist der Projektordner für den ersten Coburger Hackathon CODE:RUSH, Team Mac:Rush, Thema: Reden mit dem Onlineshop


Erreichte Ziele:
 - Suchen eines belibigen Produktes
 - Sehen von Name, Preis, Beschreibung, Produkt Bild, Marke
 - Bei bedarf abspeichern des gefundenen Produktes
 - Dynamisch setzen von Filtern ( gerade nur Farbe)
 - Alexa skill kann von allen Beta Testern genutzt werden

Made with :heart: 

Thanks to: [Daivd](https://github.com/Wachiwi) [John](https://github.com/JohnBra) [Fabian](https://github.com/Diadochokinetic) [Alexander](https://github.com/RACERXY) [Timo](https://github.com/ZeroSoulEater)

# Setup

Der Skill ist so konzipiert, dass er selbst gehosted wird. Hierbei haben wir den Anbieter Heroku gewählt. Alternativ kann er auch lokal über ngrok gehostet werden. 

Über `yarn install` werden die in der `package.json` angegebenen Abhängigkeiten installiert und kann dann mit `yarn start` gestartet werden. Wenn keine Umgebungsvariable namens `PORT` gesetzt ist, wird der Port 8080 verwendet. 

Der Skill ist gemountet unter der Route `/test`. Der Endpunkt (Heroku oder ngrok) muss in der Amazon Skill Developer Console dann mit `https://<endpoint>/test` angegeben werden.

# Alexa Skill Schema

Da das Schema mehrere Tausend zeilen lang ist (da es jeden Brand namen Enhält, damit Alexa diese besser versteht) wurde es als [File](https://github.com/ZeroSoulEater/Hackathon-Coburg-2018/blob/master/Schema.json) in diesem Projekt bereitgestellt.

Eine Beispielunterhaltung mit Dem Skill wäre:

**Mensch:** Alexa, starte baur shopping.<br/>
**Alexa:** Guten Abend … Wonach suchst du heute?<br/>
**Mensch:** Ich suche ein Kleid.<br/>
**Alexa:** Ich habe XY von MARKE gefunden. … Möchtest du mehr Infomrationen oder einen Filter setzen?<br/>
**Mensch:** Zeig mir verfügbare filter.<br/>
**Alexa:** *Liest verfügbare Filter für das Produkt vor*<br/>
**Mensch:** setzte filter *FILTERNAME*<br/>
**Alexa:** *Liest verfügbare werte für den Filter vor*<br/>
**Mensch:** Übernimm den Wert *WERT*<br/>
**Alexa:** Ich habe Produkt XY von MARKE gefunden … … … <br/>
(NOTE: Es wurde eine weitere suchanfrage mit dem gesetzen Filter und dem selben such Begriff, in diesemfall ein Kleid, gemacht)<br/>
**Mensch:** Zeige mehr Informationen.<br/>
**Alexa:** *Liest die Kurzbeschreibung des Produktes vor*. Möchtest du dir dieses Produkt merken?<br/>
**Mensch:** Ja<br/>
**Alexa:** Ok Schau auf dein Handy, für mehr Informationen.



