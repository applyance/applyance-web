'use strict';

module.exports = angular.module('Review')
  .controller('EntityLabelsCtrl', ['$scope', '$location', 'ApplyanceAPI', '$timeout', 'Store', '$filter',
    function ($scope, $location, ApplyanceAPI, $timeout, Store, $filter) {

      if (!Store.hasActiveFeature('labels')) {
        $location.path($scope.getRootPath());
      }

      $scope.activeEntity = Store.getActiveEntity();

      $scope.labels = [];
      ApplyanceAPI.getLabels($scope.activeEntity.id).then(function(labels) {
         // $scope.labels.reverse();
         $scope.labels = $filter('orderBy')(labels, "name");
      });

      if ($scope.activeEntity.parent) {
        ApplyanceAPI.getLabels($scope.activeEntity.parent.id).then(function(labels) {
          labels = _.each(labels, function(label) { label.isParent = true; });
          $scope.labels.reverse();
          $scope.labels = $scope.labels.concat(labels);
        });
      }

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
      };

      $scope.updateLabelColor = function(color, label) {
        ApplyanceAPI.putLabel({
          id: label.id,
          color: color
        }).then(function(r) {
          angular.forEach($scope.labels, function(l, index) {
            if (l.name == label.name) {
              l.color = color;
            }
          });
        });
      };

      $scope.addLabel = function() {
        ApplyanceAPI.postLabel(Store.getActiveEntityId(), {
          name: "New Label",
          color: "40D2FF"
        }).then(function(label) {
          label.isEditing = true;
          $scope.labels.unshift(label);
          _.defer(function() {
            $scope.$broadcast('isEditingLabel-' + label.id);
          });
        });
      }

    }]);
