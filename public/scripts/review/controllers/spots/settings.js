'use strict';

module.exports = angular.module('Review')
  .controller('SpotSettingsCtrl', ['$scope', '$rootScope', '$routeParams', 'Store', '$location', 'spot',
  function ($scope, $rootScope, $routeParams, Store, $location, spot) {

    $scope.isResponsiveOpen = false;
    $rootScope.withSidebar = true;
    $scope.spot = spot;
    $scope.currentScope = Store.getCurrentScope();

    $rootScope.inSpotSettings = true;
    $scope.spotSettings = $location.path().split('/')[3];

    if (Store.getCurrentScope() != "admin") {
      $location.path('/entities/' + Store.getActiveEntityId() + '/spots');
    }

    $scope.isActive = function(settings) {
      return $scope.spotSettings == settings;
    };

  }]);
