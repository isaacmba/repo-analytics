/*********include****************/
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
var mongoose = require('mongoose');
var enriched = require('./components/enriched'); 



/**********Set Up****************/
var auth = expressJWT({secret:"myLittleSecret"})

var app = express();

mongoose.connect('mongodb://localhost/repos');

app.use(express.static('public'));
app.use(express.static('node_modules'));

app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({extended: false}));

// app.use('/repo', repo); 
// app.use('/', analyze)

var RawData = require('./models/rawDataModel')
/*************API Functionality***************/



/*******************Event Handlers*******************/

//Sending HTML on first GET
app.get('/', function (req, res) {
   res.sendFile(__dirname + "/index.html");
});

app.post('/login',function(req,res,next){
  res.send(req.body);
})


/***********test**********/

app.get('/:owner/:repo/info', function (req, res) {
  analyze.analyzeRepo(req.params.owner, req.params.repo, function(id,err){
     if(err){
    console.error(err)
   }else{
    enriched.info(id,function(id,err){
      if(err){
        console.error(err);
      }else{
        console.log(id)
      }
    })
    
   }

  })
});
app.get('/:owner/list', function (req, res){
  analyze.getRepos(req.params.owner, function(id,err){
     if(err){
    console.error(err)
   }else{
    enriched.repoList(id,function(id,err){
      if(err){
        console.error(err);
      }else{
        console.log(id)
      }
    })
    
   }
  })
})
app.get('/:owner/:repo/commits', function (req, res){
  analyze.getCommits(req.params.owner, req.params.repo, function(id,err){
     if(err){
    console.error(err)
   }else{
    enriched.commits(id,function(id,err){
      if(err){
        console.error(err);
      }else{
        console.log(id)
      }
    })
    
   }
  })
})

app.get('/:owner/:repo/contributors', function (req, res) {
  analyze.getContributors(req.params.owner, req.params.repo, function(id,err){
   if(err){
    console.error(err)
   }else{
    enriched.contributors(id,function(id,err){
      if(err){
        console.error(err);
      }else{
        console.log(id)
      }
    })
    
   }
  })
})
app.get('/:owner/:repo/content', function (req, res) {
  analyze.getContent(req.params.owner, req.params.repo, function(id,err){
     if(err){
    console.error(err)
   }else{
    enriched.content(id,function(id,err){
      if(err){
        console.error(err);
      }else{
        console.log(id)
      }
    })
    
   }
  })
})
app.get('/:owner/:repo/punch_card', function (req, res){
  analyze.getPunchCard(req.params.owner, req.params.repo, function(id,err){
     if(err){
    console.error(err)
   }else{
    enriched.punchCard(id,function(id,err){
      if(err){
        console.error(err);
      }else{
        console.log(id)
      }
    })
    
   }

  })
})


/*************************/

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
 

var port = process.env.PORT || '4000';

app.listen(port);




