/************Imports*******************/
var express = require('express');
var config = require('../config/config');
var mongoose = require('mongoose');
var router = express.Router();
var base64 = require('base-64');


var Data = require('../models/DataModel')
var RepoList = require('../models/ListModel')


var enriched={};
  
enriched.repoList = function(id ,sendId){
  enrichedRepoList=[];
  RepoList.findById(id,function(err,data){
    // console.log(data.repoList[0][]);
    if(data.repoList){
        for(var i=0;i<data.repoList.length;i++){
          for (var j = 0;j<data.repoList[i].length;j++){
            var repo ={
              owner: data.repoList[i][j].owner.login,
              description:data.repoList[i][j].description,
              created_at:data.repoList[i][j].created_at,
              name:data.repoList[i][j].name,
              forks: data.repoList[i][j].forks,
              stargazers: data.repoList[i][j].stargazers_count,
              avatar: data.repoList[i][j].owner.avatar_url
            }
            if(!repo.description){
              repo.description = 'No Description Found'
            }
            enrichedRepoList.push(repo);
          }
        }
          // console.log(enrichedRepoList);
          data.repoList = enrichedRepoList
          data.save(function(err,data){
            if(err){
              sendId(null,err);
            }else{
              // console.log(data._id)
              sendId(data,null);
            }
          }) 
    }else{
      console.log('i am here')
      sendId(null, {error: "User Not Found"});
    }
    
  })
};
enriched.commits= function(rawData){
  
  enrichedCommits=[];
    for(var i =0;i<rawData.length;i++){
      commit = {
        week:rawData[i].week,
        total:rawData[i].total
      }
      enrichedCommits.push(commit);
    }
  return enrichedCommits;
  

};
// enriched.info= function(rawData){

//     var info = {
//         repo_name:rawData.name,
//         stargazers_count:rawData.stargazers_count,
//         forks:rawData.forks,
//         owner:rawData.owner.login,
//         avatar:rawData.owner.avatar_url
//         }

//    return info;

// }
enriched.content= function(rawData){
  var dependencies =[];


    var content = JSON.parse(base64.decode(rawData.content))
    if(content.dependencies){
       for(var i = 0;i < Object.keys(content.dependencies).length;i++){
        var temp = Object.keys(content.dependencies)[i].replace('.',' ');
        // console.log(temp)
        dependencies.push(temp)
        }
    }
    if(content.devDependencies){
       for(var i = 0;i < Object.keys(content.devDependencies).length;i++){
        var temp = Object.keys(content.devDependencies)[i].replace('.',' ');
        // console.log(temp)
        dependencies.push(temp)
      }
      
    };
return dependencies;
}
enriched.contributors= function(rawData){
  enrichedContributors = [];

    for(var i=0;i<rawData.length;i++){
      for (var j = 0;j<rawData[i].length;j++){
        var contributor = {
          key:rawData[i][j].login,
          y:rawData[i][j].contributions
        }
        enrichedContributors.push(contributor);
      } 
    }

  return enrichedContributors;
};

enriched.punchCard = function(rawData){
  enrichedPunchCard = [];

    for(var i = 0; i<rawData.length; i++){
        punchCard = {
          x: rawData[i][1],
          y: rawData[i][2]
        }
        enrichedPunchCard.push(punchCard);
      }

  return enrichedPunchCard
};

enriched.enrichRepo = function(rawDataId, sendId){
  // var dbData = new Data();
  Data.findById(rawDataId,function(err,data){
    if(err){
      console.error(err);
    }else{
      console.log("enrich me")
      // if(data.info){
      //   data.info = enriched.info(data.info);
      // }
      if(data.commits){
        data.commits = enriched.commits(data.commits);
      }
      if(data.content){      
        data.content = enriched.content(data.content);
      }      
      if(data.contributors){
        data.contributors = enriched.contributors(data.contributors);
      }
      if(data.punch_card){
        data.punch_card = enriched.punchCard(data.punch_card);
      }
      data.save(function(err,data){
        console.log('Enrich: ' + data);
        if(err){
          sendId(null,err)
        }else{
          sendId(data._id,null)
        }
      })
    }
  })
}

module.exports = enriched;