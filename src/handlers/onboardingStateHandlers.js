var Alexa = require('alexa-sdk');
var Speech = require('ssml-builder');
var AmazonSpeech = require('ssml-builder/amazon_speech');

// Constants
var constants = require('../constants/constants.js');

// Onboarding Handlers
var onboardingStateHandlers = Alexa.CreateStateHandler(constants.states.ONBOARDING, {

  'NewSession': function () {
    // Clean up from previous calls
    // Check for User Data in Session Attributes if not set reasonable defaults
    // Change State to Main:
    this.handler.state = constants.states.MAIN;
    this.emitWithState('LaunchRequest');
},

'AMAZON.StopIntent': function () {
  // State Automatically Saved with :tell
  this.handler.state = constants.states.MAIN;
  let speech = new AmazonSpeech();
  speech.sayAs({"interpret": 'interjection', "word": `as you wish`})
  let speechOutput = speech.ssml(true);

  this.emit(':tell', speechOutput);
},

'AMAZON.CancelIntent': function () {
  // State Automatically Saved with :tell
  this.handler.state = constants.states.MAIN;
  let speech = new AmazonSpeech();
  speech.sayAs({"interpret": 'interjection', "word": `as you wish`})
  let speechOutput = speech.ssml(true);

  this.emit(':tell', speechOutput);
},
'SessionEndedRequest': function () {
  // Force State Save When User Times Out
  this.handler.state = constants.states.MAIN;
  this.emit(':saveState', true);
},

'AMAZON.HelpIntent' : function () {
  // Account Not Linked
  this.emit(':ask', `We are onboarding do you wish to continue?`, `We are onboarding do you wish to continue?`);
},
'Unhandled': function () {
  this.emitWithState('AMAZON.HelpIntent');
}

});





module.exports = onboardingStateHandlers;
