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
        url:'/user_repos/:user',
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
            // console.log("here in the app.js resolve")
            return userStats.stats();
          }]
        }
      })
      $urlRouterProvider.otherwise('login');
   }


])  