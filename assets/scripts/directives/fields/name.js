'use strict';

module.exports = angular.module('Applyance')
  .directive('aplFieldName', [function() {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/fields/name.html',
      scope: {
        aplField: "="
      },
      link: function (scope, elm, attr) {
        scope.field = scope.aplField;
      }
    };
  }]);
