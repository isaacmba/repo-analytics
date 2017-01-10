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
  url: '',
  headers: {
    'User-Agent': 'request'
  }
};

/**************Helper funcs*******************/

// function callback(error, response, body) {
//   if (!error && response.statusCode == 200) {
//     return body;
//   }else{
//     return error;
//   } 
// }

/*************API Functionality***************/


/*******************Event Handlers*******************/

//Sending HTML on first GET
app.get('/', function (req, res) {
   res.sendFile(__dirname + "/index.html");
});

app.post('/login',function(req,res,next){
  res.send(req.body);
})

//Get a list of all user repo's and return it to client
app.get('/repos', function (req, res) {
  
  options.url = 'https://api.github.com/users/dfntlymaybe/repos';//for now its just static data
  console.log('getting repos');

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      console.log(info);
      res.json(info);
    }
  })
});

//Get specific repo and return it to the client
app.get('/repo', function (req, res) {

  options.url = 'https://api.github.com/repos/dfntlymaybe/rereddit'  //for now its just static data
  console.log('getting repo');//dev
  
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      res.json(info);
    }
    else{
      console.log(error);
    } 
  })
});
 

var port = process.env.PORT || '4000';

app.listen(port);




