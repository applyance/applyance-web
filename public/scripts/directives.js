'use strict';

angular.module('ApplyanceApp')
  .directive("fileread", [function () {
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
  }]);
