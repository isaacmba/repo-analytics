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

  if(page){
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
    // console.log(response.body)
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

// analyze.getMultiplPagesFromApi = function(url, page, sendData){

//   var data = [];

//   var getInfoFromApi = function(url, page){

//     var options = analyze.createOptionsObj(url, page);

//     request(options, (function (error, response, body){
//       if(!error && response.statusCode == 200){
//         var d = JSON.parse(body);
//         if(d.length === 0){
//           sendData(data);
//           return;
//         }else{
//           data.push(d);
//           console.log(d.length)
//           getInfoFromApi(url, ++page);
//         }
//       }else{
//         var data = "NOT FOUND"
//         console.log(options.url);
//         console.log(error + " status code: " + response.statusCode + body);
//       }
//     }));
//   }
//   getInfoFromApi(url, page);
// };


/****************Analyze Stats*********************/

/////////get contributores////////////
analyze.getContributors = function(owner, repo, Data, sendId) {

  console.log('analyze getting contributors');
  var page = 1;
  var url = config.rootUrl + '/repos/' + owner + '/' + repo + '/contributors' + config.POSURL + '&per_page=100&page=';
  var data = [];

  var getInfoFromApi = function(url, page){
    // console.log(url)

    var options = analyze.createOptionsObj(url, page);
    
    // console.log(options.url)
    request(options, (function (error, response, body) {
       if (!error && (response.statusCode == 200 || response.statusCode == 202)) {
         var d = JSON.parse(body);
         if(d.length === 0){
           Data.contributors = data;
           Data.save(function(err,data){
            if(err){
              sendId(null,err);
            }else{
              sendId(Data,null)
            }
           })
           return;
         }else
           data.push(d);
           console.log(d.length)
           getInfoFromApi(url, ++page);
       }else{
         data.push(false);
         console.log(response.body);
         // res.json(data);
       }
     }));

  }
  getInfoFromApi(url,page)
}
//////////get repo's list///////////
analyze.getRepos = function(owner,sendId){

  page = 1;

  var url = config.rootUrl + '/users/' + owner + '/repos' + config.POSURL + '&per_page=100&page=';
    
  var data = [];

  var getInfoFromApi = function(url, page){
    // console.log(url)

    var options = analyze.createOptionsObj(url, page);
    
    // console.log(options.url)
    request(options, (function (error, response, body) {
       if (!error && (response.statusCode == 200 || response.statusCode == 202)) {
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
           })
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
         console.log(response.body);
         // res.json(data);
       }
     }));
  }
getInfoFromApi(url,page)


}

//////get repo info//////
analyze.getInfo = function(owner, repo, Data, id, sendId){

  console.log('analyze getting info');
  
  RepoList.findById(id, function(err, data){
    if(err){
      sendId(null, err);
    }else{
      // console.log(repo);
      console.log(data.repoList[0].name);
      for(var i = 0; i < data.repoList.length; i++){
        if(repo == data.repoList[i].name){
          Data.info = data.repoList[i];
          Data.save(function(err,data){
            if(err){
              sendId(null,err);
            }
            else{
              console.log(data);
              sendId(data,null)
            }        
          });
        }
      }
    }
    
  });
  
};

///////get commits///////
analyze.getCommits = function(owner,repo, Data, sendId) {
  
  console.log('analyze getting commits');
  
  var url = config.rootUrl + '/repos/' + owner + '/' + repo + '/stats/commit_activity' + config.POSURL
  
  var options = analyze.createOptionsObj(url, 0);

  analyze.getSinglePageFromApi(options, function(data){
      Data.commits = data;
      Data.save(function(err,data){
        if(err){
          sendId(null,err);
        }
        else{
          console.log(data.commits)
          sendId(data,null)
        }
      })
    })
};

//////get content///////////////
analyze.getContent = function(owner,repo,Data,sendId){
  
  console.log('analyze getting content');
  
  url = config.rootUrl + '/repos/' + owner + '/' + repo + '/contents/package.json' + config.POSURL
  
  var options = analyze.createOptionsObj(url, 0);

  analyze.getSinglePageFromApi(options, function(data){
      Data.content = data;
      Data.save(function(err,data){
        if(err){
          sendId(null,err);
        }
        else{
          // console.log(data._id)
          sendId(data,null)
        }
      })
    })
};

//////////get punch-card///////////
analyze.getPunchCard = function(owner, repo, Data, sendId) {
  
  console.log('Analyze Getting punch card');
  
  url = config.rootUrl + '/repos/' + owner + '/' + repo + '/stats/punch_card' + config.POSURL;
  
  var options = analyze.createOptionsObj(url, 0);

  analyze.getSinglePageFromApi(options, function(data){
    Data.punch_card = data; 
    Data.save(function(err,data){
      if(err){
        sendId(null,err);
      }
      else{
        // console.log(data._id)
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
                  analyze.getPunchCard(owner, repo,data , function(data, err){
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

