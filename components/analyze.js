/************Imports*******************/
var express = require('express');
var request = require('request');
var config = require('../config/config');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = express.Router();
var Data = require('../models/DataModel')
var RepoList = require('../models/ListModel')
var analyze = {};

/**************HELPERS******************/

analyze.createOptionsObj = function(url, page){

  if(page != 0){
    var url = url + page;
  }

  var options = {
    url: url,
    headers: {
      'User-Agent': config.USERAGENT
    }
  };

  return options;
};

analyze.getSinglePageFromApi = function(options, sendData){

  request(options, function (error, response, body){
    if (!error && (response.statusCode == 200 || response.statusCode == 202)) {
      var data = JSON.parse(body);
    }else{
      var data = false;
      console.log(response.body);
      console.log(error);
    }
    sendData(data);
  })
};


/****************Analyze Data*********************/

//////////get repo's list///////////
analyze.getRepos = function(owner,sendId){

  page = 1;
  var url = config.rootUrl + '/users/' + owner + '/repos' + config.POSURL + '&per_page=100&page=';
  var data = [];

  var getInfoFromApi = function(url, page){

    var options = analyze.createOptionsObj(url, page);
    
    request(options, (function (error, response, body){
       if(!error && (response.statusCode == 200 || response.statusCode == 202)){
         var d = JSON.parse(body);
         if(d.length === 0){
           //stop save to DB
           var repoList = new RepoList();
           repoList.repoList = data;
           repoList.save(function(err,data){
            if(err){
              sendId(null,err);
            }else{
              sendId(data._id,null)
            }
           });
           return;
         }else
           data.push(d);
           console.log(d.length)
           getInfoFromApi(url, ++page);
       }else{
        if(data.length === 0){
          var repoList = new RepoList();
          repoList.repoList = null;
          repoList.save(function(err,data){
            if(err){
              sendId(null,err);
            }else{
              sendId(data._id,null)
            }
          })
        }
       }
     }));
  }
getInfoFromApi(url,page);
};


/////////get contributores////////////
analyze.getContributors = function(owner, repo, paasedData, sendId){

  console.log('Getting contributors');
  var page = 1;
  var url = config.rootUrl + '/repos/' + owner + '/' + repo + '/contributors' + config.POSURL + '&per_page=100&page=';
  var data = [];

  var getInfoFromApi = function(url, page){

    var options = analyze.createOptionsObj(url, page);
    
    request(options, (function (error, response, body){

      if(!error && (response.statusCode == 200 || response.statusCode == 202)){
        var d = JSON.parse(body);
        if(d.length === 0){
          paasedData.contributors = data;
          paasedData.save(function(err,data){
            if(err){
              sendId(null,err);
            }else{
              sendId(data,null)
            }
          })
          return;
        }else{
          data.push(d);
          console.log(d.length)
          getInfoFromApi(url, ++page);
        }
      }else{
        data.push(false);
      }
    }));
  }
  getInfoFromApi(url,page)
}


//////get repo info//////
analyze.getInfo = function(owner, repo, paasedData, id, sendId){

  console.log('Getting info');
  
  RepoList.findById(id, function(err, data){
    if(err){
      sendId(null, err);
    }else{
      for(var i = 0; i < data.repoList.length; i++){
        if(repo == data.repoList[i].name){
          paasedData.info = data.repoList[i];
          paasedData.save(function(err,data){
            if(err){
              sendId(null,err);
            }
            else{
              sendId(data,null)
            }        
          });
        }
      }
    }  
  });
};

///////get commits///////
analyze.getCommits = function(owner,repo, paasedData, sendId) {
  
  console.log('Getting commits');
  
  var url = config.rootUrl + '/repos/' + owner + '/' + repo + '/stats/commit_activity' + config.POSURL;
  var options = analyze.createOptionsObj(url, 0);

  analyze.getSinglePageFromApi(options, function(data){
    paasedData.commits = data;
    paasedData.save(function(err,data){
      if(err){
        sendId(null,err);
      }
      else{
        console.log('raw commits: ' + data);
        sendId(data,null)
      }
    })
  })
};

//////get content///////////////
analyze.getContent = function(owner,repo,paasedData,sendId){
  
  console.log('Getting content');
  
  url = config.rootUrl + '/repos/' + owner + '/' + repo + '/contents/package.json' + config.POSURL
  var options = analyze.createOptionsObj(url, 0);

  analyze.getSinglePageFromApi(options, function(data){
    paasedData.content = data;
    paasedData.save(function(err,data){
      if(err){
        sendId(null,err);
      }
      else{
        sendId(data,null)
      }
    })
  })
};

//////////get punch-card///////////
analyze.getPunchCard = function(owner, repo, paasedData, sendId) {
  
  console.log('Getting punch card');
  
  url = config.rootUrl + '/repos/' + owner + '/' + repo + '/stats/punch_card' + config.POSURL;
  var options = analyze.createOptionsObj(url, 0);

  analyze.getSinglePageFromApi(options, function(data){

    paasedData.punch_card = data; 
    paasedData.save(function(err,data){
      if(err){
        sendId(null,err);
      }
      else{
        sendId(data,null)
      }
    })
  })
};


//Get all data for specific repo from gitHub api and save it
analyze.analyzeRepo = function(owner, repo, listId, sendId){
  var data = new Data();
  analyze.getInfo(owner, repo, data, listId, function(data, err){
    if(err){
      console.error(err);
    }else{
      analyze.getCommits(owner, repo, data, function(data, err){
        if(err){
          console.error(err);
        }else{
          analyze.getContributors(owner, repo, data, function(data, err){
            if(err){
              console.error(err);
            }else{
              analyze.getContent(owner, repo, data, function(data, err){
                if(err){
                  console.error(err);
                }else{
                  analyze.getPunchCard(owner, repo, data , function(data, err){
                    if(err){
                      console.error(err);
                    }else{           
                      sendId(data.id);
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

module.exports = analyze;

