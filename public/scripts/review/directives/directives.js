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
  .directive('contextSwitcher', ['Store', '$location', '$document', function (Store, $location, $document) {
    return {
      restrict: 'AE',
      replace: true,
      templateUrl: 'scripts/review/directives/contextSwitcher.html',
      link: function(scope, elem, attrs) {
        scope.showEntityList = false;

        scope.entities = function() {
          return Store.getEntities();
        };
        scope.activeEntity = function() {
          return Store.getActiveEntity();
        };
        scope.updateEntitySelect = function(selectedEntity) {
          scope.showEntityList = false;
          Store.setActiveEntityId(selectedEntity.id);
          $location.path('/entities/' + Store.getActiveEntityId() + '/applications');
        };
        elem.on('click', function(e) {
          e.stopPropagation();
        });
        $document.on('click', function() {
          scope.$apply(function() {
            scope.showEntityList = false;
          });
        });
      }
    };
  }])
  .directive('ngConfirmClick', [
    function() {
      return {
        link: function (scope, element, attr) {
          var msg = attr.ngConfirmClick || "Are you sure?";
          var clickAction = attr.confirmedClick;
          element.bind('click',function (e) {
            e.stopPropagation();
            if (window.confirm(msg)) {
              scope.$eval(clickAction)
            }
          });
        }
      };
    }
  ])
  .directive('aplGo', ['$location', '$timeout',
    function($location, $timeout) {
      return {
        link: function (scope, element, attr) {
          var targetPath = attr.aplGo;
          var canGo = (attr.aplCanGo == "true");
          if (canGo) {
            element.bind('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              $timeout(function() {
                $location.path(targetPath);
              }, 50);
            });
          }
        }
      }
    }
  ])
;
