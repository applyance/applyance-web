'use strict';

angular.module('Review')
  .controller('EntitySettingsCtrl', function ($scope, $routeParams, ApplyanceAPI, Me, Context) {

    $scope.entity = Me.getEntity(Context.getId());

    $scope.startUpdateEntity = function() {

      var updatedEntity = {
        id: $scope.entity.id,
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
            $scope.updateEntity(updatedEntity);
          },
          function(r) {
            console.log("failed to upload logo");
            console.log(r);
          }
        );
      } else {
        $scope.updateEntity(updatedEntity);
      }

    };

    $scope.updateEntity = function(updatedEntityObj) {

      ApplyanceAPI.putEntity(updatedEntityObj).then(
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
