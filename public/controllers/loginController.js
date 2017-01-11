app.controller('LoginCtrl',['$scope','login','$state',function($scope,login,$state){

$scope.user = login.user;

$scope.click = function(){
    login.click($scope.user)
    console.log(login.userData);
  }
  $scope.isLoggedIn = function(){
    return false;
  };

  

}])
