app.factory('login',['$http','$window','$state', function($http,$window,$state){

  loginService = {
    user:{},
    userData:[],
    click:function(username){
        console.log("in service")

      $http.get('/repos/'+username).then(function(data){
        // console.log(data.data)
        angular.copy(data.data,loginService.userData);
        // console.log(loginService.userData);
        $state.go('userRepos')
      })

    },
     getRepos :function(){
      for(var i = 0;i<loginService.userData.length;i++){
        console.log(loginService.userData[i].full_name)
      }
    },
    repoInfo:function(repo){
      // console.log(repo.owner.login);
      console.log("get this info");

      $http.get('/fullrepo/'+repo.owner.login+'/'+repo.name).then(function(data){
        console.log(data);
      })
    }
  }
  
  return loginService;
}])
//headers:{'User-Agent':'request'}