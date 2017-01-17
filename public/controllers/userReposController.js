app.controller('userRepos', ['$scope','data',function($scope,data){

  $scope.repos = data.repoList;

  $scope.getStats = function(repo){
    data.getStats(repo.name,repo.owner);
  }

}])