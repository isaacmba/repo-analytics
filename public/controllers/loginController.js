app.controller('LoginCtrl', ['$scope', 'login', function($scope, login){
  $scope.findAcount = function(){
    console.log($scope.username + ' ' + $scope.password);
  }
}])