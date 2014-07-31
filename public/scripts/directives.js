'use strict';

angular.module('ApplyanceApp')
  .directive("fileread", function () {
    return {
      scope: {
          fileread: "="
      },
      link: function (scope, element, attributes) {
        element.bind("change", function (changeEvent) {
          scope.$apply(function () {
            scope.fileread.fileObj = changeEvent.target.files[0];
          });

          var dataUrlReader = new FileReader();
          dataUrlReader.onload = function (loadEvent) {
            scope.$apply(function () {
              if (!scope.fileread.logo) {
                scope.fileread.logo = {};
              }
              scope.fileread.logo.url = loadEvent.target.result;
            });
          }
          dataUrlReader.readAsDataURL(changeEvent.target.files[0]);
        });
      }
    }
  })
  .directive("avatarread", function () {
    return {
      scope: {
          avatarread: "="
      },
      link: function (scope, element, attributes) {
        element.bind("change", function (changeEvent) {
          scope.$apply(function () {
            scope.avatarread.fileObj = changeEvent.target.files[0];
          });

          var dataUrlReader = new FileReader();
          dataUrlReader.onload = function (loadEvent) {
            scope.$apply(function () {
              if (!scope.avatarread.avatar) {
                scope.avatarread.avatar = {};
              }
              scope.avatarread.avatar.url = loadEvent.target.result;
            });
          }
          dataUrlReader.readAsDataURL(changeEvent.target.files[0]);
        });
      }
    }
  })
  .directive('focusOn', function() {
     return function(scope, elem, attr) {
        scope.$on(attr.focusOn, function(e) {
          elem[0].focus();
        });
     };
  })
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
;
