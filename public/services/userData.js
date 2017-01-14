app.factory('userStats',['$http','$window','$state','login', function($http,$window,$state,login){

  var hello = {
    // info : [],
    // commits :[],
    // contributores:[],
    package : [],
    


    stats : function(){

      console.log(login.currentRepo);
      
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
      console.log(loginService.currentRepo.package);
      if(loginService.currentRepo.package === "NOT FOUND"){

      }
      else{
        var decoded = JSON.parse($window.atob(loginService.currentRepo.package.content))
        console.log(decoded)
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
      commits:[],
      
      ///////commits///////
      getCommits:function(){
        console.log(loginService.currentRepo.commits)
        for(var i =0;i<loginService.currentRepo.commits.length;i++){
          var date = new Date(loginService.currentRepo.commits[i].week*1000);
          hello.commits.push({x:date,y:loginService.currentRepo.commits[i].total});
        }
        console.log(hello.commits);
      },
      ///////contributors//////
      contributores:[],
      getContributores:function(){
        // loginService.currentRepo.contributores;
        for(var i =0;i<loginService.currentRepo.contributores.length;i++){
          var contributor = loginService.currentRepo.contributores[i];
          if(contributor !== "NOT FOUND"){
            hello.contributores.push({key:contributor.author.login , y:contributor.total });
          }else{
            console.error(contributor)
          }
        }
        console.log(hello.contributores);

      },
      //////punch card/////
    // punches:[
    //   {x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0},{x:6,y:0},{x:7,y:0},{x:8,y:0},{x:9,y:0},{x:10,y:0},{x:11,y:0},{x:12,y:0},{x:13,y:0},{x:14,y:0},{x:15,y:0},{x:16,y:0},{x:17,y:0},{x:18,y:0},{x:19,y:0},{x:20,y:0},{x:21,y:0},{x:22,y:0},{x:23,y:0}
    // ],
    //   getPunches:function(){
    //     // loginService.currentRepo.punch_card;
    //     for(var i = 0;i<loginService.currentRepo.punch_card.length;i++){
    //       var punch = loginService.currentRepo.punch_card[i];
    //       for(var j = 0; j<hello.punches.length;j++){
    //         if(hello.punches[j].x == punch[1]){
    //           hello.punches[j].y += punch[2];
    //         }
    //       }
    //       // 
    //       // hello.punches.push(punch[2])

    //     }
    //   }
    }


  return hello;

}])
