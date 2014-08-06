'use strict';

module.exports = angular.module('Review')
  .controller('SpotSettingsSettingsCtrl', ['$scope', 'ApplyanceAPI',
    function ($scope, ApplyanceAPI) {

      $scope.updateSpot = function() {
      	ApplyanceAPI.putSpot($scope.spot).then(function(r) {
      		console.log(r);
      	});
      };

    }]);
