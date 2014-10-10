'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintDropdown', ['BlueprintFactory', function (BlueprintFactory) {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/blueprints/dropdown.html',
      scope: {
        aplBlueprint: "="
      },
      link: function (scope, elm, attr) {
        scope.blueprint = scope.aplBlueprint;
        scope.BF = new BlueprintFactory(scope.blueprint, {
          default: "",
          multiple: false
        });

        scope.BF.isValid(function(blueprint) {
          return blueprint.is_required ? (blueprint.datum.detail.value.length > 0) : true;
        });

        scope.BF.isEmpty(function(blueprint) {
          return blueprint.datum.detail.value.length == 0;
        });

        scope.BF.validate();
        scope.$watch('blueprint.datum', _.bind(scope.BF.validate, scope.BF), true);
      }
    };
  }]);
