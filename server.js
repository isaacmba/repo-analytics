/*********include****************/

var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');


/**********Set Up****************/

var app = express();

app.use(express.static('public'));
app.use(express.static('node_modules'));

app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({extended: false}));


/****************Vars*********************/

var options = {
  url: 'https://github.com',
  headers: {
    'User-Agent': 'request'
  }
};

/**************Helper funcs*******************/

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    res.send(body);
  }else{
    console.log(error);
  } 
}

/*************API Functionality***************/

//Gettint Data from out external API
// var requestDataFromApi = function(url){
//   return request(url, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       console.log(body);
//       return (body);
//     }
//     else{
//       return (error);
//     }
//   })
// };


/*******************Event Handlers*******************/

//Sending HTML on first GET
app.get('/', function (req, res) {
   res.sendFile(__dirname + "/index.html");
});



app.listen(8000);