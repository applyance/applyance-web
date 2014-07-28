'use strict';

angular.module('ApplyanceApp')
  .controller('UnitSettingsCtrl', function ($scope, $routeParams, ApplyanceAPI) {

    $scope.startUpdateUnit = function() {

      var updatedUnit = {
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
            $scope.updateUnit($scope.unit.id, updatedUnit);
          },
          function(r) {
            console.log("failed to upload logo");
            console.log(r);
          }
        );
      } else {
        $scope.updateUnit($scope.unit.id, updatedUnit);
      }

    };

    $scope.updateUnit = function(unitId, updatedUnitObj) {

      ApplyanceAPI.updateUnit(unitId, updatedUnitObj).then(
        function(r) {
          console.log("updated unit");
          console.log(r);
        },
        function(r) {
          console.log("failed to update unit");
          console.log(r);
        }
      );
    };

  });
