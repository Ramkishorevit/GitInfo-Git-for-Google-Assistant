var express = require('express');
var router = express.Router();

const ApiAiApp = require('actions-on-google').ApiAiApp;
const WELCOME_INTENT = 'input.welcome';  // the action name from the API.AI intent
const TELL_ISSUES='tell.issues';
const ORGANIZATION_NAME='DefaultWelcomeIntent.DefaultWelcomeIntent-custom';
const REPO_NAME='repo.name';

var repoList='';

var git = require("../API/git.js");



router.post('/assistant', function(req, res, next) {
  
   const app = new ApiAiApp({request: req, response: res});
   app.ask('You are yet to create a git repo mate!');
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
         	repoList = JSON.parse(stream)[i].name +' , ';
         }
         app.ask(repoList)
      });
        break;

  }
}

module.exports = router;
