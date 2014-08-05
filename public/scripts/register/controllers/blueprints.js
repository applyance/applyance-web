'use strict';

module.exports = angular.module('Register')
  .controller('BlueprintsCtrl', ['$scope', '$http', 'ApplyanceAPI', '$timeout',
    function ($scope, $http, ApplyanceAPI, $timeout) {

      $scope.definitions = [];
      ApplyanceAPI.getDefinitions().then(function(definitions) {
        $scope.definitions = definitions;
      });

      $scope.getBlueprintFromDefinition = function(definition) {
        return _.find($scope.blueprints, function(blueprint) {
          return blueprint.definition_id == definition.id;
        });
      };

      $scope.isDefinitionSet = function(definition) {
        return !!$scope.getBlueprintFromDefinition(definition);
      };

      $scope.toggleDefinition = function(definition) {
        var blueprint = $scope.getBlueprintFromDefinition(definition);
        if (blueprint) {
          $scope.blueprints.splice($scope.blueprints.indexOf(blueprint), 1);
        } else {
          $scope.blueprints.push({
            definition_id: definition.id,
            position: 1,
            is_required: true
          });
        }
      };

    }]);
