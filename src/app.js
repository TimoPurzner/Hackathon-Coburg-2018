var express = require("express");
var alexa = require("alexa-app");

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
app.set("view engine", "pug");
app.set('views', './src/views');

alexaApp.launch(function(request, response) {
  console.log('Launched!');
  response.say("You launched the app!");
});

alexaApp.dictionary = {
  "names": ["matt", "joe", "bob", "bill", "mary", "jane", "dawn"]
};

alexaApp.intent("nameIntent", {
    "slots": {
      "NAME": "NAME"
    },
    "utterances": [
        "Mein name ist {NAME}",
        "Name {NAME}",
        "hallo ich bin {NAME}"
    ]
  },
  function(request, response) {
    response.say("Hallo" + request.slot("NAME") + "! Schön dich zu sehen");
  }
);

app.listen(PORT);
console.log("Listening on port " + PORT + ", try http://localhost:" + PORT + "/test");
