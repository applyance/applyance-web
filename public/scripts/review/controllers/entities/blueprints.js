'use strict';

module.exports = angular.module('Review')
  .controller('EntityBlueprintsCtrl', ['$scope', 'ApplyanceAPI', 'Store',
    function ($scope, ApplyanceAPI, Store) {

      $scope.e = Store.getActiveEntity();

      $scope.definitions = [];
      ApplyanceAPI.getDefinitions().then(function(definitions) {
         $scope.definitions = definitions;
      });

      $scope.blueprints = [];
      ApplyanceAPI.getBlueprints(Store.getActiveEntityId()).then(function(blueprints) {
         $scope.blueprints = $scope.blueprints.concat(blueprints);
      });

      if ($scope.e.parent) {
        ApplyanceAPI.getBlueprints($scope.e.parent.id).then(function(blueprints) {
          blueprints = _.map(blueprints, function(blueprint) {
            blueprint.is_parent = true;
            return blueprint
          });
          $scope.blueprints = $scope.blueprints.concat(blueprints);
        });
      }

      $scope.getBlueprintFromDefinition = function(definition) {
        return _.find($scope.blueprints, function(blueprint) {
          return blueprint.definition.id == definition.id;
        });
      };

      $scope.isDefinitionDisabled = function(definition) {
        var blueprint = $scope.getBlueprintFromDefinition(definition);
        return blueprint && blueprint.is_parent;
      }

      $scope.isSet = function(definition) {
        return !!$scope.getBlueprintFromDefinition(definition);
      };

      $scope.toggle = function(definition) {
        if ($scope.isDefinitionDisabled(definition)) {
          return;
        }

        var blueprint = $scope.getBlueprintFromDefinition(definition);
        if (blueprint) {
          ApplyanceAPI.deleteBlueprint(blueprint.id).then(function() {
            $scope.blueprints.splice($scope.blueprints.indexOf(blueprint), 1);
          });
        } else {
          ApplyanceAPI.postBlueprint(Store.getActiveEntityId(), {
            definition_id: definition.id,
            position: 1,
            is_required: true
          }).then(function(blueprint) {
            $scope.blueprints.push(blueprint);
          });
        }
      };

    }]);
