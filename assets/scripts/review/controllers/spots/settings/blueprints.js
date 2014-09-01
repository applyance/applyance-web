'use strict';

module.exports = angular.module('Review')
  .controller('SpotSettingsBlueprintsCtrl', ['$scope', 'ApplyanceAPI',
    function ($scope, ApplyanceAPI) {

      $scope.definitions = [];
      ApplyanceAPI.getDefinitions().then(function(definitions) {
         $scope.definitions = definitions.plain();
      });

      $scope.blueprints = [];
      ApplyanceAPI.getSpotBlueprints($scope.spot.id).then(function(blueprints) {
        $scope.blueprints = $scope.blueprints.concat(blueprints);
      });

      ApplyanceAPI.getBlueprints($scope.spot.entity.id).then(function(blueprints) {
        blueprints = _.map(blueprints, $scope.mapParentBlueprint);
        $scope.blueprints = $scope.blueprints.concat(blueprints);
      });

      if ($scope.spot.entity.parent) {
        ApplyanceAPI.getBlueprints($scope.spot.entity.parent.id).then(function(blueprints) {
          blueprints = _.map(blueprints, $scope.mapParentBlueprint);
          $scope.blueprints = $scope.blueprints.concat(blueprints);
        });
      }

      $scope.mapParentBlueprint = function(blueprint) {
        blueprint.is_parent = true;
        return blueprint;
      };

      $scope.getBlueprintFromDefinition = function(definition) {
        return _.find($scope.blueprints, function(blueprint) {
          return blueprint.definition.id == definition.id;
        });
      };

      $scope.isDisabled = function(definition) {
        var blueprint = $scope.getBlueprintFromDefinition(definition);
        return blueprint && blueprint.is_parent;
      }

      $scope.isSet = function(definition) {
        return !!$scope.getBlueprintFromDefinition(definition);
      };

      $scope.toggle = function(definition) {
        if ($scope.isDisabled(definition)) {
          return;
        }

        var blueprint = $scope.getBlueprintFromDefinition(definition);
        if (blueprint) {
          ApplyanceAPI.deleteBlueprint(blueprint.id).then(function() {
            $scope.blueprints.splice($scope.blueprints.indexOf(blueprint), 1);
          });
        } else {
          ApplyanceAPI.postSpotBlueprint($scope.spot.id, {
            definition_id: definition.id,
            position: 1,
            is_required: true
          }).then(function(blueprint) {
            $scope.blueprints.push(blueprint);
          });
        }
      };

    }
  ]
);
