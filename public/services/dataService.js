app.factory('data',['$http','$state', function($http,$state){
  var dataService = {};
  dataService.repoList ={};
  dataService.repoData = {};
  dataService.error = {isError:false, error:""};

  dataService.getRepos = function(username){

    dataService.error.isError = false;
    dataService.repoList ={};
    return $http.get('/'+ username +'/list').then(function(data){

        dataService.repoList = data.data;

        console.log(dataService.repoList)

        $state.go('userRepos');
      }, function(err){
        dataService.error.isError = true;
        dataService.error.error = err;
        console.log(dataService.error.error);
        return dataService.error;

      }
    )
  }

  dataService.getStats = function(repo,owner){
    dataService.error.isError = false;
    dataService.repoData = {};
    // console.log(repo + owner)
    $http.get('/repo/'+owner+'/'+repo+'/'+ dataService.repoList._id).then(function(data,err){
      if(err){
        dataService.error.error = err;
      }else{
        // console.log(data.data)
        dataService.repoData = data.data;
        console.log(data.data.commits)
        console.log("switching states")
        $state.go('userStats');

      }
    })
  }


  return dataService;
}])