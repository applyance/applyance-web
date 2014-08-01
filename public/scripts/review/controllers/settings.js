'use strict';

angular.module('Review')
  .controller('SettingsCtrl', ['$scope', '$routeParams', '$location', 'Me', 'Context',
  function ($scope, $routeParams, $location, Me, Context) {

    $scope.context = Context.getObject();
    $scope.entity = Me.getEntity($scope.context.id);
    $scope.settings = Context.getPart(3);

    $scope.isActive = function(settings) {
      return $scope.settings == settings;
    }

  }]);
