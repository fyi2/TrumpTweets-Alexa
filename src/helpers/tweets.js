var request = require('request-promise');
var Speech = require('ssml-builder');
var AmazonSpeech = require('ssml-builder/amazon_speech');
var Twit = require('twit-promise')

// Constants
const constants = require('../constants/constants.js');
var Tweet = new Twit({
  consumer_key : "buETm0O96Y5SXJkgaywfzJyHs",
  consumer_secret : "kSNOn17KHFwiclZjdoaHONZCWUw12b1T46k3IPZQCKny54yOFl",
  access_token : "12123842-Oi0EVpdLmzChexBbxFLQ3MiHA1QBL84jR29JldSmJ",
  access_token_secret : "LpX8uIXCzOp4goJCMZylFxnfNqOQ36YpzD0MTr59cUb7w"
})


//Helpers
const tweetCleaner = require('../helpers/tweetCleaner.js');

module.exports = {
  tweetRequest: (number,adjective) => {
    return new Promise((resolve, reject) => {
      let tweetBuffer = []
      var speech = new AmazonSpeech();
      console.log(`In tweetRequest with ${number} and ${adjective}`);
      if (adjective === 'none'){
        console.log(`You missed this time, but here are the latest 5 tweets anyway`);
        speech.say(`You missed this time, but here are the latest 5 tweets anyway`)
        speech.pause(`0.35s`)
      } else {
        console.log(`Well done your adjective ${adjective} earns you ${number} tweets out of a maximum of 16`);
        speech.say(`Well done your adjective ${adjective} earns you ${number} tweets out of a maximum of 16`)
        speech.pause(`0.35s`)
      }
      speech.say(`AT real Donald Trump says`)
      speech.pause(`0.35s`)
      console.log(`About to tweet`);
      Tweet.get('statuses/user_timeline', { user_id: '25073877', count: 200 })
      .then( (results) => {
          tweetStream = results.data
          console.log(`Promise Resolved`);
          tweet = tweetStream[0].text
          let tweetCount = 0;
          let tweetIndex = 0 ;
          let cleanTweet = '' ;
          while (tweetCount < number){
            tweet = tweetStream[tweetIndex].text
            cleanTweet = tweetCleaner.sanitize(tweet)
            if (cleanTweet != 'DROP') {
              tweetBuffer[tweetCount] = cleanTweet
              tweetCount +=1 ;
            }
            tweetIndex += 1 ;
          }
          tweetCount -= 1
          for( i = tweetCount; i> -1; i--) {
            speech.say(`${tweetBuffer[i]}`)
            speech.pause(`0.5s`)
          }
        speech.pause(`0.35s`)
        speech.say(`45th presidents latest ${number} tweets.`)
//        console.log(`${speech}`);
        resolve(speech)
//        let speechOutput = speech.ssml(true);
//        console.log(speechOutput);
//        this.emit(':ask', speechOutput,`Do you want to repeat these`);
      })
      .catch ((e) => {
        console.log(`Tweet read failed`);
        speech.say(`Twitter is over loaded. Would you like to try again`)
        let speechOutput = speech.ssml(true);
        console.log(speechOutput);
        this.emit(':ask', speechOutput,speechOutput);
  //      return speech
      })
    })
  }
}
