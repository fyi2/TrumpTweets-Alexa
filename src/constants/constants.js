var constants = Object.freeze({

  appId : 'amzn1.ask.skill.8482c014-067a-4a92-9126-0a2a88584b1c',
  dynamoDBTableName : 'POTUS',

  // Skill States
  states : {
    ONBOARDING : '',
    MAIN : '_MAIN'
  }

});

module.exports = constants;
