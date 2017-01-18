app.controller('statsCtrl',['data','$scope',function(data,$scope){
  $scope.commits = data.repoData.commits;
  console.log(data.repoData);
  $scope.info = data.repoData.info;
  $scope.punch_card = data.repoData.punch_card;
  $scope.technologies= data.repoData.content;
  $scope.repo = data.repoData;
  $scope.last_commit = data.repoData.info.last_commit;
//////graphs///////
  $scope.sparkline = {
            chart: {
                type: 'sparklinePlus',
                height: 250,
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
                height: 600,
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
}])