'use strict';

module.exports = angular.module('Applyance')
  .directive('aplFieldRating', [function() {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/fields/rating.html',
      scope: {
        aplField: "="
      },
      link: function (scope, elm, attr) {
        scope.field = scope.aplField;

        scope.steps = Math.max(Math.min(scope.field.datum.definition.helper.steps, 10), 1);

        scope.stepArr = _.range(1, scope.steps + 1);
        scope.stepArr = _.map(scope.stepArr, function(step) {
          return {
            num: step,
            _hovering: false
          };
        });

        scope.isSelected = function(step) {
          return scope.field.datum.detail.value == step.num;
        };

        scope.isSet = function(step) {
          return step.num <= scope.field.datum.detail.value;
        };
      }
    };
  }]);
