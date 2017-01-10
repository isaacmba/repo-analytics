app.factory('login',['$http', function($http){

  loginService = {
    user:{},
    click:function(user){
      $http.post('/login',user).then(function(data){
      // console.log(data.data);
      angular.copy(data.data , loginService.user);
      // console.log(loginService.user)
    })
    }
  }
  

  return loginService;
}])