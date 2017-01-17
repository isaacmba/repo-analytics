var mongoose = require('mongoose');

var RawListSchema = new mongoose.Schema({
  repoList:Array

})

var RepoList = mongoose.model('RepoList', RawListSchema);
module.exports = RepoList;
