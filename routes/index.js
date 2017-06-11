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
         let repo = app.getRawInput();    
          app.ask(app.buildRichResponse()
    // Create a basic card and add it to the rich response
    .addSimpleResponse(repo)
    .addBasicCard(app.buildBasicCard(`42 is an even composite number. It 
      is composed of three distinct prime numbers multiplied together. It 
      has a total of eight divisors. 42 is an abundant number, because the 
      sum of its proper divisors 54 is greater than itself. To count from 
      1 to 42 would take you about twenty-one…`)
      .setTitle('Math & prime numbers')
      .addButton('Read more')
    )
  );
          break;

  }
}

module.exports = router;
