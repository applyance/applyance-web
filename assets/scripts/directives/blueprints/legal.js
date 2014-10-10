'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintLegal', ['BlueprintFactory', function (BlueprintFactory) {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/blueprints/legal.html',
      scope: {
        aplBlueprint: "="
      },
      link: function (scope, elm, attr) {
        scope.blueprint = scope.aplBlueprint;
        scope.BF = new BlueprintFactory(scope.blueprint, {
          default: null,
          multiple: false
        });

        scope.BF.isValid(function(blueprint) {
          var isValid = false;
          if (blueprint.is_required) {
            isValid = blueprint.datum.detail.value !== null;
          } else {
            isValid = true;
          }
          return isValid;
        });

        scope.BF.isEmpty(function(blueprint) {
          return blueprint.datum.detail.value === null;
        });

        scope.BF.validate();
        scope.$watch('blueprint.datum', _.bind(scope.BF.validate, scope.BF), true);

        scope.isSelected = function(choice) {
          var shouldBe = (choice == "I accept") ? true : false;
          return scope.blueprint.datum.detail.value == shouldBe;
        };

        scope.toggle = function(choice) {
          var shouldBe = (choice == "I accept") ? true : false;
          if (scope.blueprint.datum.detail.value == shouldBe) {
            scope.blueprint.datum.detail.value = null;
            return;
          }
          scope.blueprint.datum.detail.value = shouldBe;
        };
      }
    };
  }]);
