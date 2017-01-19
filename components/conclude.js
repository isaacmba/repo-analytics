/************Imports*******************/
var express = require('express');
var config = require('../config/config');
var mongoose = require('mongoose');
var Data = require('../models/DataModel')
var ConcludeData = require('../models/ConclusionModel')


/****************Vars*******************/

var conclude ={};

/****************conclude***************/

conclude.concludeInfo = function(data){

  //Get the last commit week
  for(var i = data.length-1; i >=0; i--){
    if(data[i].total > 0){
      return data[i].week;  
    }
  }
  return "No commits in the past year";//if there are no commits
}

/////Conclude punch card////////
conclude.concludePunchCard = function(data){

  var punch_card =[];

  //Set up the array for the chart
  for(var i = 0; i < 24 ;i++){ 
    punch_card.push({x: i , y: 0});
  }
  //fill the array with data
  for(var i = 0; i<data.length; i++){
    punch_card[data[i].x].y += data[i].y;
  }

  return punch_card;
}

//////Conclude contributores/////////////
conclude.concludeContributors = function(contributors){

  //If there are more then 30 grab only 15
  if(contributors.length > 30){

    var sortedContributors = contributors.sort(function(a, b){return a.y-b.y});//sort by contributions
    var newContributors = [];

    for(var i = sortedContributors.length-1; i > sortedContributors.length-16; i--){
      newContributors.push(sortedContributors[i]);
    }

    return newContributors;

  }else{
    return contributors;
  }
};

////conclude repo///////////
conclude.concludeRepo = function(id, sendId){

var concludeData = new ConcludeData();
  Data.findById(id,function(err,data){
    if(err){
      console.error(err)
    }else{
      if(data.info){
        concludeData.info = data.info;
      };
      if(data.commits){
        concludeData.info.last_commit = conclude.concludeInfo(data.commits);
        concludeData.commits = data.commits;
      }
      if(!data.commits){
        concludeData.info.last_commit = "No commits in the past year";
      }
      if(data.contributors){
        concludeData.contributors = conclude.concludeContributors(data.contributors);
      }
      if(data.content){
        concludeData.content = data.content;
      }
      if(data.punch_card){
        concludeData.punch_card =conclude.concludePunchCard(data.punch_card);
      }
      concludeData.save(function(err,data){
        if(err){
          sendId(null,err)
        }else{
          // console.log(concludeData.info)
          sendId(data,null)
        }
      })
    }
  })
  
  
}

 module.exports = conclude;