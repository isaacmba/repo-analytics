/************Imports*******************/
var express = require('express');
var request = require('request');
var config = require('../config/config');
var passport = require('passport');

var GitHubStrategy = require('passport-github2').Strategy;


/*************SETUP******************/

var app = express();
var router = express.Router();


/*************Midleware******************/


/*************API Functionality***************/

var getInfoFromApi = function(url, res , retry){

  var options = {
    url: url,
    headers: {
      'User-Agent': config.USERAGENT
    }
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      res.json(data);
    }else if(retry == 0){
      console.log('another try: ' + options.url)
      getInfoFromApi(url, res, ++retry);
    }else{
      var data = "NOT FOUND"
      console.log(options.url);
      console.log(error + " status code: " + response.statusCode + body);
      res.json(data);
    }
    
  })
}


/*****************Event Handlers******************/

router.get('/:owner/:repo/info', function (req, res) {
  var url = config.rootUrl + '/repos/' + req.params.owner + '/' + req.params.repo + config.POSURL;
  console.log('Getting info');
  getInfoFromApi(url, res, 0);
});

router.get('/:owner/:repo/commits', function (req, res) {
  var url = config.rootUrl + '/repos/' + req.params.owner + '/' + req.params.repo + '/stats/commit_activity' + config.POSURL;
  console.log('Getting commits');
  getInfoFromApi(url, res, 0);
});

router.get('/:owner/:repo/contributors', function (req, res) {
  var url = config.rootUrl + '/repos/' + req.params.owner + '/' + req.params.repo + '/stats/contributors' + config.POSURL;
  console.log('Getting contributors');
  getInfoFromApi(url, res, 0);
});

router.get('/:owner/:repo/content', function (req, res) {
  var url = config.rootUrl + '/repos/' + req.params.owner + '/' + req.params.repo + '/contents/package.json' + config.POSURL;
  console.log('Getting content');
  getInfoFromApi(url, res, 0);
});

router.get('/:owner/:repo/punch_card', function (req, res) {
  var url = config.rootUrl + '/repos/' + req.params.owner + '/' + req.params.repo + '/stats/punch_card' + config.POSURL;
  console.log('Getting punch_card');
  getInfoFromApi(url, res, 0);
});

router.get('/:owner/list/:page/:token', function (req, res) {
 var url = config.rootUrl + '/users/' + req.params.owner + '/repos' + config.POSURL + '&per_page=50' + '&page=' + req.params.page;
 if(req.params.token != 0){
   url = config.rootUrl + '/user/repos?access_token=' + req.params.token + '&per_page=50' + '&page=' + req.params.page;
 }
 console.log('Getting repoes list page: ' + req.params.page);
 getInfoFromApi(url, res);
});
module.exports = router;