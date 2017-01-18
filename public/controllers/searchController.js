app.controller('searchCtrl', ['$scope','data',function($scope,data){

  $scope.getRepos = function(){
    data.getRepos($scope.username).then(function(err){
      console.log($scope.error);
      if (err){
        $scope.error = err;
      }
    })
  }

  // $scope.error = data.error;
  $scope.error = data.error;  

}])