'use strict';

angular.module('Review')
  .controller('EntityEntitiesCtrl', ['$scope', 'ApplyanceAPI', 'Me', 'Context',
    function ($scope, ApplyanceAPI, Me, Context) {

      $scope.entity = Me.getEntity(Context.getId());

      $scope.units = [];
      ApplyanceAPI.getEntities($scope.entity.id).then(function(entities) {
         $scope.entities = entities;
      });

      $scope.isEditing = function(entity) {
        return !!entity.isEditing;
      }

      $scope.removeUnit = function(entity) {
        ApplyanceAPI.deleteEntity(entity.id).then(function() {
          $scope.entities.splice($scope.entities.indexOf(entity), 1);
        });
      }

      $scope.triggerEdit = function(entity) {
        entity.isEditing = true;
        $scope.$broadcast('isEditingEntity-' + entity.id);
      }

      $scope.updateEntity = function(entity) {
        entity.isEditing = false;
        ApplyanceAPI.putEntity({
          id: entity.id,
          name: entity.name
        });
      }

      $scope.addEntity = function() {
        ApplyanceAPI.postEntity($scope.entity.id, {
          name: "New Entity"
        }).then(function(entity) {
          entity.isEditing = true;
          $scope.entities.push(entity);
          _.defer(function() {
            $scope.$broadcast('isEditingEntity-' + entity.id);
          });
        });
      }

    }]);
