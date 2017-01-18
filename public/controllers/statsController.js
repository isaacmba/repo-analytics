app.controller('statsCtrl',['data','$scope',function(data,$scope){
  $scope.commits = data.repoData.commits;
  console.log(data.repoData.info.watchers_count);
  $scope.info = data.repoData.info;
  $scope.punch_card = data.repoData.punch_card;
  $scope.technologies= data.repoData.content;
  $scope.repo = data.repoData;
  $scope.last_commit = data.repoData.info.last_commit;
//////graphs///////
  $scope.sparkline = {
            chart: {
                type: 'sparklinePlus',
                height: 300,
                x: function(d, i){return i;},
                xTickFormat: function(d) {
                    return d3.time.format('%x')(new Date($scope.commitData[d].x))
                },
                duration: 250
            }
      };


$scope.commitData = data.repoData.commits;



$scope.pie = {
            chart: {
                type: 'pieChart',
                height: 550,
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

$scope.contributors = data.repoData.contributors;

$scope.popular = {
            chart: {
                type: 'pieChart',
                height: 450,
                donut: true,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,

                pie: {
                    startAngle: function(d) { return d.startAngle/2 -Math.PI/2 },
                    endAngle: function(d) { return d.endAngle/2 -Math.PI/2 }
                },
                duration: 500,
                legend: {
                    margin: {
                        top: 5,
                        right: 70,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

$scope.popular = {
            chart: {
                type: 'pieChart',
                height: 450,
                donut: true,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,

                pie: {
                    startAngle: function(d) { return d.startAngle/2 -Math.PI/2 },
                    endAngle: function(d) { return d.endAngle/2 -Math.PI/2 }
                },
                duration: 500,
                legend: {
                    margin: {
                        top: 5,
                        right: 70,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };
$scope.popularityData = [
              {
                key: "Forks",
                y: data.repoData.info.forks
              },
              {
                key: "Stargazers",
                y: data.repoData.info.stargazers
              },
          ]
}])