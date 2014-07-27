'use strict';

angular.module('ApplyanceApp')
  .controller('EntitySettingsCtrl', function ($scope, $routeParams, ApplyanceAPI) {

    // ApplyanceAPI.getApplication($routeParams['applicationId']).then(function(application) {
    //    $scope.application = application;
    // });
    //
    // $scope.entity = $scope.me.admins[0].entity;

    $scope.startUpdateEntity = function() {

      ApplyanceAPI.uploadAttachment($scope.entity.fileBinary,
        $scope.entity.fileObj.type).then(
        function(r) {

          var updatedEntity = {
            name: $scope.entity.name,
            "logo": {
              "name": $scope.entity.fileObj.name,
              "token": r.data.token // Attachment token
            }
          };
          $scope.updateEntity($scope.entity.id, updatedEntity);
        },
        function(r) {
          console.log("failed to upload logo");
          console.log(r);
        }
      );
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
