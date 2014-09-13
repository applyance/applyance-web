'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintFileupload', ['$timeout', 'ApplyanceAPI', function ($timeout, ApplyanceAPI) {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/blueprints/fileupload.html',
      scope: {
        aplBlueprint: "="
      },
      link: function (scope, elm, attr) {
        scope.blueprint = scope.aplBlueprint;
        scope.blueprint.attachments = [];
        scope.fileFactory = {};

        scope.onFilesChange = function() {
          _.each(scope.fileFactory.files, function(file) {
            ApplyanceAPI.uploadAttachment(file, file.type).then(scope.onUpload(file));
          });
        };

        scope.onUpload = function(file) {
          return function(attachment) {
            file.attachment = {
              name: file.name,
              token: attachment.data.token
            };
            scope.blueprint.attachments.push(file.attachment);
          };
        };

        scope.remove = function(file) {
          var blueprintIndex = scope.blueprint.attachments.indexOf(file.attachment);
          scope.blueprint.attachments.splice(blueprintIndex, 1);

          var factoryIndex = scope.fileFactory.files.indexOf(file);
          scope.fileFactory.files.splice(factoryIndex, 1);
        };

        scope.getImageSrc = function(file) {
          return file.isImage ? file.dataUrl : null;
        };

        scope.clickChoose = function() {
          $timeout(function() {
            var fileEl = elm.find('input[type="file"]');
            var event = new MouseEvent('click', {
              'view': window,
              'bubbles': true,
              'cancelable': true
            });
            fileEl[0].dispatchEvent(event);
          }, 100);
        };
      }
    };
  }]
  );
