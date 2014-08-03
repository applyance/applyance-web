'use strict';

module.exports = angular.module('Review')
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
              if (!scope.fileread.attachment) {
                scope.fileread.attachment = {};
              }
              scope.fileread.attachment.url = loadEvent.target.result;
            });
          }
          dataUrlReader.readAsDataURL(changeEvent.target.files[0]);
        });
      }
    }
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
