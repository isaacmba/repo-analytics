var app  = angular.module('repoApp',['ui.router']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login',{
        url:'/',
        controller:'LoginCtrl',
        templateUrl:'/templates/login.html'
      })
      .state('userData',{
        url:'/user',
        controller:'UserDataCtrl',
        templateUrl:'/templates/userData.html'
      });
   }


])