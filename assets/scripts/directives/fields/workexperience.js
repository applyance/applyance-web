'use strict';

module.exports = angular.module('Applyance')
  .directive('aplFieldWorkexperience', [function() {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/fields/workexperience.html',
      scope: {
        aplField: "="
      },
      link: function (scope, elm, attr) {
        scope.field = scope.aplField;
      }
    };
  }]);
