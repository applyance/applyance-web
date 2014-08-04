'use strict';

module.exports = angular.module('Review')
  .controller('EntityEntitiesCtrl', ['$scope', 'ApplyanceAPI', '$timeout', 'Store', '$location',
    function ($scope, ApplyanceAPI, $timeout, Store, $location) {

      $scope.units = [];
      ApplyanceAPI.getEntities(Store.getActiveEntityId()).then(function(entities) {
         $scope.entities = entities;
         $scope.entities.reverse();
      });

      $scope.isEditing = function(entity) {
        return !!entity.isEditing;
      };

      $scope.removeEntity = function(entity) {
        ApplyanceAPI.deleteEntity(entity.id).then(function() {
          $scope.entities.splice($scope.entities.indexOf(entity), 1);
          Store.removeEntity(entity);
        });
      };

      $scope.triggerEdit = function(entity) {
        entity.isEditing = true;
        $timeout(function() {
          $scope.$broadcast('isEditingEntity-' + entity.id);
        }, 100);
      };

      $scope.updateEntity = function(entity) {
        entity.isEditing = false;
        ApplyanceAPI.putEntity({ id: entity.id, name: entity.name }).then(function(r) {
          Store.setEntity(r.data);
        });
      };

      $scope.addEntity = function() {
        ApplyanceAPI.postEntity(Store.getActiveEntityId(), {
          name: "New Entity"
        }).then(function(entity) {
          entity.isEditing = true;
          $scope.entities.unshift(entity);
          _.defer(function() {
            $scope.$broadcast('isEditingEntity-' + entity.id);
          });
        });
      };

      $scope.navToEntitySettings = function(entityId) {
        Store.setActiveEntityId(entityId);
        $location.path('/entities/' + Store.getActiveEntityId() + '/settings');
      };

    }]);
