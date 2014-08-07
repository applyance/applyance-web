'use strict';

module.exports = angular.module('Review')
  .directive('ngModelOnblur', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      priority: 1, // needed for angular 1.2.x
      link: function(scope, elm, attr, ngModelCtrl) {
          if (attr.type === 'radio' || attr.type === 'checkbox') return;

          elm.unbind('input').unbind('keydown').unbind('change');
          elm.bind('blur', function() {
              scope.$apply(function() {
                  ngModelCtrl.$setViewValue(elm.val());
              });
          });
      }
    };
  })
  .directive('contextSwitcher', ['Store', '$location', function (Store, $location) {
    return {
      restrict: 'AE',
      replace: true,
      templateUrl: 'scripts/review/directives/contextSwitcher.html',
      link: function(scope, elem, attrs) {
        scope.showEntityList = false;
        scope.activeEntity = function() {
          return Store.getActiveEntity();
        };
        scope.entities = function() {
          return Store.getEntities();
        };
        scope.updateEntitySelect = function(selectedEntity) {
          scope.showEntityList = false;
          Store.setActiveEntityId(selectedEntity.id);
          $location.path('/entities/' + Store.getActiveEntityId() + '/applications');
        };
      }
    };
  }])
;
