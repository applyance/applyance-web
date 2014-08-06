'use strict';

module.exports = angular.module('Review')
  .controller('SpotCtrl', ['$scope', '$routeParams', 'ApplyanceAPI', 'Store', '$filter', '$sce',
    function ($scope, $routeParams, ApplyanceAPI, Store, $filter, $sce) {

      ApplyanceAPI.getSpot($routeParams['id']).then(function(spot) {
        $scope.spot = spot.plain();
      });

      $scope.updateSpot = function() {
      	ApplyanceAPI.putSpot($scope.spot).then(function(r){
      		console.log(r);
      	});
      };

    }]);
