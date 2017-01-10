app.factory('login',['$http', function($http){

  loginService = {
    user:{},

    ///login////
    $http.post('',user).then(function(data){
      console.log(data);
    })

    
  }
  

  return loginService;
}])