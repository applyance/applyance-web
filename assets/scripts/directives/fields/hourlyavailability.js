'use strict';

module.exports = angular.module('Applyance')
  .directive('aplFieldHourlyavailability', [function() {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/fields/hourlyavailability.html',
      scope: {
        aplField: "="
      },
      link: function (scope, elm, attr) {
        scope.field = scope.aplField;

        scope.days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        scope.periods = ["Morning", "Afternoon", "Evening"];

        scope.isSelected = function(day, period) {
          var answer = scope.field.datum.detail.value;
          return answer[day] && _.contains(answer[day], period);
        };
      }
    };
  }]);
