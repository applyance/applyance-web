'use strict';

module.exports = angular.module('Applyance')
  .directive('aplFieldChoices', [function() {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/fields/choices.html',
      scope: {
        aplField: "="
      },
      link: function (scope, elm, attr) {
        scope.field = scope.aplField;
        var V = scope.field.datum.detail.value;
        if (scope.field.datum.definition.type == "legal") {
          V = (V == true) ? "I accept" : "I don't accept";
        } else if (scope.field.datum.definition.type == "yesno") {
          V = (V == true) ? "Yes" : "No";
        }
        scope.entries = _.isArray(V) ? V : [V];
      }
    };
  }]);
