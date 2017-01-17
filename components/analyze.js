/************Imports*******************/
var express = require('express');
var request = require('request');
var config = require('../config/config');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = express.Router();

var RawData = require('../models/rawDataModel')

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
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
    }else{
      var data = "NOT FOUND"
      console.log(options.url);
      console.log(error + " status code: " + response.statusCode + body);
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


/*************************************/
analyze.getContributors = function(owner, repo, rawData, sendId) {

  console.log('analyze getting contributors');
  var page = 1;
  var url = config.rootUrl + '/repos/' + owner + '/' + repo + '/contributors' + config.POSURL + '&per_page=100&page=';
  var data = [];

  var getInfoFromApi = function(url, page){
    // console.log(url)

    var options = analyze.createOptionsObj(url, page);
    
    // console.log(options.url)
    request(options, (function (error, response, body) {
       if (!error && response.statusCode == 200) {
         var d = JSON.parse(body);
         if(d.length === 0){
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
         config.data = "NOT FOUND"
         console.log(options.url);
         console.log(error + " status code: " + response.statusCode + body);
         // res.json(data);
       }
     }));
  // analyze.getMultiplPagesFromApi(url, page, function(data){

  //   rawData.contributors = data;
  //   rawData.save(function(err,data){
  //    if(err){
  //      sendId(null,err);
  //    }else{
  //      sendId(data._id,null)
  //    }
  //   })
  // });
  }
  getInfoFromApi(url,page)
}

analyze.getRepos = function(owner,sendId){

  page = 1;

  var url = config.rootUrl + '/users/' + owner + '/repos' + config.POSURL + '&per_page=100&page=';
    
  var data = [];

  var getInfoFromApi = function(url, page){
    // console.log(url)

    var options = analyze.createOptionsObj(url, page);
    
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

// analyze.getMultiplPagesFromApi(url, page, function(data){
//   var rawData = new RawData();
//   rawData.repoList = data;
//   rawData.save(function(err,data){
//    if(err){
//      sendId(null,err);
//    }else{
//      sendId(rawData._id,null)
//    }
//   })
// });
}

//////get repo info//////
// router.get('/:owner/:repo/info', function (req, res) {
analyze.getInfo = function(owner, repo, rawData, sendId){

  console.log('analyze getting info');
  
  var url = config.rootUrl + '/repos/' + owner + '/' + repo + config.POSURL;
  
  var options = analyze.createOptionsObj(url, 0);

  analyze.getSinglePageFromApi(options, function(data){
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
  
  console.log('analyze getting commits');
  
  var url = config.rootUrl + '/repos/' + owner + '/' + repo + '/stats/commit_activity' + config.POSURL
  
  var options = analyze.createOptionsObj(url, 0);

  analyze.getSinglePageFromApi(options, function(data){
      rawData.commits = data;
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



analyze.getContent = function(owner,repo,rawData,sendId){
  
  console.log('analyze getting content');
  
  url = config.rootUrl + '/repos/' + owner + '/' + repo + '/contents/package.json' + config.POSURL
  
  var options = analyze.createOptionsObj(url, 0);

  analyze.getSinglePageFromApi(options, function(data){
      rawData.content = data;
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

analyze.getPunchCard = function(owner, repo, rawData, sendId) {
  
  console.log('Getting punch card');
  
  url = config.rootUrl + '/repos/' + owner + '/' + repo + '/stats/punch_card' + config.POSURL;
  
  var options = analyze.createOptionsObj(url, 0);

  analyze.getSinglePageFromApi(options, function(data){
    rawData.punch_card = data;
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



analyze.analyzeRepo = function(owner, repo, sendId){
  var rawData = new RawData();
  analyze.getInfo(owner, repo, rawData, function(rawData, err){
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
                  analyze.getPunchCard(owner, repo, rawData, function(rawData, err){
                    if(err){
                      console.error(err);
                    }else{           
                      sendId(rawData.id);
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

