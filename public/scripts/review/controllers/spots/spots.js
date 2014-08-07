'use strict';

module.exports = angular.module('Review')
  .controller('SpotsCtrl', ['$scope', '$location', 'ApplyanceAPI', 'Store',
    function ($scope, $location, ApplyanceAPI, Store) {

      $scope.currentScope = Store.getCurrentScope();

      ApplyanceAPI.getSpots(Store.getActiveEntityId()).then(function(spots) {
         $scope.spots = spots.plain().reverse();
      });

      $scope.activeEntity = Store.getActiveEntity();

      $scope.createSpot = function() {
        var newSpot = {
          "name": "New Spot",
          "status": "open"
        };
        ApplyanceAPI.postSpot(Store.getActiveEntityId(), newSpot).then(function(createdSpot) {
          $location.path('/spots/' + createdSpot.id + '/settings');
        });
      };

      $scope.deleteSpot = function(spot) {
        spot.status = "deleted";
        ApplyanceAPI.putSpot(spot).then(function() {
          $scope.spots.splice($scope.spots.indexOf(spot), 1);
        });
      };

    }
  ]
);
