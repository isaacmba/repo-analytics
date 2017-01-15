app.controller('LoginCtrl',['$scope','login','$state',function($scope,login,$state){

$scope.user = login.user;

$scope.click = function(){

  console.log("in controller");
  console.log($scope.username);
  login.click($scope.username);
}
   



} ])
