'use strict';

module.exports = angular.module('Review')
  .controller('SpotSettingsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'Store', 'ApplyanceAPI',
  function ($scope, $rootScope, $routeParams, $location, Store, ApplyanceAPI) {

    $rootScope.inSpotSettings = true;
    $scope.spotSettings = $location.path().split('/')[3];

    ApplyanceAPI.getSpot($routeParams['id']).then(function(spot) {
      $scope.spot = spot.plain();
      $scope.$broadcast('spot-loaded', $scope.spot);
    });

    $scope.isActive = function(settings) {
      return $scope.spotSettings == settings;
    };

  }]);
