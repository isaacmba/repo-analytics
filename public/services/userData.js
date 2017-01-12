app.factory('userStats',['$http','$window','$state','login', function($http,$window,$state,login){

  var hello = {
    info : [],
    commits :[],
    contributores:[],
    package : [],


    stats : function(){
      for(var i = 0;i<login.currentRepo.length;i++){
        info = [];
        if(login.currentRepo[i].info){
          hello.info.push(login.currentRepo[i].info);
          console.log(hello.info)
        }
         else if(login.currentRepo[i].commits){
          hello.commits.push(login.currentRepo[i].commits);
          console.log(hello.commits)
        }
         else if(login.currentRepo[i].contributores){
          hello.contributores.push(login.currentRepo[i].contributores);
          console.log(hello.contributores);
        }
         else if(login.currentRepo[i].package){
          hello.package.push(login.currentRepo[i].package);
          console.log(hello.package)
        }
      }
    },

}
  return hello;

}])
