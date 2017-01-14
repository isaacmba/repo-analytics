/************Imports*******************/
var express = require('express');
var request = require('request');
var config = require('../config/config');


/*************SETUP******************/

var app = express();
var router = express.Router();


/*************Midleware******************/

// router.param('repo', function(req, res, next, repoName) {

//     req.repoName = repoName;
//     console.log(req.user);//dev
//     return next();
// });

/*************API Functionality***************/

var getInfoFromApi = function(url,res){

  var options = {
    url: url,
    headers: {
      'User-Agent': config.USERAGENT
    }
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
    }else{
      var data = "NOT FOUND"
      console.log(error + " status code: " + response.statusCode + response.body);
    }
    res.json(data);
  })
}


/*****************Event Handlers******************/

router.get('/:owner/:repo/info', function (req, res) {
  var url = config.rootUrl + '/repos/' + req.params.owner + '/' + req.params.repo + config.POSURL;
  console.log('Getting info');
  getInfoFromApi(url, res);
});

router.get('/:owner/:repo/commits', function (req, res) {
  var url = config.rootUrl + '/repos/' + req.params.owner + '/' + req.params.repo + '/stats/commit_activity' + config.POSURL;
  console.log('Getting commits');
  getInfoFromApi(url, res);
});

router.get('/:owner/:repo/contributors', function (req, res) {
  var url = config.rootUrl + '/repos/' + req.params.owner + '/' + req.params.repo + '/stats/contributors' + config.POSURL;
  console.log('Getting contributors');
  getInfoFromApi(url, res);
});

router.get('/:owner/:repo/content', function (req, res) {
  var url = config.rootUrl + '/repos/' + req.params.owner + '/' + req.params.repo + '/contents/package.json' + config.POSURL;
  console.log('Getting content');
  getInfoFromApi(url, res);
});

router.get('/:owner/:repo/punch_card', function (req, res) {
  var url = config.rootUrl + '/repos/' + req.params.owner + '/' + req.params.repo + '/stats/punch_card' + config.POSURL;
  console.log('Getting punch_card');
  getInfoFromApi(url, res);
});

router.get('/:owner/list/:page', function (req, res) {
  var url = config.rootUrl + '/users/' + req.params.owner + '/repos' + config.POSURL + '&per_page=20' + '&page=' + req.params.page;
  console.log('Getting repoes list page: ' + req.params.page);
  getInfoFromApi(url, res);
});

module.exports = router;