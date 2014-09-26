'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintLongtext', function () {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/blueprints/longtext.html',
      scope: {
        aplBlueprint: "="
      },
      link: function (scope, elm, attr) {
        scope.blueprint = scope.aplBlueprint;
      }
    };
  });
