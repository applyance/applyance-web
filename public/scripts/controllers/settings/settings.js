'use strict';

angular.module('ApplyanceApp')
  .controller('SettingsCtrl', function ($scope, $routeParams, $location) {

    var splitPath = $location.path().split('/');

    // Get context: Entity or Unit?
    $scope.currentContext = splitPath[1];

    // Get settings subsection
    $scope.settingsView = splitPath[3];

  });
