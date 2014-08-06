'use strict';

module.exports = angular.module('Review')
  .controller('SpotsCtrl', ['$scope', 'ApplyanceAPI', 'Store',
    function ($scope, ApplyanceAPI, Store) {

      ApplyanceAPI.getSpots(Store.getActiveEntityId()).then(function(spots) {
         $scope.spots = spots;
      });

      $scope.activeEntity = Store.getActiveEntity();

      $scope.createSpot = function() {
        var newSpot = {
          "name": "New Spot",
          "status": "open"
        };
        ApplyanceAPI.postSpot(Store.getActiveEntityId(), newSpot).then(function(createdSpot) {
          $scope.spots.unshift(createdSpot);
        });
      };

    }]);
