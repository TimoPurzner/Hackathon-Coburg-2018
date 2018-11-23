var express = require("express");
var alexa = require("alexa-app");
//var Speech = require('ssml-builder');

var PORT = process.env.PORT || 8080;
var app = express();

var alexaApp = new alexa.app("test");

const debug = process.env.NODE_ENV !== 'production';
//const checkCerts = process.env.NODE_ENV === 'production';

alexaApp.express({
  expressApp: app,
  checkCert: false,
  debug: debug
});

// now POST calls to /test in express will be handled by the app.request() function

// from here on you can setup any other express routes or middlewares as normal
// app.set("view engine", "pug");
// app.set('views', './src/views');

alexaApp.launch(function(request, response) {
  console.log('Launched!');
  response.say("You launched the app!");
});

alexaApp.intent("SearchIntent", {
    "dialog": {
      type: "delegate"
    },
    "slots": {
      "PRODUCT": "NAME"
    },
    "utterances": [
      "Ich suche ein {PRODUCT}",
      "Ich möchte ein {PRODUCT} finden.",
      "Gibt es ein {PRODUCT}"
    ]
  },
  function(request, response) {
    //response.say('Ich suche jetzt!').pause('1s');
    // "https://www.baur.de/suche/serp/magellan?query=iphone&start=72&locale=de_DE&count=24&clientId=BaurDe&filterValues=filter_color%3Df72&order=price-asc"
    // var element = johnslib.search({});

    console.log(request.slot('PRODUCT'));

    response.say("Hallo" + request.slot("PRODUCT") + "! Schön dich zu sehen");
  }
);

app.listen(PORT);
console.log("Listening on port " + PORT);
