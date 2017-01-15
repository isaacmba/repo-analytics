app.controller('NavCtrl', ['$scope', 'login','$state', function($scope, login,$state){
  $scope.isLoggedIn = login.isLoggedIn;
  $scope.currentUser = login.currentUser;
  $scope.logOut = login.logOut;
  $scope.login = function(){
    login.click();
    $state.go('userRepos')
  }

}]);