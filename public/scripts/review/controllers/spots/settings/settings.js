'use strict';

module.exports = angular.module('Review')
  .controller('SpotSettingsSettingsCtrl', ['$scope', 'flash', 'ApplyanceAPI',
    function ($scope, flash, ApplyanceAPI) {

      $scope.flash = flash;

      $scope.isUpdating = false;
      $scope.updateSpot = function() {
        $scope.isUpdating = true;
      	ApplyanceAPI.putSpot($scope.spot).then(function(r) {
          $scope.isUpdating = false;
          $scope.flash.setMessage("Settings updated successfully.");
          $scope.$emit('flash');
      	});
      };

      $scope.updateStatus = function(status) {
        $scope.spot.status = status;
      };

      $scope.isStatus = function(status) {
        return $scope.spot.status == status;
      };

    }]);
