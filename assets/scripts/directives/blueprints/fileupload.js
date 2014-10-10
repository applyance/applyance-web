'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintFileupload', ['$timeout', 'ApplyanceAPI', 'BlueprintFactory', function ($timeout, ApplyanceAPI, BlueprintFactory) {
    return {
      restrict: 'E',
      templateUrl: '/views/directives/blueprints/fileupload.html',
      scope: {
        aplBlueprint: "="
      },
      link: function (scope, elm, attr) {
        scope.blueprint = scope.aplBlueprint;
        scope.BF = new BlueprintFactory(scope.blueprint, {
          default: null,
          multiple: false
        });
        scope.blueprint.datum.attachments = [];

        scope.blueprint.definition.helper = scope.blueprint.definition.helper || {};
        scope.selection_constraint = scope.blueprint.definition.helper.selection_constraint || "single";
        scope.fileFactory = {};
        scope.buttonFileText = scope.selection_constraint == 'multiple' ? 'files' : 'a file';

        scope._filesUploaded = [];
        scope.fileIndex = 0;
        scope._uploading = false;

        //
        // Validation
        //

        scope.BF.isValid(function(blueprint) {
          return blueprint.is_required ? (blueprint.datum.attachments.length > 0) : true;
        });

        scope.BF.isEmpty(function(blueprint) {
          return blueprint.datum.attachments.length == 0;
        });

        scope.BF.validate();
        scope.$watch('blueprint.datum', _.bind(scope.BF.validate, scope.BF), true);

        /* Button text based on whether or not multiple files are allowed */

        scope.getButtonText = function() {
          if (scope._uploading) {
            return "Uploading..."
          } else {
            return "Drag " + scope.buttonFileText + " here or click to choose " + scope.buttonFileText + "...";
          }
        };

        /* Handle the uploads */

        scope.onFilesChange = function() {
          scope._uploading = true;
          async.each(scope.fileFactory.files, scope.upload, function(err) {
            scope._uploading = false;
          });
        };

        scope.upload = function(file, callback) {
          if (_.contains(scope._filesUploaded, file.id)) {
            callback();
            return;
          }
          ApplyanceAPI.uploadAttachment(file, file.type).then(scope.onUpload(file, callback));
          file.id = scope.fileIndex;
          scope._filesUploaded.push(file.id);
          scope.fileIndex++;
        };

        scope.onUpload = function(file, callback) {
          return function(attachment) {
            file.attachment = {
              name: file.name,
              token: attachment.data.token
            };
            if (!(scope.selection_constraint == 'multiple')) {
              scope.blueprint.datum.attachments = [];
            }
            scope.blueprint.datum.attachments.push(file.attachment);
            callback();
          };
        };

        scope.remove = function(file) {
          var blueprintIndex = scope.blueprint.datum.attachments.indexOf(file.attachment);
          scope.blueprint.datum.attachments.splice(blueprintIndex, 1);

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

        /* Handle choose button drop */

        scope.$chooseBtn = elm.find('.js-choose-btn');

        scope.onChooseDragOver = function(e) {
          scope.$chooseBtn.addClass('is-draggedover');
          return false;
        };

        scope.onChooseDragEnd = function(e) {
          scope.$chooseBtn.removeClass('is-draggedover');
          return false;
        };

        scope.onChooseDrop = function(e) {
          scope.$chooseBtn.removeClass('is-draggedover');
          e.preventDefault();

          scope.fileFactory.files = scope.fileFactory.files || [];
          for (var i = 0; i < e.originalEvent.dataTransfer.files.length; i++) {
            var file = e.originalEvent.dataTransfer.files[i];
            scope.massageFile(file)
            scope.fileFactory.files.push(file);
          }
          scope.onFilesChange();

          return false;
        };

        scope.$chooseBtn.on('dragover', scope.onChooseDragOver);
        scope.$chooseBtn.on('dragout', scope.onChooseDragEnd);
        scope.$chooseBtn.on('dragend', scope.onChooseDragEnd);
        scope.$chooseBtn.on('drop', scope.onChooseDrop);

        scope.onReadFile = function(file) {
          return function(readEvent) {
            file.dataUrl = readEvent.target.result;
          };
        };

        scope.massageFile = function(file) {
          file.isImage = file.type.lastIndexOf("image", 0) === 0;
          var dataUrlReader = new FileReader();
          dataUrlReader.onload = scope.onReadFile(file);
          dataUrlReader.readAsDataURL(file);
        };

      }
    };
  }]
  );
