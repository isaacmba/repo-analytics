app.factory('userStats',['$http','$window','$state','login', function($http,$window,$state,login){

  var hello = {
    info : [],
    commits :[],
    contributores:[],
    package : [],


    stats : function(){

      console.log(login.currentRepo);
      //   hello.info = [];
      //   hello.commits =[];
      //   hello.contributores=[];
      //   hello.package =[];
      // for(var i = 0;i<login.currentRepo.length;i++){
      //   if(login.currentRepo[i].info){
      //     hello.info.push(login.currentRepo[i].info);
      //     console.log(hello.info)
      //   }
      //   if(login.currentRepo[i].commits){
      //     hello.commits.push(login.currentRepo[i].commits);
      //     console.log(hello.commits)
      //   }
      //   if(login.currentRepo[i].contributores){
      //     hello.contributores.push(login.currentRepo[i].contributores);
      //     console.log(hello.contributores);
      //   }
      //   if(login.currentRepo[i].package){
      //     hello.package.push(login.currentRepo[i].package);
      //     console.log(hello.package)
      //   }
      // }
    },
    isPackage : function(){
      if(hello.package = []){
        console.log("empty package")
        hello.package = "No Technologies Found";
      }
      else{
        console.log("big package")
        console.log(hello.package);
      }
    },
    //////packag.json///////
    getPackage:function(){
      console.log(loginService.currentRepo[0].package);
      if(loginService.currentRepo[0].package === "NOT FOUND"){

      }
      else{
        var decoded = JSON.parse($window.atob(loginService.currentRepo[0].package.content))
        // console.log((Object.keys(decoded.dependencies)))
        if(decoded.dependencies){
          for(var i =0;i<Object.keys(decoded.dependencies).length;i++){
            hello.package.push(Object.keys(decoded.dependencies)[i]);
          }
            console.log(hello.package)
        } 
        if(decoded.devDependencies){
        for(var i =0;i<Object.keys(decoded.devDependencies).length;i++)
          hello.package.push(Object.keys(decoded.devDependencies)[i]);
        console.log(hello.package);
        }
        
      }
      },
      ///////commits///////
      getCommits:function(){
        console.log(loginService.currentRepo[0].commits)
    }
    }


  return hello;

}])
