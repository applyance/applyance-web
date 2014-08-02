'use strict';

module.exports = angular.module('Review')
  .controller('HeaderCtrl', ['$scope', '$rootScope', '$location', 'Me', 'Context',
    function ($scope, $rootScope, $location, Me, Context) {

      // Update the context on route change
      $rootScope.$on("$routeChangeSuccess", function(args) {
        Context.reload();
        $scope.context = Context.getObject("entities", Me.getEntities()[0].id)
        $rootScope.inSettings = false;
      });

      $scope.isActive = function(route) {
        return route === $location.path();
      }

  }]);
