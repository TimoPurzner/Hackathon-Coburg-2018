const path = require('path');
const fs = require('fs');

var express = require("express");
var alexa = require("alexa-app");
var Speech = require('ssml-builder');

var api = require('./empiriecom/api');

var PORT = process.env.PORT || 8080;
var app = express();

var alexaApp = new alexa.app("test");

const debug = process.env.NODE_ENV !== 'production';
const checkCerts = process.env.NODE_ENV === 'production';

alexaApp.express({
    expressApp: app,
    checkCert: checkCerts,
    debug: debug
});

alexaApp.messages.NO_INTENT_FOUND = "Ich weiß leider nicht was ich tun soll, versuch es doch noch einmal anders";

/*
alexaApp.pre = (req, resp, type) => {
    console.log('Requesting ', req.type(), ' inside ', req.context, ' with the following data ', req.data)
};
*/

alexaApp.launch(function (request, response) {
    console.log('Launched!');
    let session = request.getSession();
    session.set("status", "start");
    let speech = new Speech()
        .say('Guten Abend!')
        .pause('100ms')
        .say('Wonach suchst du heute?');

    response.say(speech.ssml(true)).reprompt('Ich war grade abgelenkt, kannst du das bitte nochmal sagen?');
    response.shouldEndSession(false);
});

var files = fs.readdirSync('dictionaries');
for (var file in files) {
  file = files[file];
  if (file === '.gitkeep') continue;
  const file_content = fs.readFileSync(path.join('dictionaries', file));
  const file_name = path.basename(file, '.csv');
  alexaApp.dictionary[file_name] = file_content.toString().trim().replace('\r', '').split('\n');
}

files = fs.readdirSync('slots');
for (var file in files) {
  file = files[file];
  if (file === '.gitkeep') continue;
  const file_content = fs.readFileSync(path.join('slots', file));
  const file_name = path.basename(file, '.csv');
  alexaApp.customSlot(file_name.toUpperCase(), alexaApp.dictionary[file_name] = file_content.toString().trim().replace('\r', '').split('\n'));
}

alexaApp.intent("SearchIntent", {
    "slots": {
      "PRODUCT": "AMAZON.SearchQuery",
      "CATEGORY": "CATEGORY",
      "BRAND": "BRAND",
    },
    "utterances": [
      "Ich suche {PRODUCT}",
/*
      "Ich {verb} {quantity} {size|COLOUR|weight} {PRODUCT|CATEGORY}",
      "Ich {verb} {quantity} {brand} {size|COLOUR|weight} {PRODUCT|CATEGORY}",
      "Wir {verb} (attribute} {size|COLOUR|weight}  {PRODUCT|CATEGORY} von {BRAND}",
      "Ich {verb} {quantity} {size|COLOUR|weight} {PRODUCT|CATEGORY} von {BRAND}",
      "Wir {verb} {attribute} {size|COLOUR|weight} {PRODUCT|CATEGORY}",
      "{verb} mir {quantity} {size|COLOUR|weight} {PRODUCT} von {BRAND}",
      "{verb} uns {size|COLOUR|weight} {BRAND} {PRODUCT}",
      "{verb} mir {PRODUCT|CATEGORY}",
      "{verb} mir {BRAND} Produkte",
      "{verb} uns {quantity} {size|COLOUR|weight} {BRAND} {PRODUCT}",
      */
    ],
  },
  async function(request, response) {
        let session = request.getSession();
        /*
            {name, imageURL, url, description, brand}
         */
        let product = {};
        await api.getTopProduct('iPhones').then(p => {
            console.log(p);
            product = p;
        }).catch(e => {
            console.log(e.error);
            return response.clear().say("Ein Fehler, es tut mir leid :(").send();
        });

        console.log("test response", product);
        //await search
        response.say("Ich habe " + product.name + " von " + product.brand + " gefunden");
        response.say("Willst du mehr Informationen zu dem Produkt?");
        response.say("Ich kann auch weitere Artikel suchen oder du kannst die suche mit Filtern eingrenzen, frag einfach nach verfügbaren Filtern");
        // Save relevant infos in session


        response.card({
            type: "Standard",
            title: "Mac:Rush hat für dich gefunden!",
            text: `Du **hast** grade ein ${product.name} gesucht klicke auf den folgenden Link um es dir nochmal anzuschauen\n ${product.url}`,
            image: { // image is optional
                smallImageUrl: product.imageURL, // required
            }
        });

        session.set("product", JSON.stringify(product));
        session.set("status", "search");

    }
);

alexaApp.intent("FilterIntent", {
        "slots": {},
        "utterances": [
            "Zeig mir verfügbare filter",
            "Lass mich weitere Filter auswählen",
            "Ich möchte Filtern"
        ]
    },
    async function (request, response) {
        let session = request.getSession();
        response.say("Für dein Produkt gibt es folgende Filter Wähl einfach einen davon aus");

    }
);


alexaApp.intent("AMAZON.StopIntent", function () {
    console.log('Stopped :(');
});

alexaApp.intent("AMAZON.HelpIntent", function () {
    console.log('Some needs your help');
    let session = request.getSession();

    let status= session.get("status")

    switch (status) {
        case "search":
            response.say("Ich habe gerade" + product.name + " von " + product.brand + " für dich gefunden gefunden");
            response.say("Du kannst entweder mehr Informationen zu dem Produkt haben oder");
            response.say("Ich kann auch ähnlichen Artikel geben oder du kannst die suche mit Filtern eingrenzen, frag einfach nach verfügbaren Filtern");

            return response.say("").send()
            break;

        case "start":
                return response.say("Du wolltest mir grade sagen nach welchem Produkt ich suchen soll").send()
            break;
        default:
            let speech = new Speech()
                .say('Ich weiß auch gerade auch nicht')
                .pause('300ms')
                .say('sorry, sag doch einfach irgendwas?');
            return response.say(speech.ssml(true));

    }
});

if (process.env.NODE_ENV !== 'production') {
    fs.writeFile('schema.json', alexaApp.schemas.askcli('go shopping'), (err) => {
        if (err) throw err;
        console.log('Wrote schema.json');
    });
}

app.listen(PORT);
console.log("Listening on port " + PORT);
