/*********includes****************/
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var passport = require('passport');
var cookieParser= require('cookie-parser')
var GitHubStrategy = require('passport-github2').Strategy;
var expressSession = require('express-session');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var config = require('./config/config');
var analyze = require('./components/analyze'); 
var enriched = require('./components/enriched'); 
var conclude = require('./components/conclude'); 
var produce = require('./components/produce');
var mongoose = require('mongoose');



/**********Set Up****************/
var auth = expressJWT({secret:"myLittleSecret"})

var app = express();

mongoose.connect('mongodb://localhost/repos');
// mongoose.connect(process.env.MONGOLAB_GRAY_URI ||'mongodb://localhost/repos');


app.use(express.static('public'));
app.use(express.static('node_modules'));

app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({extended: false}));

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
// app.use('/repo', repo); 
// app.use('/', analyze)

// var RawData = require('./models/DataModel')



/*******************Event Handlers*******************/

//Sending HTML on first GET
app.get('/', function (req, res) {
   res.sendFile(__dirname + "/index.html");
});

//Get repo's list
app.get('/repo/:owner/:repo/:listId', function (req, res) {
  analyze.analyzeRepo(req.params.owner, req.params.repo, req.params.listId, function(id, err){
    if(err){
      console.error(err)
    }else{
      enriched.enrichRepo(id,function(id,err){
        if(err){
          console.error(err);
        }else{
          conclude.concludeRepo(id,function(data,err){
            if(err){
              console.log(err)
            }else{
              var finalData = produce.produceReport(data);
              res.send(finalData);
            }
          })
        }
      })
    }
  })
});

////Get repo's list
app.get('/:owner/list', function (req, res){
  analyze.getRepos(req.params.owner, function(id,err){
    if(err){
      console.error(err)
    }else{
      enriched.repoList(id,function(data,err){
        if(err){
          console.log(err);
          res.status(404).send(err);
        }else{
          res.send(data)
        }
      })
    }
  })
});

/************************************/

/////////git auth///////////
app.use(expressSession({ secret: 'mySecretKey' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/github',passport.authenticate('github'));

passport.serializeUser(function(user,done){
  console.log(user.accessToken)
  console.log("22")
  done(null,user);

})

passport.deserializeUser(function(user,done){
  console.log("212")
  console.log(user)
  done(null,user);
})

passport.use(new GitHubStrategy({
    clientID: config.CLIENTID,
    clientSecret: config.CLIENTSECRET,
    callbackURL: config.CALLBACKURL
  },

  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
      console.log(profile._json)
      return done(null,{profile:profile._json, accessToken:accessToken})
    })
}
));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    // console.log(req.user.profile)
    // Successful authentication, redirect home.
    var user = {username:req.user.profile.login,token:req.user.accessToken, avatar:req.user.profile.avatar_url};
    var token =jwt.sign(user, 'myLittleSecret', {expiresIn:120} )
    res.redirect('/#!/profile/'+token);
  });
app.get('/',function(req,res){
  console.log(req.user)
})
app.get('/logout', function(req,res){
  req.logout();
  // console.log(req)
  res.redirect('/');
})
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.redirect('/user_repos')
// }
 

// var port = process.env.PORT || '4000';
// app.listen(port);

app.listen(process.env.PORT || '4000');