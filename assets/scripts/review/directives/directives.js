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
  .directive('aplClickOutside', ['$document', function($document) {
    return {
      scope: {
        aplClickOutside: '&'
      },
      link: function(scope, elem, attr, ctrl) {
        elem.bind('click', function(e) {
          e.stopPropagation();
        });
        $document.bind('click', function() {
          scope.$apply(function() {
            scope.aplClickOutside();
          });
        });
      }
    }
  }])
  .directive('aplColorSwatch', ['Store', '$location', '$document', '$filter',
    function (Store, $location, $document, $filter) {
    return {
      restrict: 'AE',
      templateUrl: 'views/review/directives/colorSwatch.html',
      scope: {
        color: "=",
        onColorSelected: "&"
      },
      link: function(scope, elem, attrs) {
        scope.showPane = false;
        scope.colors = [
          { hex: "FF3E3E" },
          { hex: "FF9A3E" },
          { hex: "E5DC35" },
          { hex: "3EFF7E" },
          { hex: "40D2FF" },
          { hex: "D93EFF" },

          { hex: "992623" },
          { hex: "995C25" },
          { hex: "999925" },
          { hex: "25994C" },
          { hex: "267E99" },
          { hex: "822399" }
        ];
        scope.selectedColor = _.findWhere(scope.colors, { hex: scope.color });

        scope.selectColor = function(color) {
          scope.selectedColor = color;
          scope.onColorSelected({
            color: color.hex
          });
          scope.showPane = false;
        };
      }
    }
  }])
;
