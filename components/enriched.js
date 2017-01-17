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
    for(var i=0;i<data.repoList.length;i++){
      for (var j = 0;j<data.repoList[i].length;j++){
        var repo ={
          owner: data.repoList[i][j].owner.login,
          description:data.repoList[i][j].description,
          created_at:data.repoList[i][j].created_at,
          name:data.repoList[i][j].name

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
          console.log(data._id)
          sendId(data,null);
        }
      })
  })

};
enriched.commits= function(rawData){
  
  enrichedCommits=[];
  if(rawData){
    for(var i =0;i<rawData.length;i++){
      commit = {
        week:rawData[i].week,
        total:rawData[i].total
      }
      enrichedCommits.push(commit);
    }
  }else{
    enrichedCommits = false;
    return enrichedCommits;
  }
  

};
enriched.info= function(rawData){

      info = {
        repo_name:rawData.name,
        stargazers_count:rawData.stargazers_count,
        forks:rawData.forks,
        owner:rawData.owner.login,
        avatar:rawData.owner.avatar_url
      }
      return info;

}
enriched.content= function(rawData){
  if(rawData.content){
    var content = JSON.parse(base64.decode(rawData.content)) 
    return content;  
  }else{
    return false;
  }
};
enriched.contributors= function(rawData){
  enrichedContributors = [];
  if(rawData){
 
    for(var i=0;i<rawData.length;i++){
      for (var j = 0;j<rawData[i].length;j++){
        var contributor = {
          name:rawData[i][j].login,
          contributions:rawData[i][j].contributions
        }
        enrichedContributors.push(contributor);
      } 
    }
  }else{
    enrichedContributors = false;
  }
  return enrichedContributors;
};

enriched.punchCard = function(rawData){
  enrichedPunchCard = [];

      for(var i =0;i<rawData.length;i++){
        punchCard = {
          hour: rawData[i][1],
          commits: rawData[i][2]
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
      if(data.info){
        data.info = enriched.info(data.info);
      }
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