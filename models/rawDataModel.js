var mongoose = require('mongoose');

var RawDataSchema = new mongoose.Schema({
  repoList:Array,
  info:Object,
  commits:Object,
  contributors:Object,
  punch_card:Object,
  content:Object

})

var RawData = mongoose.model('RawData',RawDataSchema);

module.exports = RawData;
