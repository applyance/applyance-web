'use strict';

angular.module('Review')
  .controller('EntityLabelsCtrl', ['$scope', 'ApplyanceAPI', '$timeout', 'Me', 'Context',
    function ($scope, ApplyanceAPI, $timeout, Me, Context) {

      ApplyanceAPI.getEntity(Context.getId()).then(function(entity) {
        $scope.entity = entity.plain();

        $scope.labels = [];
        ApplyanceAPI.getLabels($scope.entity.id).then(function(labels) {
           $scope.labels = labels;
           $scope.labels.reverse();
        });
      });

      $scope.isEditing = function(label) {
        return !!label.isEditing;
      }

      $scope.removeLabel = function(label) {
        ApplyanceAPI.deleteLabel(label.id).then(function() {
          $scope.labels.splice($scope.labels.indexOf(label), 1);
        });
      }

      $scope.triggerEdit = function(label) {
        label.isEditing = true;
        $timeout(function() {
          $scope.$broadcast('isEditingLabel-' + label.id);
        }, 100);
      }

      $scope.updateLabel = function(label) {
        label.isEditing = false;
        ApplyanceAPI.putLabel({
          id: label.id,
          name: label.name,
          color: label.color
        });
      }

      $scope.addLabel = function() {
        ApplyanceAPI.postLabel($scope.entity.id, {
          name: "New Label",
          color: "000000"
        }).then(function(label) {
          label.isEditing = true;
          $scope.labels.unshift(label);
          _.defer(function() {
            $scope.$broadcast('isEditingLabel-' + label.id);
          });
        });
      }

    }]);
