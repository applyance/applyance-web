'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintName', ['BlueprintFactory', function (BlueprintFactory) {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/blueprints/name.html',
      scope: {
        aplBlueprint: "="
      },
      link: function (scope, elm, attr) {
        scope.blueprint = scope.aplBlueprint;
        scope.BF = new BlueprintFactory(scope.blueprint);

        var entryKeys = ['first', 'last'];

        scope.BF.isEmptyEntry(function(blueprint, entry) {
          return scope.BF.isAllKeysEmpty(entry, entryKeys);
        });

        scope.BF.isValidEntry(function(blueprint, entry) {
          var isValid = false;
          if (blueprint.is_required || !scope.BF.cbs.isEmptyEntry(blueprint, entry)) {
            isValid = scope.BF.checkRequired(entry, entryKeys);
          } else {
            isValid = true;
          }
          entry._valid = isValid;
          return isValid;
        });

        scope.BF.validate();
        scope.$watch('blueprint.datum', _.bind(scope.BF.validate, scope.BF), true);

      }
    };
  }]);
