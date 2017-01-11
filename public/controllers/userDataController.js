app.controller('userData',['$scope','login','$state',function($scope,login,$state){

$scope.repos = login.userData;


}]);