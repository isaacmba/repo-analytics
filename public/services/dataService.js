app.factory('data',['$http','$state', function($http,$state){
  var dataService = {};
  dataService.repoList =[];

  dataService.getRepos = function(username){

    $http.get('/'+ username +'/list').then(function(data,err){
      if(err){
        console.log(err)
      }else{
        // console.log(data.data)
        dataService.repoList = data.data.repoList;
        console.log(dataService.repoList)
        $state.go('userRepos');
      }
    })
  }

  dataService.getStats = function(repo,owner){
    // console.log(repo + owner)
    $http.get('/repo/'+owner+'/'+repo).then(function(data,err){
      if(err){
        console.log(err)
      }else{
        console.log(data)
      }
    })
  }


  return dataService;
}])