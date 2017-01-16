var request = require('request-promise');


/*************vars***************/
var config = {};


config.rootUrl = "https://api.github.com";
config.CLIENTID = "89e05ffc8792b80ca766";
config.CLIENTSECRET = "04fb4a8693571d21899733433ebb2dbf9cb9e85a";
config.CALLBACKURL = "http://127.0.0.1:4000/auth/github/callback";
config.POSURL = "?client_id=" + config.CLIENTID +"&client_secret=" + config.CLIENTSECRET;
config.USERAGENT = 'repo_analytics';

// config.getInfoFromApi = function(url){
//   // console.log(url);
//   var options = {
//     url: url,
//     headers: {
//       'User-Agent': config.USERAGENT
//     }
//   };

//   request(options, function (error, response, body) {
//     // console.log(body)
//     if (!error && response.statusCode == 200) {
//       var data = JSON.parse(body);
//     }else{
//       var data = "NOT FOUND"
//       console.log(options.url);
//       console.log(error + " status code: " + response.statusCode + body);
//     }
//     return data;
//   }).then(function(data){
    
//   })
//  };



module.exports = config;