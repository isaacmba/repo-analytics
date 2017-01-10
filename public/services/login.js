app.factory('login',['$http', function($http){

  loginService = {
    user:{},
    click:function(user){
    //   $http.post('/login',user).then(function(data){
    //   // console.log(data.data);
    //   angular.copy(data.data , loginService.user);
    //   // console.log(loginService.user)
    // })
    //   console.log(user);
    // $http.get('/auth/github').then(function(data){
    //   console.log(data);
    // })
    }
  }
  

  return loginService;
}])