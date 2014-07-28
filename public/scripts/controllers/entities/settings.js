'use strict';

angular.module('ApplyanceApp')
  .controller('EntitySettingsCtrl', function ($scope, $routeParams, ApplyanceAPI, Me, Context) {

    $scope.entity = Me.getEntity(Context.getId());

    $scope.startUpdateEntity = function() {

      var updatedEntity = {
        name: $scope.entity.name
      };

      if ($scope.entity.fileObj) {
        ApplyanceAPI.uploadAttachment($scope.entity.fileObj,
          $scope.entity.fileObj.type).then(
          function(r) {
            updatedEntity['logo'] = {
              name: $scope.entity.fileObj.name,
              token: r.data.token
            };
            $scope.updateEntity($scope.entity.id, updatedEntity);
          },
          function(r) {
            console.log("failed to upload logo");
            console.log(r);
          }
        );
      } else {
        $scope.updateEntity($scope.entity.id, updatedEntity);
      }

    };

    $scope.updateEntity = function(entityId, updatedEntityObj) {

      ApplyanceAPI.updateEntity(entityId, updatedEntityObj).then(
        function(r) {
          console.log("updated entity");
          console.log(r);
        },
        function(r) {
          console.log("failed to update entity");
          console.log(r);
        }
      );
    };

  });
