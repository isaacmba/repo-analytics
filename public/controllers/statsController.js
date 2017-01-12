app.controller('statsCtrl', ['userStats','$scope', function(userStats,$scope){

/////info data/////
$scope.info = userStats.info;
/////commits data/////
$scope.commits = userStats.commits;
$scope.commitsByWeek =[];
/////contributores data//////
$scope.contributores = userStats.contributores
/////package data//////
$scope.packages = userStats.package;
$scope.checkPackage = function(){
  userStats.getPackage();
}



}])