app.factory('login',['$http','$window','$state', function($http,$window,$state){

  loginService = {

    userData:[],
    currentRepo:[],
    click:function(username){
        console.log("in service")

      $http.get('/repos/'+username).then(function(data){
        console.log(data.data)
        if(data.data.length ===0){
          $state.go('login')
        }else{
          loginService.userData = [];
          for(var i = 0;i<data.data.length;i++){
              for(var x = 0; x <data.data[i].length; x++){
                loginService.userData.push(data.data[i][x]);
              }
            }
            // angular.copy(data.data[i],loginService.userData.length);
            console.log(loginService.userData);
          }
       
        $state.go('userRepos')
      })
      

    },
     getRepos :function(){
      for(var i = 0;i<loginService.userData.length;i++){
        // console.log(loginService.userData[i].full_name)
      }
    },
    repoInfo:function(repo){
      // console.log(repo.owner.login);
      console.log("get this info");

      $http.get('/fullrepo/'+repo.owner.login+'/'+repo.name).then(function(data){
        loginService.currentRepo=[];
        // console.log(data.data.package);
        if(data.data.commits !== "NOT FOUND"){
          // console.log(data.data.commits);
          loginService.currentRepo.push({commits:data.data.commits});
       }
        if(data.data.contributores !== "NOT FOUND"){
          loginService.currentRepo.push({contributores:data.data.contributores})
        }
        if(data.data.info !== "NOT FOUND"){
          loginService.currentRepo.push({info:data.data.info})
        }
        if(data.data.package !== "NOT FOUND"){
          loginService.currentRepo.push({package:data.data.package})
        }
        console.log(loginService.currentRepo);
        $state.go('userStats');
      }).catch(function(err){
        console.error(err);
        $state.go('login');
      })
    }
  }
  
  return loginService;
}])
//headers:{'User-Agent':'request'}