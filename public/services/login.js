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
      console.log("get this info");

      $http.get('/fullrepo/'+repo.owner.login+'/'+repo.name).then(function(data){
        loginService.currentRepo=[];
        // console.log(data.data);
        loginService.currentRepo.push(data.data)
        // console.log(loginService.cu/rrentRepo);

        $state.go('userStats');
        console.log("hi")
      }).catch(function(err){
        console.error(err);
        $state.go('login');
      })
    }
  }
  
  return loginService;
}])
//headers:{'User-Agent':'request'}