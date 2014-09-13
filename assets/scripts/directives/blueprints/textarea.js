'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintTextarea', function () {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/blueprints/textarea.html',
      scope: {
        aplBlueprint: "="
      },
      link: function (scope, elm, attr) {
        scope.blueprint = scope.aplBlueprint;
      }
    };
  });
