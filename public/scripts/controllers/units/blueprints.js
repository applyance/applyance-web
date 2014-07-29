'use strict';

angular.module('ApplyanceApp')
  .controller('UnitBlueprintsCtrl', ['$scope', 'ApplyanceAPI', 'Me', 'Context',
    function ($scope, ApplyanceAPI, Me, Context) {

      $scope.unit = Me.getUnit(Context.getId());

      $scope.definitions = [];
      ApplyanceAPI.getDefinitions().then(function(definitions) {
         $scope.definitions = definitions;
      });

      $scope.blueprints = [];
      ApplyanceAPI.getUnitBlueprints($scope.unit.id).then(function(blueprints) {
         $scope.blueprints = blueprints;
      });

      $scope.getBlueprintFromDefinition = function(definition) {
        return _.find($scope.blueprints, function(blueprint) {
          return blueprint.definition.id == definition.id;
        });
      }

      $scope.isSet = function(definition) {
        return !!$scope.getBlueprintFromDefinition(definition);
      }

      $scope.toggle = function(definition) {
        var blueprint = $scope.getBlueprintFromDefinition(definition);
        if (blueprint) {
          ApplyanceAPI.deleteBlueprint(blueprint.id).then(function() {
            $scope.blueprints.splice($scope.blueprints.indexOf(blueprint), 1);
          });
        } else {
          ApplyanceAPI.postUnitBlueprint($scope.unit.id, {
            definition_id: definition.id,
            position: 1,
            is_required: true
          }).then(function(blueprint) {
            $scope.blueprints.push(blueprint);
          });
        }
      }

    }]);
