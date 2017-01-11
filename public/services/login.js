app.factory('login',['$http','$window','$state', function($http,$window,$state){

  loginService = {
    user:{},
    userData:[],
    click:function(username){
        console.log("in service")

      $http.get('https://api.github.com/users/'+username+'/repos').then(function(data){
        // console.log(data.data)
        angular.copy(data.data,loginService.userData);
        // console.log(loginService.userData);
        $state.go('userRepos')
      })

    },
     getRepos :function(){
      for(var i = 0;i<loginService.userData.length;i++){
        console.log(loginService.userData[i].name)
      }
    } 
  }
  
  return loginService;
}])
//headers:{'User-Agent':'request'}