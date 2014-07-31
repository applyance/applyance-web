'use strict';

angular.module('Review')
  .controller('SettingsCtrl', ['$scope', '$routeParams', '$location', 'Me', 'Context',
  function ($scope, $routeParams, $location, Me, Context) {

    $scope.context = Context.getObject();
    $scope.settings = Context.getPart(3);

  }]);
