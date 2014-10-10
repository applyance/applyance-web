'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintEducation', ['BlueprintFactory', function(BlueprintFactory) {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/blueprints/education.html',
      scope: {
        aplBlueprint: "="
      },
      link: function (scope, elm, attr) {
        scope.blueprint = scope.aplBlueprint;
        scope.BF = new BlueprintFactory(scope.blueprint);

        var entryKeys = ['institution', 'degree', 'start_year', 'end_year'];

        scope.BF.isValidEntry(function(blueprint, entry) {
          var isValid = false;
          if (blueprint.is_required || !scope.BF.cbs.isEmptyEntry(blueprint, entry)) {
            isValid = scope.BF.checkRequired(entry, entryKeys);
          } else {
            isValid = true;
          }
          if (entry.start_year && (entry.start_year.length > 0)) {
            isValid &= entry._$mask_start("isComplete");
          }
          if (entry.end_year && (entry.end_year.length > 0)) {
            isValid &= entry._$mask_end("isComplete");
          }
          entry._valid = isValid;
          return isValid;
        });

        scope.BF.isEmptyEntry(function(blueprint, entry) {
          return scope.BF.isAllKeysEmpty(entry, entryKeys);
        });

        scope.BF.validate();
        scope.$watch('blueprint.datum', _.bind(scope.BF.validate, scope.BF), true);
      }
    };
  }]);
