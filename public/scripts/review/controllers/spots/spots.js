'use strict';

module.exports = angular.module('Review')
  .controller('SpotsCtrl', ['$scope', '$location', 'ApplyanceAPI', 'Store',
    function ($scope, $location, ApplyanceAPI, Store) {

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

    }
  ]
);
