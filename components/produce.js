/****************icnludes*********************/

var express = require('express');
var mongoose = require('mongoose');

/****************Var**********************/

var produce = {};

/*****************Produce******************/

produce.produceReport=function(data){

  //Set the format for the commits chart
  if(data.commits){
    var chartCommits = [];
    for(var i = 0;i<data.commits.length;i++){
      var commit ={
        x : new Date(data.commits[i].week*1000),
        y : data.commits[i].total
      }
      chartCommits.push(commit);
    }
    data.commits = chartCommits;
  }

  //if there are commits set the format for last commit
  if(data.info.last_commit != "No commits in the past year"){
    data.info.last_commit = new Date(data.info.last_commit*1000);
  }

  //No technologies
  if(!data.content){
    data.content = ["No Technologies Found"];
  }
  
  return data;
}

module.exports = produce;