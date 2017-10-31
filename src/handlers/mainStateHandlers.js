// https://www.npmjs.com/package/ssml-builder
// https://www.npmjs.com/package/alexa-skill-test

var Alexa = require('alexa-sdk');
var request = require('request-promise');
var Speech = require('ssml-builder');
var AmazonSpeech = require('ssml-builder/amazon_speech');
//var Twit = require('twit-promise')

// Constants
const constants = require('../constants/constants.js');
const data = require(`../data/adjectives.js`)

// Helpers
const tweets = require('../helpers/tweets.js');

// Set up basic variables needed by the mainStateHandler

// var Tweet = new Twit({
//   consumer_key : "buETm0O96Y5SXJkgaywfzJyHs",
//   consumer_secret : "kSNOn17KHFwiclZjdoaHONZCWUw12b1T46k3IPZQCKny54yOFl",
//   access_token : "12123842-Oi0EVpdLmzChexBbxFLQ3MiHA1QBL84jR29JldSmJ",
//   access_token_secret : "LpX8uIXCzOp4goJCMZylFxnfNqOQ36YpzD0MTr59cUb7w"
// })

// Main Handlers
var mainStateHandlers = Alexa.CreateStateHandler(constants.states.MAIN, {

  'LaunchRequest': function() {
    let speech = new AmazonSpeech();
    var visited = this.attributes['visits'];
    if (visited < 1) {
      visited += 1
      this.attributes['visits'] = visited
      speech.say(`Welcome to the awesome tweets of the 45th president. We are going to have some fantastic fun`)
      speech.pause(`350ms`)
      speech.say(`pick one of his favorite adjectives, each one is worth diferent points`)
      speech.pause(`350ms`)
      speech.say(`We will give you that many tweets if you pick a correct adjective.`)
      speech.pause(`350ms`)
      speech.say(`just say listen to then an adjective followed by the word tweets`)
      speech.pause(`350ms`)
      let speechOutput = speech.ssml(true);
      console.log(speechOutput);
      this.emit(':ask', speechOutput,`just say listen to then an adjective followed by the word tweets`);
    } else {
      visited += 1
      this.attributes['visits'] = visited
      speech.say(`Welcome back, remember`)
      speech.pause(`350ms`)
      speech.say(`just say listen to then an adjective followed by the word tweets`)
      speech.pause(`350ms`)
      let speechOutput = speech.ssml(true);
      console.log(speechOutput);
      this.emit(':ask', speechOutput,speechOutput);
    }
  },
  'TweetRequest': function () {
    var speechResult = new AmazonSpeech();
    try {
      console.log(`In TweetRequest`);
      var guessNumber = 0
      var guessAdjective = ''
      var guessMatch = false;
      console.log(`We will check ${data.length} words`);
      var guessWord = this.event.request.intent.slots.tweetAdjective.value;
      console.log(`guessWord is ${guessWord}`);
      if (guessWord) {
        console.log(`We will check ${data.length} words`);
        for (var i = 0; i < data.length; i++) {
          console.log(`Checking ${data[i].adjective.toLowerCase()}`);
          if ( data[i].adjective.toLowerCase() === guessWord.toLowerCase() ) {
            guessNumber = Number(data[i].points);
            guessAdjective = data[i].adjective.toLowerCase()
            console.log(`We got ${guessNumber} for ${guessAdjective}`);
            guessNumber += 5;
            console.log(`We got ${guessNumber} for ${guessAdjective}`);
            guessMatch = true
          }
        }
        if (!guessMatch){
          guessNumber = 5
          guessAdjective = 'none'
          console.log(`No Match`);
        }
      } else {
        guessNumber = 5
        guessAdjective = 'none'
        console.log(`no word`);
      }
      console.log(`In Main we have the adjective ${guessAdjective} with ${guessNumber} of tweets.`);

    } catch (e) {
      let speech = new AmazonSpeech();
      speech.say(`TweetRequest Failed. Would you like to try again`)
      let speechOutput = speech.ssml(true);
      console.log(speechOutput);
      this.emit(':ask', speechOutput,speechOutput);
    }
    tweets.tweetRequest(guessNumber, guessAdjective)
    .then ((results) => {
      speechResult = results
      var speechOutput = speechResult.ssml(true);
      console.log(speechOutput);
      this.emit(':ask', speechOutput,`Would you like some more?`);

    })
    .catch((error) =>{
      console.log('One of the PROMISES failed', error);
      this.emit(':tell', `Sorry,  Twitter is overloading, try again later.`);
    })
  },


  'AMAZON.YesIntent': function() {
    this.handler.state = constants.states.MAIN;
    this.emit(':saveState', true);
    let speech = new AmazonSpeech();
    speech.say(`remember, just say listen to then an adjective followed by the word tweets`)
    let speechOutput = speech.ssml(true);
    console.log(speechOutput);
    this.emit(':ask', speechOutput,speechOutput);
  },
  'AMAZON.NoIntent': function() {
    this.handler.state = constants.states.MAIN;
    this.emit(':saveState', true);
    let speech = new AmazonSpeech();
    speech.sayAs({"interpret": 'interjection', "word": `bon voyage`})
    let speechOutput = speech.ssml(true);
    this.emit(':tell', speechOutput);
  },

  'AMAZON.StopIntent': function () {
    this.handler.state = constants.states.MAIN;
    this.emit(':saveState', true);
    let speech = new AmazonSpeech();
    speech.sayAs({"interpret": 'interjection', "word": `au revoir`})
    let speechOutput = speech.ssml(true);
    this.emit(':tell', speechOutput);
  },

  'AMAZON.CancelIntent': function () {
    // State Automatically Saved with :tell
    this.handler.state = constants.states.MAIN;
    this.emit(':saveState', true);
    let speech = new AmazonSpeech();
    speech.sayAs({"interpret": 'interjection', "word": `arrivederci`})
    let speechOutput = speech.ssml(true);
    this.emit(':tell', speechOutput);
  },

  'SessionEndedRequest': function () {
    // Force State to Save when the user times out
    this.handler.state = constants.states.MAIN;
    this.emit(':saveState', true);
  },
  'AMAZON.HelpIntent': function () {
    let speechOutput = `We are in POTUS mode,  just say listen to then an adjective followed by the word tweets. Would you like to hear tweets from AT Real Donald Trump?`
    this.emit(':ask', speechOutput, speechOutput);
  },
  'Unhandled': function () {
    this.emitWithState('AMAZON.HelpIntent');
  }

});

module.exports = mainStateHandlers;
