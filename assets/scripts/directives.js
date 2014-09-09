'use strict';

module.exports = angular.module('Applyance')
  .directive('focusOn', function() {
    return function(scope, elem, attr) {
      scope.$on(attr.focusOn, function(e) {
        elem[0].focus();
      });
    };
  })
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
;
