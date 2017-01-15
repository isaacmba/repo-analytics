app.controller('userData',['$scope','login','$state','$stateParams','auth',function($scope,login,$state,$stateParams,auth){

$scope.repos = login.userData;

$scope.repoInfo = function(repo){
  login.repoInfo(repo);
};

$scope.token = $stateParams.token;
$scope.user = auth.currentUser();
$scope.avatar = auth.currentAvatar();
$scope.click = login.click;

}]);