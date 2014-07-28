'use strict';

angular.module('ApplyanceApp')
  .controller('SettingsCtrl', ['$scope', '$routeParams', '$location', 'Me', 'Context',
  function ($scope, $routeParams, $location, Me, Context) {

    $scope.context = Context.getObject();
    $scope.settings = Context.getPart(3);

  }]);
