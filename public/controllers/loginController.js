app.controller('LoginCtrl',['$scope','login','$state',function($scope,login,$state){

$scope.user = login.user;

$scope.click = function(){
<<<<<<< HEAD
    login.click($scope.user)
    console.log(login.userData);
  }
  $scope.isLoggedIn = function(){
    return false;
  };

=======
  console.log("in controller");
    login.click($scope.username)
}
$scope.stats = function(){
>>>>>>> 924c1ff7c9452bb1fe05637ea91232d79cca8379
  
}


}])
