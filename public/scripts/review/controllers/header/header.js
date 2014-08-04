'use strict';

module.exports = angular.module('Review')
  .controller('HeaderCtrl', ['$scope', '$location', 'Store', '$rootScope',
    function ($scope, $location, Store, $rootScope) {

    	$scope.activeEntityId = function() {
        return Store.getActiveEntityId();
      };

      $scope.isActive = function(route) {
        return route === $location.path();
      };

      $scope.isAdmin = function() {
        return Store.getCurrentScope() == "admin";
      };

      // Update the active entity context on route change
      $rootScope.$on("$routeChangeSuccess", function(args) {

        var pathParts = $location.path().split("/");

        if (pathParts[1] == "entities") {
          var entityId = pathParts[2];
          if (entityId) {
            Store.setActiveEntityId(entityId);
          }
        }

        $rootScope.inSettings = false;
      });

  }]);
