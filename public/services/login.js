app.factory('login',['$http', function($http){

  loginService = {
    user:{},
    userData:[],
    click:function(user){
      console.log(user);
      $http.get('https://api.github.com/users/'+user.username+'/repos').then(function(data){
        angular.copy(data.data,loginService.userData);
      })
      
    }
  }
  
  return loginService;
}])
//headers:{'User-Agent':'request'}