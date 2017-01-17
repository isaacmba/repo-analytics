var mongoose = require('mongoose');

var ConcludeDataSchema = new mongoose.Schema({
  
  info:Object,
  commits:Array,
  contributors:Array,
  punch_card:Object,
  content:Object

})

var ConcludeData = mongoose.model('ConcludeData', ConcludeDataSchema);
module.exports = ConcludeData;
