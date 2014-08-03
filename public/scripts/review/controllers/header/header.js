'use strict';

module.exports = angular.module('Review')
  .controller('HeaderCtrl', ['$scope', '$location', 'Store',
    function ($scope, $location, Store) {

    	$scope.activeEntityId = Store.activeEntityId;

      $scope.isActive = function(route) {
        return route === $location.path();
      };

      $scope.isAdmin = function() {
        return Store.getCurrentScope() == "admin";
      };

  }]);
