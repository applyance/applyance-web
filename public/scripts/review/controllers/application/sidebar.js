'use strict';

module.exports = angular.module('Review')
  .controller('ApplicationSidebarCtrl', ['$scope', 'ApplyanceAPI',
    function ($scope, ApplyanceAPI) {

      $scope.entityLabels = [];

      ApplyanceAPI.getLabels($scope.activeEntity.id).then(function(labels) {
        labels = _.reject(labels, function(label) {
          return _.contains(_.pluck($scope.citizen.labels, 'id'), label.id);
        });
        $scope.entityLabels = $scope.entityLabels.concat(labels);
      });

      if ($scope.activeEntity.parent) {
        ApplyanceAPI.getLabels($scope.activeEntity.parent.id).then(function(labels) {
          labels = _.reject(labels, function(label) {
            return _.contains(_.pluck($scope.citizen.labels, 'id'), label.id);
          });
          labels = _.each(labels, function(label) { label.isParent = true; });
          $scope.entityLabels = $scope.entityLabels.concat(labels);
        });
      }

      $scope.dropdown = {
        open: false
      };

      $scope.toggleLabelOnCitizen = function(label) {
        var labelIds = _.pluck($scope.citizen.labels, 'id');
        if (_.contains(labelIds, label.id)) {
          labelIds = _.without(labelIds, label.id);
          $scope.citizen.labels = _.reject($scope.citizen.labels, function(srcLabel) {
            return srcLabel.id == label.id;
          });
          $scope.entityLabels.push(label);
        } else {
          labelIds.push(label.id);
          $scope.citizen.labels.push(label);
          $scope.entityLabels = _.reject($scope.entityLabels, function(srcLabel) {
            return srcLabel.id == label.id;
          });
        }
        ApplyanceAPI.putCitizen($scope.citizen.id, { label_ids: labelIds });
      };

    }
  ]
);
