'use strict';

angular.module('ApplyanceApp')
  .directive('eatClick', function () {
    return function (scope, element, attrs) {
      angular.element(element).bind('click', function (event) {
        event.preventDefault();
      });
    }
  })
  .directive('inputLink', ['$parse', function ($parse) {
    return {
      template: "<span class='input-link'><span class='browse-link'>Select a CSV file</span><form class='file-upload-form' action='' enctype='multipart/form-data' method='post' target='google'><input class='file-input' name='csvData' type='file' accept='.csv' /></form></span>​<iframe name='google' id='google-iframe' class='hide' src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAQAICRAEAOw=='></iframe>",
      restrict: 'A',
      link: function (scope, element, attrs) {
        var model = $parse(attrs.inputLink);
        var modelSetter = model.assign;

        var handleFileSelection = function(e) {

          scope.$apply(function () {
            modelSetter(scope, e.target.files[0]);
          });
        };

        element.bind('change', handleFileSelection);
      }
    };
  }])
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

            var binaryReader = new FileReader();
            binaryReader.onload = function (loadEvent) {
              scope.$apply(function () {
                scope.fileread.fileBinary = loadEvent.target.result;
              });
            }
            binaryReader.readAsBinaryString(changeEvent.target.files[0]);

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
