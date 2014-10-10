'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintHourlyavailability', ['BlueprintFactory', function (BlueprintFactory) {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/blueprints/hourlyavailability.html',
      scope: {
        aplBlueprint: "="
      },
      link: function (scope, elm, attr) {
        scope.blueprint = scope.aplBlueprint;
        scope.BF = new BlueprintFactory(scope.blueprint, {
          multiple: false
        });

        scope.days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        scope.periods = ["Morning", "Afternoon", "Evening"];

        //
        // Validation
        //

        scope.BF.isValid(function(blueprint) {
          var isValid = false;
          if (blueprint.is_required) {
            isValid = _.keys(blueprint.datum.detail.value).length > 0;
          } else {
            isValid = true;
          }
          return isValid;
        });

        scope.BF.isEmpty(function(blueprint) {
          return _.keys(blueprint.datum.detail.value).length == 0;
        });

        scope.BF.validate();
        scope.$watch('blueprint.datum', _.bind(scope.BF.validate, scope.BF), true);

        scope.toggle = function(day, period) {
          var answer = scope.blueprint.datum.detail.value;
          if (answer[day]) {
            if (_.contains(answer[day], period)) {
              answer[day] = _.without(answer[day], period);
              if (answer[day].length == 0) {
                delete answer[day];
              }
            } else {
              answer[day].push(period);
            }
          } else {
            answer[day] = [period];
          }
        };

        scope.isSelected = function(day, period) {
          var answer = scope.blueprint.datum.detail.value;
          return answer[day] && _.contains(answer[day], period);
        };

        scope.range = function(n) {
          return new Array(n);
        };

        scope.getHour = function(i) {
          var _i = i,
              str = "";
          if (i > 12) { i -= 12; }
          str += (i == 0) ? "12" : i;
          str += (i == 0) ? "a" : "";
          str += (i == 12) ? "p" : "";
          return str;
        };

        scope.getAmHour = function(i) {
          var str = "";
          str += (i == 0) ? "12a" : i;
          return str;
        };

        scope.getPmHour = function(i) {
          var str = "";
          str += (i == 0) ? "12p" : i;
          return str;
        };

      }
    };
  }]);
