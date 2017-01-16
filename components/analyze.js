/************Imports*******************/
var express = require('express');
var request = require('request');
var config = require('../config/config');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = express.Router();

var RawData = require('../models/rawDataModel')

var analyze = {};

analyze.getRepos = function(owner,sendId) {
  page = 1;
  var url = config.rootUrl + '/users/' + owner + '/repos' + config.POSURL + '&per_page=100' + '&page=';
  var data = [];
  var getInfoFromApi = function(url, page){
    // console.log(url)

    var options = {
      url: url+page,
      headers: {
        'User-Agent': config.USERAGENT
      }
    };
    // console.log(options.url)
  request(options, (function (error, response, body) {
     if (!error && response.statusCode == 200) {
       var d = JSON.parse(body);
       if(d.length === 0){

         //stop save to DB
         var rawData = new RawData();
         rawData.repoList = data;
         rawData.save(function(err,data){
          if(err){
            sendId(null,err);
          }else{
            sendId(data._id,null)
          }
         })
         return;
       }else
         data.push(d);
         console.log(d.length)
         getInfoFromApi(url, ++page);
     }else{
       config.data = "NOT FOUND"
       console.log(options.url);
       console.log(error + " status code: " + response.statusCode + body);
       // res.json(data);
     }
   }));
}
getInfoFromApi(url,page)
}


analyze.analyzeRepo = function(owner, repo, sendId){
  analyze.getInfo(owner, repo, function(rawData, err){
    if(err){
      console.error(err);
    }else{
      analyze.getCommits(owner, repo, rawData, function(rawData, err){
        if(err){
          console.error(err);
        }else{
          analyze.getContributors(owner, repo, rawData, function(rawData, err){
            if(err){
              console.error(err);
            }else{
              analyze.getContent(owner, repo, rawData, function(rawData, err){
                if(err){
                  console.error(err);
                }else{
                  analyze.getPunchCard(owner, repo, rawData, function(id, err){
                    if(err){
                      console.error(err);
                    }else{           
                      console.log(rawData);
                      console.log(id);
                    }
                  })
                }
              })
            }
          })
        } 
      })
    }
  })
}

//////get repo info//////
// router.get('/:owner/:repo/info', function (req, res) {
analyze.getInfo = function(owner, repo, sendId){

  console.log('Getting info');
  
  var options = {
    url:  config.rootUrl + '/repos/' + owner + '/' + repo + config.POSURL,
    headers: {
      'User-Agent': config.USERAGENT
    }
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
    }else{
      var data = "NOT FOUND"
      console.log(options.url);
      console.log(error + " status code: " + response.statusCode + body);
      
    }
      var rawData = new RawData();
       rawData.info = data;
       rawData.save(function(err,data){
        if(err){
          sendId(null,err);
        }
        else{
        // console.log(data._id)
          sendId(rawData,null)
        }
       })
  
  })

};

///////get commits///////
analyze.getCommits = function(owner,repo, rawData, sendId) {
  
  console.log('Getting info');
  
  var options = {
    url:  config.rootUrl + '/repos/' + owner + '/' + repo + '/stats/commit_activity' + config.POSURL,
    headers: {
      'User-Agent': config.USERAGENT
    }
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
    }else{
      var data = "NOT FOUND"
      console.log(options.url);
      console.log(error + " status code: " + response.statusCode + body);
      
    }
       rawData.commits = data;
       rawData.save(function(err,data){
        if(err){
          sendId(null,err);
        }else{
            sendId(rawData,null)
          }
       })
    
  })
};

analyze.getContributors = function(owner, repo, rawData, sendId) {
  var page = 1;
  var url = config.rootUrl + '/repos/' + owner + '/' + repo + '/contributors' + config.POSURL + '&per_page=100&page=';
  var data = [];
  var getInfoFromApi = function(url, page){
    // console.log(url)

    var options = {
      url: url+page,
      headers: {
        'User-Agent': config.USERAGENT
      }
    };
    // console.log(options.url)
  request(options, (function (error, response, body) {
     if (!error && response.statusCode == 200) {
       var d = JSON.parse(body);
       // console.log(d[0])
       if(d.length === 0){

         //stop save to DB
         rawData.contributors = data;
         rawData.save(function(err,data){
          if(err){
            sendId(null,err);
          }else{
            sendId(rawData,null)
          }
         })
         return;
       }else
         data.push(d);
         console.log(d.length)
         getInfoFromApi(url, ++page);
     }else{
       data = "NOT FOUND"
       console.log(options.url);
       console.log(error + " status code: " + response.statusCode + body);
       // res.json(data);
     }
   }));
}
getInfoFromApi(url,page);
}

analyze.getContent = function(owner,repo,rawData,sendId){
  
  console.log('Getting info');
  
  var options = {
    url:  config.rootUrl + '/repos/' +owner + '/' +repo + '/contents/package.json' + config.POSURL,
    headers: {
      'User-Agent': config.USERAGENT
    }
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
    }else{
      var data = "NOT FOUND"
      console.log(options.url);
      console.log(error + " status code: " + response.statusCode + body);
      
    }
       rawData.content = data;
       rawData.save(function(err,data){
        if(err){
          sendId(null,err);
        }else{
            sendId(rawData,null)
          }
       })
    
  })
};
analyze.getPunchCard = function(owner,repo,rawData,sendId) {
  
  console.log('Getting info');
  
  var options = {
    url:  config.rootUrl + '/repos/' + owner + '/' + repo + '/stats/punch_card' + config.POSURL,
    headers: {
      'User-Agent': config.USERAGENT
    }
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
    }else{
      var data = "NOT FOUND"
      console.log(options.url);
      console.log(error + " status code: " + response.statusCode + body);
      
    }
       rawData.punch_card = data;
       rawData.save(function(err,data){
        if(err){
          sendId(null,err);
        }else{
            sendId(data._id,null)
          }
       })
    
  })
};

module.exports = analyze;


