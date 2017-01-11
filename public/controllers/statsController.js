app.controller('statsCtrl', ['userStats','$scope', function(userStats,$scope){

/////info data/////
$scope.info = userStats.info;
/////commits data/////
$scope.commits = userStats.commits;
/////contributores data//////
$scope.contributores = userStats.contributores
/////package data//////
$scope.package = userStats.package;


}])