'use strict';

module.exports = angular.module('Applyance')
  .directive('aplFieldTextentries', [function() {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/fields/textentries.html',
      scope: {
        aplField: "="
      },
      link: function (scope, elm, attr) {
        scope.field = scope.aplField;
      }
    };
  }]);
