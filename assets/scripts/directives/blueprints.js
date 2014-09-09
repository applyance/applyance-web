'use strict';

module.exports = angular.module('Applyance')
  .directive('aplBlueprints', [function () {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        'definitions': '=',
        'cols': '=',
        'definitionClicked': '&',
        'definitionIsSet': '&',
        'definitionIsDisabled': '&?',
        'definitionEdited': '&?',
        'definitionRemoved': '&?'
      },
      templateUrl: '/views/directives/blueprints.html',
      link: function(scope, elem, attrs) {
        scope.isDisabled = function(definition) {
          if (!scope.definitionIsDisabled) {
            return false;
          }
          return scope.definitionIsDisabled({ definition: definition });
        };
        scope.isSet = function(definition) {
          return scope.definitionIsSet({ definition: definition });
        };
        scope.onClick = function(definition) {
          scope.definitionClicked({ definition: definition });
        };
        scope.edit = function(definition, $event) {
          $event.stopPropagation();
          scope.definitionEdited({ definition: definition });
        };
        scope.remove = function(definition) {
          scope.definitionRemoved({ definition: definition });
        };
      }
    };
  }])
;
