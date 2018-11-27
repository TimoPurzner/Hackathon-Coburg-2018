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

<ToDo: Einfügen />


