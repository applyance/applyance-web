'use strict';

module.exports = angular.module('Applyance')
  .directive('aplFieldReference', [function() {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/fields/reference.html',
      scope: {
        aplField: "="
      },
      link: function (scope, elm, attr) {
        scope.field = scope.aplField;
      }
    };
  }]);
