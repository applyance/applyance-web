'use strict';

module.exports = angular.module('Applyance')
  .directive('aplManageDefinition', [function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        'aplOnCancel': '&',
        'aplOnSave': '&',
        'aplDefinition': '=',
        'aplDefinitionCount': '='
      },
      templateUrl: 'views/directives/manageDefinition.html',
      link: function(scope, elem, attrs) {

        scope.state = {
          saving: false
        };

        if (scope.aplDefinition) {
          scope.definition = angular.copy(scope.aplDefinition);
        } else {
          scope.definition = {
            label: "Question goes here?",
            description: "Description goes here..."
          };
        }

        scope.cancel = function() {
          scope.aplOnCancel();
        };

        scope.save = function() {
          scope.state.saving = true;
          scope.aplOnSave({
            definition: scope.definition,
            cb: function(definition) {
              scope.state.saving = false;
            }
          });
        };

      }
    };
  }])
;
