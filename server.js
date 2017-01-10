var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static('public'));
app.use(express.static('node_modules'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/login',function(req,res,next){
  res.send(req.body);
})

var port = process.env.PORT || '4000';

app.listen(port);
