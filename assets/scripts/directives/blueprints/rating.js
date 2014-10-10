'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintRating', ['BlueprintFactory', function (BlueprintFactory) {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/blueprints/rating.html',
      scope: {
        aplBlueprint: "="
      },
      link: function (scope, elm, attr) {
        scope.blueprint = scope.aplBlueprint;
        scope.BF = new BlueprintFactory(scope.blueprint, {
          default: null,
          multiple: false
        });

        scope.rating_type = scope.blueprint.definition.helper.rating_type;
        elm.addClass('is-type-' + scope.rating_type);
        scope.steps = Math.max(Math.min(scope.blueprint.definition.helper.steps, 10), 1);

        scope.stepArr = _.range(1, scope.steps + 1);
        scope.stepArr = _.map(scope.stepArr, function(step) {
          return {
            num: step,
            _hovering: false
          };
        });

        scope.BF.isValid(function(blueprint) {
          return blueprint.is_required ? (blueprint.datum.detail.value !== null) : true;
        });

        scope.BF.isEmpty(function(blueprint) {
          return blueprint.datum.detail.value === null;
        });

        scope.BF.validate();
        scope.$watch('blueprint.datum', _.bind(scope.BF.validate, scope.BF), true);

        scope.isSelected = function(step) {
          return scope.blueprint.datum.detail.value == step.num;
        };

        scope.isSet = function(step) {
          return step.num <= scope.blueprint.datum.detail.value;
        };

        scope.isHovering = function(step) {
          return step <= scope.blueprint.datum.detail.value;
        };

        scope.setHovering = function(step) {
          _.each(scope.stepArr, function(innerStep) {
            innerStep._hovering = (innerStep.num <= step.num);
          });
        };

        scope.unsetHovering = function() {
          _.each(scope.stepArr, function(innerStep) {
            innerStep._hovering = false;
          });
        };

        scope.toggle = function(step) {
          if (scope.blueprint.datum.detail.value == step.num) {
            scope.blueprint.datum.detail.value = null;
            return;
          }
          scope.blueprint.datum.detail.value = step.num;
        };

      }
    };
  }]);
