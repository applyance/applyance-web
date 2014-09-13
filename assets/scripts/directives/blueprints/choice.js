'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintChoice', function () {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/blueprints/choice.html',
      scope: {
        aplBlueprint: "="
      },
      link: function (scope, elm, attr) {
        scope.blueprint = scope.aplBlueprint;
      }
    };
  });
