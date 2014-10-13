'use strict';

module.exports = angular.module('Review')
  .controller('EntityBlueprintsCtrl', ['$scope', 'ApplyanceAPI', 'Store',
    function ($scope, ApplyanceAPI, Store) {

      if (!Store.hasActiveFeature('questions')) {
        $location.path($scope.getRootPath());
      }

      $scope.e = Store.getActiveEntity();
      $scope.rootE = $scope.e.parent ? $scope.e.parent : $scope.e;
      $scope.customDefinitionCount = 5;
      $scope.definitionToManage = null;

      // Get the right definitions
      $scope.definitions = [];
      ApplyanceAPI.getDomainDefinitions($scope.e.domain.id).then(function(definitions) {
         $scope.definitions = $scope.definitions.concat(definitions);
      });

      // Get the custom questions
      ApplyanceAPI.getEntityDefinitions($scope.rootE.id).then(function(definitions) {
        $scope.customDefinitionCount = definitions.length;
        _.each(definitions, function(definition) {
          definition.isEntity = true;
        });
        $scope.definitions = definitions.concat($scope.definitions);
      });

      // Get the blueprints
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

      $scope.openCreateDefinition = function() {
        if ($scope.customDefinitionCount == 5) {
          return;
        }
        $scope.definitionToManage = null;
        $scope.toggleCreateQuestionDialog(true);
      };

      $scope.removeCreatedDefinition = function(definition) {
        ApplyanceAPI.deleteDefinition(definition.id).then(function() {
          $scope.definitions.splice($scope.definitions.indexOf(definition), 1);
          $scope.customDefinitionCount--;
        });
      };

      $scope.editCreatedDefinition = function(definition) {
        $scope.definitionToManage = definition;
        $scope.toggleCreateQuestionDialog(true);
      };

      $scope.createNewDefinition = function(definition, cb) {
        var definitionToCreate = {
          label: definition.label,
          type: "longtext",
          name: definition.label
        };
        if (definition.description && (definition.description.length > 0)) {
          definitionToCreate.description = definition.description;
        }
        if (definition.id) {
          ApplyanceAPI.putDefinition(definition)
            .then(
              function(definition) {
                var def = _.findWhere($scope.definitions, { id: definition.id });
                def.label = definition.label;
                $scope.toggleCreateQuestionDialog(false);
                cb();
              }, $scope.onDefinitionSaveError(cb));
        } else {
          ApplyanceAPI.postEntityDefinition($scope.rootE.id, definitionToCreate)
            .then(
              function(definition) {
                definition.isEntity = true;
                $scope.customDefinitionCount++;
                $scope.definitions = $scope.definitions.concat(definition);
                $scope.toggleCreateQuestionDialog(false);
                cb();
              }, $scope.onDefinitionSaveError(cb));
        }
      };

      $scope.onDefinitionSaveError = function(cb) {
        return function(response) {
          var error = response.data.errors[0];
          if (error.detail == "slug is already taken") {
            alert('It appears that this question already exists. Please enter a new question.');
          }
          cb();
        };
      };

      $scope.getBlueprintFromDefinition = function(definition) {
        return _.find($scope.blueprints, function(blueprint) {
          return blueprint.definition.id == definition.id;
        });
      };

      $scope.isDisabled = function(definition) {
        var blueprint = $scope.getBlueprintFromDefinition(definition);
        return blueprint && (blueprint.is_parent || definition.is_core);
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
          ApplyanceAPI.postBlueprint(Store.getActiveEntityId(), {
            definition_id: definition.id,
            position: definition.default_position,
            is_required: definition.default_is_required
          }).then(function(blueprint) {
            $scope.blueprints.push(blueprint);
          });
        }
      };

    }]);
