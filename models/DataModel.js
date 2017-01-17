var mongoose = require('mongoose');

var RawDataSchema = new mongoose.Schema({

  info:Object,
  commits:Object,
  contributors:Object,
  punch_card:Object,
  content:Object

})

var Data = mongoose.model('Data',RawDataSchema);

module.exports = Data;
