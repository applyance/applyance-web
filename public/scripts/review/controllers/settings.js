'use strict';

angular.module('Review')
  .controller('SettingsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'Me', 'Context',
  function ($scope, $rootScope, $routeParams, $location, Me, Context) {

    $rootScope.inSettings = true;
    $scope.context = Context.getObject();
    $scope.entity = Me.getEntity($scope.context.id);
    $scope.settings = Context.getPart(3);

    $scope.isActive = function(settings) {
      return $scope.settings == settings;
    }

  }]);
