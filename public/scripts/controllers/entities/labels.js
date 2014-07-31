'use strict';

angular.module('ApplyanceApp')
  .controller('EntityLabelsCtrl', ['$scope', 'ApplyanceAPI', 'Me', 'Context',
    function ($scope, ApplyanceAPI, Me, Context) {

      $scope.entity = Me.getEntity(Context.getId());

      $scope.labels = [];
      ApplyanceAPI.getLabels($scope.entity.id).then(function(labels) {
         $scope.labels = labels;
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
        $scope.$broadcast('isEditingLabel-' + label.id);
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
          $scope.labels.push(label);
          _.defer(function() {
            $scope.$broadcast('isEditingLabel-' + label.id);
          });
        });
      }

    }]);
