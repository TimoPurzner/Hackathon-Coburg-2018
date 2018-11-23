const path = require('path');
const fs = require('fs');

var express = require("express");
var alexa = require("alexa-app");
var Speech = require('ssml-builder');

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

// now POST calls to /test in express will be handled by the app.request() function

// from here on you can setup any other express routes or middlewares as normal
// app.set("view engine", "pug");
// app.set('views', './src/views');

alexaApp.messages.NO_INTENT_FOUND = "Why you called dat intent? I don't know bout dat";

alexaApp.pre = (req, resp, type) => {
  console.log('Requesting ', req.type(), ' inside ', req.context, ' with the following data ', req.data)
};

alexaApp.launch(function(request, response) {
  console.log('Launched!');
    let speech = new Speech()
        .say('Guten Abend!')
        .pause('100ms')
        .say('Wonach suchst du heute?');

  response.say(speech.ssml(true));
  response.shouldEndSession(false);
});

const files = fs.readdirSync('dictionaries');
for (var file in files){
  file = files[file];
  console.log('F:', file);
  const file_content = fs.readFileSync(path.join('dictionaries', file));
  const file_name = path.basename(file, '.csv');
  console.log(file, file_name, file_content.toString().trim().split('\r\n').length);
  alexaApp.dictionary[file_name] = file_content.toString().trim().split('\r\n');
}

alexaApp.intent("SearchIntent", {
    "slots": {
      "PRODUCT": "NAME"
    },
    "utterances": [
      "Ich {verb} {quantity} {size|colour|weight} {PRODUCT|category}",
      "Ich {verb} {quantity} {brand} {size|colour|weight} {PRODUCT|category}",
      "Wir {verb} (attribute} {size|colour|weight}  {PRODUCT|category} von {brand}",
      "Ich {verb} {quantity} {size|colour|weight} {PRODUCT|category} von {brand}",
      "Wir {verb} {attribute} {size|colour|weight} {PRODUCT|category}",
      "{verb} mir {quantity} {size|colour|weight} {PRODUCT} von {brand}",
      "{verb} uns {size|colour|weight} {brand} {PRODUCT}",
      "{verb} mir {PRODUCT|category}",
      "{verb} mir {brand} Produkte",
      "{verb} uns {quantity} {size|colour|weight} {brand} {PRODUCT}",
    ]
  },
  function(request, response) {
    //response.say('Ich suche jetzt!').pause('1s');
    // "https://www.baur.de/suche/serp/magellan?query=iphone&start=72&locale=de_DE&count=24&clientId=BaurDe&filterValues=filter_color%3Df72&order=price-asc"
    // var element = johnslib.search({});

    console.log(request.slot('PRODUCT'));

    response.say("Hallo " + request.slot("PRODUCT") + "! Schön dich zu sehen");
    response.shouldEndSession(false);
  }
);


alexaApp.intent("AMAZON.StopIntent", function () {
  console.log('Stopped :(');
});

if (process.env.NODE_ENV === 'development') {
  console.log(alexaApp.schemas.skillBuilder());
}

app.listen(PORT);
console.log("Listening on port " + PORT);
