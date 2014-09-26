'use strict';

module.exports = angular.module('Apply')
  .controller('SpotsCtrl', ['$scope', 'ApplyanceAPI',
    function ($scope, ApplyanceAPI) {

      $scope.onSpotsGet = function(entity) {
        return function(spots) {
          var _spots = spots.plain();
          $scope.spots[entity.id] = {
            entity: entity,
            spots: _.reject(_spots, $scope.excludeSpot),
          };
          $scope.updateSpotCount();
        };
      };

      $scope.spots = {};
      ApplyanceAPI.getSpots($scope.entity.id).then($scope.onSpotsGet($scope.entity));

      $scope.$on('location.added', function(evt, location) {
        ApplyanceAPI.getSpots(location.id).then($scope.onSpotsGet(location));
      });

      $scope.$on('location.removed', function(evt, location) {
        _.each($scope.spots[location.id].spots, $scope.removeSelectedSpot);
        delete $scope.spots[location.id];
        $scope.updateSpotCount();
      });

      $scope.excludeSpot = function(spot) {
        return spot.status == "closed";
      };

      $scope.updateSpotCount = function() {
        var count = 0;
        _.each($scope.spots, function(spotObj) {
          count += spotObj.spots.length;
        });
        $scope.counts.spots = count;
        if ($scope.counts.spots == 0) {
          $scope.nextState();
        }
      };

      $scope.removeSelectedSpot = function(spot) {
        var index = $scope.selectedSpots.indexOf(spot);
        if (index > -1) {
          $scope.selectedSpots.splice(index, 1);
        }
      }

      $scope.toggleSpot = function(spot) {
        spot.is_selected = !!!spot.is_selected;
        if (spot.is_selected) {
          $scope.selectedSpots.push(spot);
        } else {
          $scope.removeSelectedSpot(spot);
        }
        $scope.$emit('emit.spot.' + (spot.is_selected ? 'added' : 'removed'), spot);
      };

      $scope.isDisabled = function() {
        return $scope.form.sequence < 2;
      };

      $scope.continue = function() {
        $scope.nextState();
      };

      $scope.nextState = function() {
        $scope.form.state = "questions.answer";
        $scope.form.sequence = 3;
      };

    }
  ]);
