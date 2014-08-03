'use strict';

module.exports = angular.module('Review')
  .controller('SettingsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'Store',
  function ($scope, $rootScope, $routeParams, $location, Store) {

    $rootScope.inSettings = true;
    $scope.settings = $location.path().split('/')[3];

    $scope.isActive = function(settings) {
      return $scope.settings == settings;
    };

    $scope.getActiveEntityId = function() {
    	return Store.activeEntityId;
    };

  }]);
