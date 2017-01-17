/************Imports*******************/
var express = require('express');
var config = require('../config/config');
var mongoose = require('mongoose');
var router = express.Router();

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
          console.log(err);
        }else{
          console.log(data._id)
          sendId(data._id);
        }
      })
  })

};
enriched.commits= function(id,sendId){
  enrichedCommits=[];
  RawData.findById(id,function(err,data){
    // console.log(data.commits)
    for(var i =0;i<data.commits.length;i++){
      commit = {
        week:data.commits[i].week,
        total:data.commits[i].total
      }
      enrichedCommits.push(commit);
    }
    // console.log(enrichedCommits);
     var enrichedData =  new EnrichedData();
      enrichedData.commits = enrichedCommits;
      enrichedData.save(function(err,data){
        if(err){
          console.log(err);
        }else{
          console.log(data._id)
          sendId(data._id);
        }
      })
  })
};
enriched.info= function(id,sendId){
  RawData.findById(id,function(err,data){
    // console.log(data.info);
      info = {
        repo_name:data.info.name,
        stargazers_count:data.info.stargazers_count,
        forks:data.info.forks
      }
      // console.log(info)
      var enrichedData = new EnrichedData();
      enrichedData.info = info;
      enrichedData.save(function(err,data){
        if(err){
          console.log(err);
        }else{
          console.log(data._id)
          sendId(data._id);
        }
      }) 
  });
}
enriched.content= function(id,sendId){
  RawData.findById()
};
enriched.contributors= function(id){};

enriched.punchCard = function(id, sendId){
  enrichedPunchCard = [];
  RawData.findById(id,function(err,data){
    if(err)
    {
      console.log(err);
    }else{
      console.log(data);
      for(var i =0;i<data.punch_card.length;i++){
        punchCard = {
          hour: data.punch_card[i][1],
          commits: data.punch_card[i][2]
        }
        enrichedPunchCard.push(punchCard);
      }
      var enrichedData =  new EnrichedData();
       enrichedData.punch_card = enrichedPunchCard;
       enrichedData.save(function(err,data){
         if(err){
           console.log(err);
         }else{
           console.log(data._id)
           sendId(data._id);
         }
       })
    }
  
  });
};

module.exports = enriched;