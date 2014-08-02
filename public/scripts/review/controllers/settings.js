'use strict';

module.exports = angular.module('Review')
  .controller('SettingsCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'entity', 'Me', 'Context',
  function ($scope, $rootScope, $routeParams, $location, entity, Me, Context) {

    $scope.entity = entity;

    $rootScope.inSettings = true;
    $scope.context = Context.getObject();
    $scope.settings = Context.getPart(3);

    $scope.isActive = function(settings) {
      return $scope.settings == settings;
    }

  }]);
