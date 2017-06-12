var express = require('express');
var router = express.Router();

const ApiAiApp = require('actions-on-google').ApiAiApp;
const WELCOME_INTENT = 'input.welcome';  // the action name from the API.AI intent
const TELL_ISSUES='tell.issues';
const ORGANIZATION_NAME='DefaultWelcomeIntent.DefaultWelcomeIntent-custom';
const REPO_NAME='repo.name';
const STARS_COUNT='stars.count';
const BUGS_COUNT='bugs.count';
const FORKS_COUNT='forks.count';
const DESCRIPTION='description.tell';
const COMMITS_INFO='commits.details';

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
         git.getRepositories(app.data.organization,function (err, stream){      
         for(var i=0;i<JSON.parse(stream).length;i++)
         {
         	repoList = repoList+'\n' + JSON.parse(stream)[i].name;

         }

         app.ask(repoList);

         });
        break;

    case REPO_NAME:
          app.data.repo=app.getRawInput()
          list(app);
          break;

    case STARS_COUNT:
         git.getRepoDetails(app.data.organization,app.data.repo,function (err, stream){     
         app.ask("There are total of "+JSON.parse(stream).stargazers_count+" stars for this repo");
         });
         break;

    case BUGS_COUNT:
         git.getRepoDetails(app.data.organization,app.data.repo,function (err, stream){     
         app.ask("There are total of "+JSON.parse(stream).open_issues_count+" open issues for this repo");
         });
         break;

    case FORKS_COUNT:
         git.getRepoDetails(app.data.organization,app.data.repo,function (err, stream){     
         app.ask("There are total of "+JSON.parse(stream).forks_count+" forks for this repo");
         });
         break;

    case DESCRIPTION:
         git.getRepoDetails(app.data.organization,app.data.repo,function (err, stream){     
         app.ask(JSON.parse(stream).description);
         });
         break;

    case COMMITS_INFO:
         git.getCommitInfo(app.data.organization,app.data.repo,function (err, stream){     
         app.ask(JSON.parse(stream)[0].commit.author.name+' made the latest commit at '+JSON.parse(stream)[0].commit.author.date+' and there are total of '+JSON.parse(stream).length+' commits made');
         });
         break;                   

  }
}

function list (app) {
  app.ask(app.buildRichResponse()
    .addSimpleResponse(app.getRawInput())
    .addSuggestions(
      ['DESCRIPTION','STARS', 'BUGS COUNT', 'FORKS', 'COMMITS']
      )
    );
}


module.exports = router;
