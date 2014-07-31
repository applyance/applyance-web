'use strict';

angular.module('Apply')
  .controller('FormCtrl', ['$scope', 'ApplyanceAPI',
    function ($scope, ApplyanceAPI) {

      $scope.entity = Applyance.Apply.entity;

      $scope.applicant = {
        name: "Stephen Watkins",
        email: "stjowa@gmail.com"
      };

      $scope.blueprints = [];
      ApplyanceAPI.getBlueprints($scope.entity.id).then(function(blueprints) {
        $scope.blueprints = blueprints.plain();
      });

      $scope.onSubmit = function() {
        // Create fields
        var fields = [];
        _.each($scope.blueprints, function(blueprint) {
          if (!blueprint.detail) {
            return;
          }
          fields.push({
            datum: {
              definition_id: blueprint.definition.id,
              detail: { value: blueprint.detail }
            }
          });
        });

        var entity_ids = [];
        entity_ids.push($scope.entity.id);

        var application = {
          applicant: $scope.applicant,
          entity_ids: entity_ids,
          fields: fields
        };

        ApplyanceAPI.postApplication(application).then(function(application) {
          console.dir(application);
        });

      }

    }]);
