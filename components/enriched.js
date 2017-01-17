/************Imports*******************/
var express = require('express');
var config = require('../config/config');
var mongoose = require('mongoose');
var router = express.Router();
var base64 = require('base-64');

var EnrichedData = require('../models/EnrichedData')
var RawData = require('../models/rawDataModel')


var enriched={};
  
enriched.repoList = function(id ,sendId){
  enrichedRepoList=[];
  RawData.findById(id,function(err,data){
    // console.log(data.repoList[0][]);
    for(var i=0;i<data.repoList.length;i++){
      for (var j = 0;j<data.repoList[i].length;j++){
        var repo ={
          name: data.repoList[i][j].owner.login,
          description:data.repoList[i][j].description,
          created_at:data.repoList[i][j].created_at,
        }
        enrichedRepoList.push(repo);
      }
    }
      // console.log(enrichedRepoList);
      var enrichedData =  new EnrichedData();
      enrichedData.repoList = enrichedRepoList;
      enrichedData.save(function(err,data){
        if(err){
          sendId(err);
        }else{
          console.log(data._id)
          sendId(data._id);
        }
      })
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
enriched.info= function(rawData){

      info = {
        repo_name:rawData.name,
        stargazers_count:rawData.stargazers_count,
        forks:rawData.forks
      }
      return info;

}
enriched.content= function(rawData){
  var content = base64.decode(rawData.content)
    return content;  
};
enriched.contributors= function(rawData){
  enrichedContributors = [];
 
    for(var i=0;i<rawData.length;i++){
      for (var j = 0;j<rawData[i].length;j++){
        var contributor = {
          name:rawData[i][j].login,
          contributions:rawData[i][j].contributions
        }
        enrichedContributors.push(contributor);
      } 
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
  var enrichedData = new EnrichedData();
  RawData.findById(rawDataId,function(err,data){
    if(err){
      console.error(err)
    }else{
      console.log("enrich me")
      enrichedData.info = enriched.info(data.info);
      enrichedData.commits = enriched.commits(data.commits);
      enrichedData.content=enriched.content(data.content);
      enrichedData.contributors = enriched.contributors(data.contributors);
      enrichedData.punch_card = enriched.punchCard(data.punch_card);
      enrichedData.save(function(err,data){
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