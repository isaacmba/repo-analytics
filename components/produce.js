var express = require('express');
var mongoose = require('mongoose');

var produce = {};

produce.produceReport=function(data){
  // console.log(data.commits.length)
  var chartCommits = [];
  for(var i = 0;i<data.commits.length;i++){
    // data.commits[i].week = new Date(data.commits[i].week*1000);
    var commit ={
      x : new Date(data.commits[i].week*1000),
      y : data.commits[i].total
    }
    chartCommits.push(commit);
  }
  data.commits = chartCommits;
  data.info.last_commit = new Date(data.info.last_commit*1000)
  // data = JSON.parse(data)
  return data;
}

module.exports = produce;