var mongoose = require('mongoose');

var EnrichedDataSchema = new mongoose.Schema({
  repoList:Array,
  info:Object,
  commits:Object,
  contributors:Object,
  punch_card:Object,
  content:Object

})

var EnrichedData = mongoose.model('EnrichedData', EnrichedDataSchema);
module.exports = EnrichedData;
