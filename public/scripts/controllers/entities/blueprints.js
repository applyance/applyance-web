'use strict';

angular.module('ApplyanceApp')
  .controller('EntityBlueprintsCtrl', ['$scope', 'ApplyanceAPI', 'Context',
    function ($scope, ApplyanceAPI, Context) {

      $scope.entity = Me.getEntity(Context.getId());

      $scope.definitions = [];
      ApplyanceAPI.getDefinitions().then(function(definitions) {
         $scope.definitions = definitions;
      });

      $scope.blueprints = [];
      ApplyanceAPI.getEntityBlueprints().then(function(blueprints) {
         $scope.blueprints = blueprints;
      });

      $scope.toggle = function(definition) {
        console.dir(arg);
        // ApplyanceAPI.postEntityBlueprint($scope.entity.id, {
        //   definition_id: definition.id,
        //   position: 1,
        //   is_required: true
        // })
      }

    }]);
