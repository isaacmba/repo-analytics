app.controller('userData',['$scope','login','$state',function($scope,login,$state){

$scope.repos = login.userData;
$scope.repoInfo = function(index){
  login.repoInfo($scope.repos[index]);
}

}]);