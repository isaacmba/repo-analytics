app.controller('navCtrl', ['$scope', 'auth', '$state', function($scope, auth, $state){
  $scope.isLoggedIn = function(){
    return true;
  };
  $scope.currentUser = function() {
    return'Aviv';
  };
}]);
