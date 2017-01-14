app.controller('statsCtrl', ['userStats','$scope', function(userStats,$scope){

$scope.packages = userStats.package;
$scope.checkPackage = function(){
  userStats.getPackage();
}
$scope.commits= userStats.commits;
$scope.contributores = userStats.contributores;

 $scope.options = {
            chart: {
                type: 'sparklinePlus',
                height: 450,
                x: function(d, i){return i;},
                xTickFormat: function(d) {
                    return d3.time.format('%x')(new Date($scope.data[d].x))
                },
                duration: 250
            }
      };

$scope.data = userStats.commits;

 $scope.options1 = {
            chart: {
                type: 'pieChart',
                height: 800,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

$scope.data1 = userStats.contributores;


}])