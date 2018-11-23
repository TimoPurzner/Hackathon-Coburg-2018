const path = require('path');
const fs = require('fs');

var express = require("express");
var alexa = require("alexa-app");
var Speech = require('ssml-builder');

var api = require('./lib/lib');

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
        }).error(e => {
            console.log(e.error);
            return response.clear().say("Ein Fehler, es tut mir leid :(").send();
        });

        // Save that thing

        session.set(product, JSON.stringify(product));

        console.log("test response", product);
        //await search
        response.say("Ich habe " + product.name + " von " + product.brand + " gefunden");
        response.say("Willst du mehr Informationen zu dem Produkt?");
        response.say("Ich kann auch weitere Artikel suchen oder du kannst die suche mit Filtern eingrenzen, frag einfach nach verfügbaren Filtern");
        // Save relevant infos in session


        response.card({
            type: "Standard",
            title: "Mac:Rush hat für dich gefunden!",
            text: "Du hast grade ein " + product.name + " klicke auf den folgenden Link um es dir nochmal anzuschauen\n" + product.url,
            image: { // image is optional
                smallImageUrl: product.imageURL, // required
            }
        });


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

        response.say("Für dein Produkt gibt es folgende Filter Wähl einfach einen davon aus");

    }
);


alexaApp.intent("AMAZON.StopIntent", function () {
    console.log('Stopped :(');
});

if (process.env.NODE_ENV !== 'production') {
    fs.writeFile('schema.json', alexaApp.schemas.skillBuilder(), (err) => {
        if (err) throw err;
        console.log('Wrote schema.json');
    });
}

app.listen(PORT);
console.log("Listening on port " + PORT);
