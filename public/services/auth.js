app.factory('auth',['userStats','$state','$window','$stateParams',function(userStats,$state,$window){
  var auth = {};

  auth.saveToken = function (token) {
    $window.localStorage['repo'] = token;
   };

  auth.getToken = function (){
   return $window.localStorage['repo'];
   }
  auth.isLoggedIn = function(){
     var token = auth.getToken();

     if(token){
       return true;
     } else {
       return false;
     }
   };
  auth.currentUser = function(){
     if(auth.isLoggedIn()){
       var token = auth.getToken();
       var decodedToken = JSON.parse($window.atob(token.split('.')[1]));

       return decodedToken.username;
     }
   };
   auth.currentAvatar = function(){
     if(auth.isLoggedIn()){
       var token = auth.getToken();
       var decodedToken = JSON.parse($window.atob(token.split('.')[1]));

       return decodedToken.avatar
     }
   };
  auth.logOut = function(){
     $window.localStorage.removeItem('repo');
     $state.go('home');

   };
   return auth;
}])