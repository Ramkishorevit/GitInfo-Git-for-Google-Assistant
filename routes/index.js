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
         app.data.organization = app.getRawInput();
         git.getRepositories(app.getRawInput(),function (err, stream){      
         for(var i=0;i<JSON.parse(stream).length;i++)
         {
         	repoList = repoList+'\n' + JSON.parse(stream)[i].name;

         }

         app.ask(repoList)

         });
        break;

    case REPO_NAME:
          //list(app);
          app.ask(app.data.organization);
          break;

  }
}

function list (app) {
  app.ask(app.buildRichResponse()
    .addSimpleResponse(app.getRawInput())
    .addSuggestions(
      ['STARS', 'BUGS COUNT', 'FORKS', 'COMMITS']
      )
    );
}


module.exports = router;
