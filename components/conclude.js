/************Imports*******************/
var express = require('express');
var config = require('../config/config');
var mongoose = require('mongoose');

var Data = require('../models/DataModel')
var ConcludeData = require('../models/ConclusionModel')
var conclude ={};

conclude.concludeInfo = function(data){

  for(var i = data.length-1; i >=0; i--){
    if(data[i].total > 0){
      // console.log(data[i])

      return data[i].week;  
    }
  }
  return "No commits in the past year";
  }

conclude.concludeCommits= function(data){
 
  for(var i=0;i<data.length;i++){
    data.week = new Date(data[i].week*1000)

  }
  return data;
}
// conclude.concludeInfo = function(){}
// conclude.concludeContributors = function(){}
conclude.concludeContent = function(data){
  var dependencies = [];
  if(data){
    console.log(data);
    for(var i = 0;i < data.length;i++){
      dependencies.push(data[i])
    }
  }else{
      dependencies.push('No technologies found');
  }
  return dependencies;
}
conclude.concludePunchCard = function(data){
  // console.log(data)
  var punch_card =[];
  for(var i = 0; i < 24 ;i++){
    punch_card.push({hour: i + ':00', commits: 0});
  }
  for(var i = 0; i<data.length; i++){
    punch_card[data[i].hour].commits += data[i].commits;
  }
  return punch_card;
}

conclude.concludeContributors = function(contributors){
  if(contributors.length > 30){
    var sortedContributors = contributors.sort(function(a, b){return a.y-b.y});
    var newContributors = [];
    for(var i = sortedContributors.length-1; i > sortedContributors.length-16; i--){
      newContributors.push(sortedContributors[i]);
    }
    console.log(newContributors);
    return newContributors
  }else{
    return contributors;
  }
}

conclude.concludeRepo = function(id, sendId){
var concludeData = new ConcludeData();
  Data.findById(id,function(err,data){
    if(err){
      console.error(err)
    }else{

      concludeData.info = data.info;
      concludeData.info.last_commit = conclude.concludeInfo(data.commits);
      concludeData.contributors = conclude.concludeContributors(data.contributors);
      concludeData.commits = conclude.concludeCommits(data.commits);
      concludeData.content = conclude.concludeContent(data.content);
      concludeData.punch_card =conclude.concludePunchCard(data.punch_card);
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