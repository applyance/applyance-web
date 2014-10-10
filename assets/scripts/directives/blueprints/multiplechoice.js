'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintMultiplechoice', ['BlueprintFactory', function (BlueprintFactory) {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/blueprints/multiplechoice.html',
      scope: {
        aplBlueprint: "="
      },
      link: function (scope, elm, attr) {
        scope.blueprint = scope.aplBlueprint;
        scope.BF = new BlueprintFactory(scope.blueprint, {
          default: [],
          multiple: false
        });

        scope.selection_constraint = scope.blueprint.definition.helper.selection_constraint;

        scope.BF.isValid(function(blueprint) {
          return blueprint.is_required ? (blueprint.datum.detail.value.length > 0) : true;
        });

        scope.BF.isEmpty(function(blueprint) {
          return blueprint.datum.detail.value.length == 0;
        });

        scope.BF.validate();
        scope.$watch('blueprint.datum', _.bind(scope.BF.validate, scope.BF), true);

        scope.isSelected = function(choice) {
          return _.contains(scope.blueprint.datum.detail.value, choice);
        };

        scope.toggle = function(choice) {
          if (scope.isSelected(choice)) {
            var index = scope.blueprint.datum.detail.value.indexOf(choice);
            scope.blueprint.datum.detail.value.splice(index, 1);
            return;
          }
          if (scope.selection_constraint == "single") {
            scope.blueprint.datum.detail.value = [choice];
          } else {
            scope.blueprint.datum.detail.value.push(choice);
          }
        };
      }
    };
  }]);
