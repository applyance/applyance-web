'use strict';

module.exports = angular.module('Review')
  .controller('SettingsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'Store',
  function ($scope, $rootScope, $routeParams, $location, Store) {

    $rootScope.withSidebar = true;
    $rootScope.inSettings = true;
    $scope.settings = $location.path().split('/')[3];

    if (Store.getCurrentScope() != "admin") {
      $location.path('/entities/' + Store.getActiveEntityId() + '/applications');
    }

    $scope.isActive = function(settings) {
      return $scope.settings == settings;
    };

    $scope.getActiveEntity = function() {
    	return Store.getActiveEntity();
    };

  }]);
