'use strict';

angular.module('ApplyanceApp')
  .controller('UnitSettingsCtrl', function ($scope, $routeParams, ApplyanceAPI, Me, Context) {

    $scope.unit = Me.getUnit(Context.getId());

    $scope.startUpdateUnit = function() {

      var updatedUnit = {
        id: $scope.unit.id,
        name: $scope.unit.name
      };

      if ($scope.unit.fileObj) {
        ApplyanceAPI.uploadAttachment($scope.unit.fileObj,
          $scope.unit.fileObj.type).then(
          function(r) {
            updatedUnit['logo'] = {
              name: $scope.unit.fileObj.name,
              token: r.data.token
            };
            ApplyanceAPI.putUnit(updatedUnit);
          },
          function(r) {
            console.log("failed to upload logo");
            console.log(r);
          }
        );
      } else {
        ApplyanceAPI.putUnit(updatedUnit);
      }

    };

  });
