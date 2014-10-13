'use strict';

module.exports = angular.module('Applyance')
  .directive('aplFieldEducation', [function() {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/fields/education.html',
      scope: {
        aplField: "="
      },
      link: function (scope, elm, attr) {
        scope.field = scope.aplField;
      }
    };
  }]);
