var app  = angular.module('repoApp',['ui.router']);

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
        }]
       }
      })
      $urlRouterProvider.otherwise('login');
   }


])