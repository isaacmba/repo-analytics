app.controller('searchCtrl', ['$scope','data',function($scope,data){

  $scope.getRepos = function(){
    data.getRepos($scope.username)
  }

}])