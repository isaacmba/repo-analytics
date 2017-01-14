app.factory('login',['$http','$window','$state', function($http,$window,$state){

  loginService = {
    userData:[],
    currentRepo:{
      contributores: [],
      commits: [],
      package: {},
      punch_card: []
    },
    clear: function(){
      loginService.userData = [];
      loginService.currentRepo.contributores = [];
      loginService.currentRepo.commits = {};
      loginService.currentRepo.punch_card = [];
    },
    getReposList(username, pageNum){
      console.log('get page: ' + pageNum);
      $http.get('/repo/'+ username + '/list/' + pageNum).then(function(data){
        console.log(data.data)
        if(data.data.length === 0 || data.data === "NOT FOUND"){
          return;
        }else{
          for(var i = 0;i<data.data.length;i++){
            loginService.userData.push(data.data[i]);
          }
          if(pageNum === 1){
            $state.go('userRepos');
          }
        }
        loginService.getReposList(username, ++pageNum);
      })
    },

    click:function(username){

      loginService.clear();
      var pageNum = 1;
      console.log("Start getting repos list")
      loginService.getReposList(username, pageNum);

      

      // $http.get('/repos/'+username).then(function(data){
      //   console.log(data.data)
      //   if(data.data.length ===0){
      //     $state.go('login')
      //   }else{
      //     loginService.userData = [];
      //     for(var i = 0;i<data.data.length;i++){
      //         for(var x = 0; x <data.data[i].length; x++){
      //           loginService.userData.push(data.data[i][x]);
      //         }
      //       }
      //       // angular.copy(data.data[i],loginService.userData.length);
      //       console.log(loginService.userData);
      //     }
       
      //   $state.go('userRepos')
      // })
      

    },
     getRepos :function(){
      for(var i = 0;i<loginService.userData.length;i++){
        // console.log(loginService.userData[i].full_name)
      }
    },
    repoInfo:function(repo){

      loginService.clear();

      $http.get('/repo/'+repo.owner.login+'/'+repo.name + '/commits').then(function(data){

        loginService.currentRepo.commits = data.data;
        // angular.copy(data.data, loginService.currentRepo.contributores);
        console.log(loginService.currentRepo.commits);
        $state.go('userStats');

      }).catch(function(err){
        console.error(err);
        $state.go('login');
      })

      $http.get('/repo/'+repo.owner.login+'/'+repo.name + '/contributors').then(function(data){

        loginService.currentRepo.contributores = data.data;
        // angular.copy(data.data, loginService.currentRepo.contributores);
        console.log(loginService.currentRepo.contributores);
     
      }).catch(function(err){
        console.error(err);
        $state.go('login');
      })
      
      $http.get('/repo/'+repo.owner.login+'/'+repo.name + '/content').then(function(data){

        loginService.currentRepo.package = data.data;
        // angular.copy(data.data, loginService.currentRepo.contributores);
        console.log(loginService.currentRepo.package);

      }).catch(function(err){
        console.error(err);
        $state.go('login');
      })
      $http.get('/repo/'+repo.owner.login+'/'+repo.name + '/punch_card').then(function(data){

        loginService.currentRepo.punch_card = data.data;
        // angular.copy(data.data, loginService.currentRepo.contributores);
        console.log(loginService.currentRepo.punch_card);

      }).catch(function(err){
        console.error(err);
        $state.go('login');
      })

      // $http.get('/fullrepo/'+repo.owner.login+'/'+repo.name).then(function(data){
      //   loginService.currentRepo={};
      //   // console.log(data.data);
      //   loginService.currentRepo = data.data;
      //   console.log(loginService.currentRepo);

      //   $state.go('userStats');
      //   console.log("hi")
      // }).catch(function(err){
      //   console.error(err);
      //   $state.go('login');
      // })

      // loginService.currentRepo={};
    }



  }
  
  return loginService;
}])
//headers:{'User-Agent':'request'}