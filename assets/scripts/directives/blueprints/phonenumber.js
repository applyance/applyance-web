'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintPhonenumber', ['BlueprintFactory', function(BlueprintFactory) {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/blueprints/phonenumber.html',
      scope: {
        aplBlueprint: "="
      },
      link: function (scope, elm, attr) {
        scope.blueprint = scope.aplBlueprint;
        scope.BF = new BlueprintFactory(scope.blueprint);

        scope.BF.validate();
        scope.$watch('blueprint.datum', _.bind(scope.BF.validate, scope.BF), true);
      }
    };
  }]);
