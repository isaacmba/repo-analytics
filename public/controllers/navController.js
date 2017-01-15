app.controller('NavCtrl', ['$scope', 'login','$state','auth', function($scope, login,$state,auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
  $scope.login = function(){
    login.click();
    $state.go('userRepos')
  }

}]);