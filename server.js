/*********include****************/

var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var expressSession = require('express-session');




/**********Set Up****************/

var app = express();

app.use(express.static('public'));
app.use(express.static('node_modules'));

app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({extended: false}));


/****************Vars*********************/

var rootUrl = "https://api.github.com";
var CLIENTID = "89e05ffc8792b80ca766";
var CLIENTSECRET = "04fb4a8693571d21899733433ebb2dbf9cb9e85a";
var POSURL = "?client_id=" + CLIENTID +"&client_secret=" + CLIENTSECRET;


/**************middleware***********************/



/*************API Functionality***************/

var getInfoFromApi = function(url,res){

  var options = {
    url: url,
    headers: {
      'User-Agent': 'repo_analytics'
    }
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(response.headers.link)
      var info = JSON.parse(body);
      res.json(info);
    }
  })
}

/*******************Event Handlers*******************/

//Sending HTML on first GET
app.get('/', function (req, res) {
   res.sendFile(__dirname + "/index.html");
});

app.post('/login',function(req,res,next){
  res.send(req.body);
})

//Get a list of all user repo's and return it to client
app.get('/repos/:owner', function (req, res) {
  
  var url = rootUrl + '/users/' + req.params.owner + '/repos' + POSURL;
  getInfoFromApi(url, res);

});

//Get specific repo and return it to the client
app.get('/repo/:owner/:repo', function (req, res) {

  var url = rootUrl + '/repos/' + req.params.owner + '/' + req.params.repo + '/' + POSURL;
  getInfoFromApi(url, res);
});

app.get('/fullrepo/:owner/:repo', function (req, res) {

  var baseUrl = rootUrl + '/repos/' + req.params.owner + '/' + req.params.repo;
  var options = {
    url: baseUrl,
    headers: {
      'User-Agent': 'repo_analytics'
    }
  };

  var data = {}; 
  
  options.url = baseUrl + '' + POSURL;
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("first request");
      var info = JSON.parse(body);
      data.info = info;
    }

    options.url = baseUrl + '/stats/commit_activity' + POSURL;
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("second request");
        var info = JSON.parse(body);
        data.commits = info;
      }

      options.url = baseUrl + '/stats/contributors' + POSURL;
      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log("third request");
          var info = JSON.parse(body);
          data.contributores = info;
        }else{
          console.log(error);
        }

        options.url = baseUrl + '/contents/package.json/' + POSURL;
        request(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log("forth request");
            var info = JSON.parse(body);
            data.package = info;

            res.send(data);

          };
        });     
      });
    });   

  // var punchUrl = url + '/stats/punch_card';

  });
});





/////////git auth///////////
app.use(expressSession({ secret: 'mySecretKey' }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/github',passport.authenticate('github'));

passport.serializeUser(function(user,done){
  done(null,user);
})

passport.deserializeUser(function(user,done){
  done(null,user);
})

passport.use(new GitHubStrategy({
    clientID: CLIENTID,
    clientSecret: CLIENTSECRET,
    callbackURL: "http://127.0.0.1:4000/auth/github/callback"
  },

  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
      console.log(accessToken)
      return done(null,{profile:profile._json, accessToken:accessToken})
    })
}
));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    console.log(req.user.profile)
    // Successful authentication, redirect home.
    res.redirect('/');
  });
app.get('/',function(req,res){
  console.log(req.user)
})
app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
})
 
var port = process.env.PORT || '4000';

app.listen(port);




