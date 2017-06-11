var express = require('express');
var router = express.Router();

const ApiAiApp = require('actions-on-google').ApiAiApp;
const WELCOME_INTENT = 'input.welcome';  // the action name from the API.AI intent
const TELL_ISSUES='tell.issues';
const ORGANIZATION_NAME='DefaultWelcomeIntent.DefaultWelcomeIntent-custom';
const REPO_NAME='repo.name';

var repoList='Choose a repo'+'/n';

var git = require("../API/git.js");



router.post('/assistant', function(req, res, next) {
  
   const app = new ApiAiApp({request: req, response: res});
   app.handleRequest(responseHandler);

});

function responseHandler (app) {
  // intent contains the name of the intent you defined in the Actions area of API.AI
  let intent = app.getIntent();
  switch (intent) {
    
    case WELCOME_INTENT:
         app.ask('Welcome! Tell about which git organization you wanna hear ?');
         break;


    case ORGANIZATION_NAME:
         let organization = app.getRawInput();
         git.getRepositories(app.getRawInput(),function (err, stream){      
         for(var i=0;i<JSON.parse(stream).length;i++)
         {
         	repoList = repoList+'\n' + JSON.parse(stream)[i].name;

         }

         app.ask(repoList)

         });
        break;

    case REPO_NAME:
          list(app);
          break;

  }
}

function list (app) {
  app.askWithList(app.buildRichResponse()
    .addSimpleResponse(app.getRawInput())
    .addSuggestions(
      ['Basic Card', 'List', 'Carousel', 'Suggestions']),
    // Build a list
    app.buildList('Things to learn about')
    // Add the first item to the list
    .addItems(app.buildOptionItem('MATH_AND_PRIME',
      ['math', 'math and prime', 'prime numbers', 'prime'])
      .setTitle('Math & prime numbers')
      .setDescription('42 is an abundant number because the sum of its ' +
        'proper divisors 54 is greater…')
      .setImage('http://example.com/math_and_prime.jpg', 'Math & prime numbers'))
    // Add the second item to the list
    .addItems(app.buildOptionItem('EGYPT',
      ['religion', 'egpyt', 'ancient egyptian'])
      .setTitle('Ancient Egyptian religion')
      .setDescription('42 gods who ruled on the fate of the dead in the ' +
        'afterworld. Throughout the under…')
      .setImage('http://example.com/egypt', 'Egypt')
    )
    // Add third item to the list
    .addItems(app.buildOptionItem('RECIPES',
      ['recipes', 'recipe', '42 recipes'])
      .setTitle('42 recipes with 42 ingredients')
      .setDescription('Here\'s a beautifully simple recipe that\'s full ' +
        'of flavor! All you need is some ginger and…')
      .setImage('http://example.com/recipe', 'Recipe')
    )
  );
}


module.exports = router;
