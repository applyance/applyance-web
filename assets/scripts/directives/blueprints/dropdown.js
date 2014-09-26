'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintDropdown', function () {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/blueprints/dropdown.html',
      scope: {
        aplBlueprint: "="
      },
      link: function (scope, elm, attr) {
        scope.blueprint = scope.aplBlueprint;
      }
    };
  });
