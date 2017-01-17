var app  = angular.module('repoApp',['ui.router','nvd3','angular-loading-bar']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
     .state('home',{
      url:'/home',
      controller:'searchCtrl',
      templateUrl:'templates/search.html'
     })
      .state('userRepos',{
        url:'/user_repos',
        controller:'userRepos',
        templateUrl:'/templates/repos.html',
      })
      .state('userStats',{
        url:'/stats',
        controller:'statsCtrl',
        templateUrl:'/templates/stats.html',
      })
    
      $urlRouterProvider.otherwise('home');
   }


])  