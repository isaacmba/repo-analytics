var app  = angular.module('repoApp',['ui.router','nvd3']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login',{
        url:'/login',
        controller:'LoginCtrl',
        templateUrl:'/templates/login.html'
      })
     
      .state('userRepos',{
        url:'/user_repos',
        controller:'userData',
        templateUrl:'/templates/repos.html',
        resolve:{
          postPromise: ['login','$stateParams', function(login){
            return login.getRepos();
        }]}
      })
      .state('userStats',{
        url:'/stats',
        controller:'statsCtrl',
        templateUrl:'/templates/stats.html',
        resolve:{
          stats:['userStats', function(userStats){
            console.log("here")
            // console.log("here in the app.js resolve")
            return {
              package:userStats.getPackage(),
              commits:userStats.getCommits(),
              contrubutores:userStats.getContributores()
              // punches:userStats.getPunches()
            };
          }]
        }
      })
      $urlRouterProvider.otherwise('login');
   }


])  