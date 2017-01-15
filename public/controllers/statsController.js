app.controller('statsCtrl', ['userStats','$scope' ,  function(userStats, $scope){

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

$scope.options3 = {
            chart: {
                type: 'scatterChart',
                height: 450,
                color: d3.scale.category10().range(),
                scatter: {
                    onlyCircles: false
                },
                showDistX: true,
                showDistY: true,
                tooltipContent: function(key) {
                    return '<h3>' + key + '</h3>';
                },
                duration: 350,
                xAxis: {
                    axisLabel: 'Hour',
                    tickFormat: function(d){
                        return d +":00";
                    }
                },
                yAxis: {
                    axisLabel: 'Commits',
                    tickFormat: function(d){
                        return d;
                    },
                    axisLabelDistance: -5
                },
                zoom: {
                    //NOTE: All attributes below are optional
                    enabled: false,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: false,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };


$scope.data3 =  [
            {
                "key" : "Commits" ,
                "values" :  userStats.punches
            }];



}])