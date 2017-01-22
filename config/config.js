/************includes********************/

var request = require('request-promise');


/*************Global Vars***************/
var config = {};


config.rootUrl = "https://api.github.com";
config.CLIENTID = "89e05ffc8792b80ca766";
config.CLIENTSECRET = "04fb4a8693571d21899733433ebb2dbf9cb9e85a";
config.CALLBACKURL = "http://127.0.0.1:4000/auth/github/callback";
config.POSURL = "?client_id=" + config.CLIENTID +"&client_secret=" + config.CLIENTSECRET;
config.USERAGENT = 'repo_analytics';


module.exports = config;