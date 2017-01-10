app.controller('LoginCtrl',['$scope','login','$state',function($scope,login,$state){

  $scope.click = function(){
    login.click($scope.user)
  }
  

} ])
