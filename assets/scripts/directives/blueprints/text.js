'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintText', function () {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/blueprints/text.html',
      scope: {
        aplBlueprint: "="
      },
      link: function (scope, elm, attr) {
        scope.blueprint = scope.aplBlueprint;
      }
    };
  });
