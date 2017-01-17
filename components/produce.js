var express = require('express');
var mongoose = require('mongoose');

var produce = {};

produce.produceReport=function(data){
  console.log(data);
}

module.exports = produce;