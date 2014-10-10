'use strict';

module.exports = angular.module('Apply')
  .controller('QuestionsCtrl', ['$scope', 'ApplyanceAPI',
    function ($scope, ApplyanceAPI) {

      $scope.onBlueprintsGet = function(blueprints) {
        blueprints = _.sortBy(blueprints.plain(), 'position');
        _.each(blueprints, function(blueprint, index) {
          blueprint._index = index;
          blueprint._valid = false;
          $scope.blueprints.push(blueprint);
        });
      };

      //
      // Get the first blueprints for entity and its parent
      //

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
        var blueprintToRemove = _.find($scope.blueprints, function(blueprint) {
          if (!blueprint.entity) {
            return false;
          }
          return blueprint.entity.id == location.id;
        });
        var index = _.indexOf($scope.blueprints, blueprintToRemove);
        if (index > -1) {
          $scope.blueprints.splice(index, 1);
        }
      });

      //
      // Add hooks for new spots
      //

      $scope.$on('spot.added', function(evt, spot) {
        ApplyanceAPI.getSpotBlueprints(spot.id).then($scope.onBlueprintsGet);
      });

      $scope.$on('spot.removed', function(evt, spot) {
        var blueprintToRemove = _.find($scope.blueprints, function(blueprint) {
          if (!blueprint.spot) {
            return false;
          }
          return blueprint.spot.id == spot.id;
        });
        var index = _.indexOf($scope.blueprints, blueprintToRemove);
        if (index > -1) {
          $scope.blueprints.splice(index, 1);
        }
      });

      $scope.isDisabled = function() {
        return $scope.form.sequence < 3;
      };

    }
  ]);
