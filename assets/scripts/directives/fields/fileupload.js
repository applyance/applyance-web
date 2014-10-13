'use strict';

module.exports = angular.module('Applyance')
  .directive('aplFieldFileupload', [function() {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/fields/fileupload.html',
      scope: {
        aplField: "="
      },
      link: function (scope, elm, attr) {
        scope.field = scope.aplField;
      }
    };
  }]);
