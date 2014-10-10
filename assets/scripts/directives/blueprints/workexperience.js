'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintWorkexperience', ['BlueprintFactory', function(BlueprintFactory) {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/blueprints/workexperience.html',
      scope: {
        aplBlueprint: "="
      },
      link: function (scope, elm, attr) {
        scope.blueprint = scope.aplBlueprint;
        scope.BF = new BlueprintFactory(scope.blueprint);

        var entryKeys = ['company_name', 'location', 'phone_number'];

        scope.BF.isValidEntry(function(blueprint, entry) {
          var isValid = false;
          if (blueprint.is_required || !scope.BF.cbs.isEmptyEntry(blueprint, entry)) {
            var isValid = scope.BF.checkRequired(entry, ['company_name', 'location', 'position_title', 'start', 'end']);
            if (entry.contact_supervisor) {
              isValid &= scope.BF.checkRequired(entry, ['supervisor_name', 'supervisor_phone_number'])
            }
          } else {
            isValid = true;
          }
          if (entry.start && (entry.start.length > 0)) {
            isValid &= entry._$mask_start("isComplete");
          }
          if (entry.end && (entry.end.length > 0)) {
            isValid &= entry._$mask_end("isComplete");
          }
          if (entry.supervisor_phone_number && (entry.supervisor_phone_number.length > 0)) {
            isValid &= entry._$mask_supervisor_phone("isComplete");
          }
          entry._valid = isValid;
          return isValid;
        });

        scope.BF.isEmptyEntry(function(blueprint, entry) {
          var isEmpty = scope.BF.isAllKeysEmpty(entry, ['company_name', 'location', 'position_title', 'start', 'end']);
          if (entry.contact_supervisor) {
            isEmpty &= scope.BF.isAllKeysEmpty(entry, ['supervisor_name', 'supervisor_phone_number'])
          }
          return isEmpty;
        });

        scope.BF.validate();
        scope.$watch('blueprint.datum', _.bind(scope.BF.validate, scope.BF), true);

      }
    };
  }]);
