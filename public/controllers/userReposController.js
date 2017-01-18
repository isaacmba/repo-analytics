app.controller('userRepos', ['$scope','data',function($scope,data){

  $scope.repos = data.repoList.repoList;
  $scope.description = data.repoList.repoList.description;

  $scope.getStats = function(repo){
    data.getStats(repo.name,repo.owner);
  }

  

}

])