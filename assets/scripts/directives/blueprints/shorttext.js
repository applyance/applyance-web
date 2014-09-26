'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintShorttext', function () {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/blueprints/shorttext.html',
      scope: {
        aplBlueprint: "="
      },
      link: function (scope, elm, attr) {
        scope.blueprint = scope.aplBlueprint;
      }
    };
  });
