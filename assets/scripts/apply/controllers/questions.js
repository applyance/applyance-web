'use strict';

module.exports = angular.module('Apply')
  .controller('QuestionsCtrl', ['$scope', 'ApplyanceAPI',
    function ($scope, ApplyanceAPI) {

      $scope.onBlueprintsGet = function(blueprints) {
        $scope.blueprints = $scope.blueprints.concat(blueprints.plain());
        $scope.blueprints.sort(function(b1, b2) {
          return b1.definition.position - b2.definition.position;
        });
        _.each($scope.blueprints, function(blueprint, index) {
          blueprint._index = index;
        });
      };

      //
      // Get the first blueprints for entity and its parent
      //

      $scope.blueprints = [];
      ApplyanceAPI.getBlueprints($scope.entity.id).then($scope.onBlueprintsGet);
      if ($scope.entity.parent) {
        ApplyanceAPI.getBlueprints($scope.entity.parent.id).then($scope.onBlueprintsGet);
      }

      //
      // Add hooks for new locations
      //

      $scope.$on('location.added', function(evt, location) {
        ApplyanceAPI.getBlueprints(location.id).then($scope.onBlueprintsGet);
      });

      $scope.$on('location.removed', function(evt, location) {
        $scope.blueprints = _.reject($scope.blueprints, function(blueprint) {
          if (!blueprint.entity) {
            return false;
          }
          return blueprint.entity.id == location.id;
        });
      });

      //
      // Add hooks for new spots
      //

      $scope.$on('spot.added', function(evt, spot) {
        ApplyanceAPI.getSpotBlueprints(spot.id).then($scope.onBlueprintsGet);
      });

      $scope.$on('spot.removed', function(evt, spot) {
        $scope.blueprints = _.reject($scope.blueprints, function(blueprint) {
          if (!blueprint.spot) {
            return false;
          }
          return blueprint.spot.id == spot.id;
        });
      });

      $scope.isDisabled = function() {
        return $scope.form.sequence < 3;
      };

    }
  ]);
