/*********include****************/

var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var expressSession = require('express-session');

var config = require('./config/config');
var repo = require('./routes/repo');

/**********Set Up****************/

var app = express();

app.use(express.static('public'));
app.use(express.static('node_modules'));

app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({extended: false}));

app.use('/repo', repo); 


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
// app.get('/repos/:owner', function (req, res) {
  
//   var data = [];

//   var getData = function(pageCounter) {
//     var options = {
//       url: config.rootUrl + '/users/' + req.params.owner + '/repos' + config.POSURL + '&per_page=100' + '&page=' + pageCounter,
//       headers: {
//         'User-Agent': 'repo_analytics'
//       }
//     };
//     console.log('url: ' + options.url);
//     request(options, function (error, response, body) {
//       if (!error && response.statusCode == 200) {

//         data.push(JSON.parse(body));
//         if(body == '[]') {
//             console.log('page empty: ' + pageCounter)
//             res.send(data);
//         } else {
//             getData(pageCounter + 1);
//         }

//       }else{
//         var info = "NOT FOUND"
//       }
//     })
//   }
//   getData(1);

// });



//Get specific repo and return it to the client
// app.get('/repo/:owner/:repo', function (req, res) {

//   var url = rootUrl + '/repos/' + req.params.owner + '/' + req.params.repo + '/' + POSURL;
//   getInfoFromApi(url, res);
// });

// app.get('/fullrepo/:owner/:repo', function (req, res) {
//   console.log("in server get func")
//   var baseUrl = config.rootUrl + '/repos/' + req.params.owner + '/' + req.params.repo;
//   var options = {
//     url: baseUrl,
//     headers: {
//       'User-Agent': 'repo_analytics'
//     }
//   };

//   var data = {}; 
  


//   options.url = baseUrl + config.POSURL;
//   request(options, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       console.log("first request");
//       var info = JSON.parse(body);
//       data.info = info;
//     }else{
//       console.log(error + " status code: " + response.statusCode);
//       data.info = "NOT FOUND";
//     }
//     options.url = baseUrl + '/stats/commit_activity' + config.POSURL;
//     request(options, function (error, response, body) {
//       if (!error && response.statusCode == 200) {
//         console.log("second request");
//         var info = JSON.parse(body);
//         data.commits = info;
//       }else{
//         console.log(error + " status code: " + response.statusCode);
//         data.commits = "NOT FOUND";
//       }

//       options.url = baseUrl + '/stats/contributors' + config.POSURL;
//       request(options, function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//           console.log("third request");
//           var info = JSON.parse(body);
//           data.contributores = info;
//         }else{
//           console.log(error + " status code: " + response.statusCode);
//           data.contributores = "NOT FOUND";
//         }

//         options.url = baseUrl + '/contents/package.json' + config.POSURL;
//         request(options, function (error, response, body) {
//           if (!error && response.statusCode == 200) {
//             console.log("forth request");
//             var info = JSON.parse(body);
//             data.package = info;
//           }else{
//             console.log(error + " status code: " + response.statusCode);
//             data.package = "NOT FOUND";
//           }
//           options.url = baseUrl + '/stats/punch_card' + config.POSURL;
//           request(options, function (error, response, body) {
//             if (!error && response.statusCode == 200) {
//               console.log("fifth request");
//               var info = JSON.parse(body);
//               data.punch_card = info;
//             }else{
//               console.log(error + " status code: " + response.statusCode);
//               data.punch_card = "NOT FOUND";
//             }
//             res.send(data);
//           }); 
//         });     
//       });
//     });   

//   });
// });
>>>>>>> 53a665bf35bf5da876e350e783149d6a930bfda7





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
    clientID: config.CLIENTID,
    clientSecret: config.CLIENTSECRET,
    callbackURL: config.CALLBACKURL
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




