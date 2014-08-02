'use strict';

module.exports = angular.module('Review')
  .controller('EntityEntitiesCtrl', ['$scope', 'ApplyanceAPI', '$timeout', 'Me', 'Context',
    function ($scope, ApplyanceAPI, $timeout, Me, Context) {

      $scope.entity = Me.getEntity(Context.getId());
      
      ApplyanceAPI.getEntity(Context.getId()).then(function(entity) {
        $scope.entity = entity.plain();

        $scope.units = [];
        ApplyanceAPI.getEntities($scope.entity.id).then(function(entities) {
           $scope.entities = entities;
           $scope.entities.reverse();
        });
      });

      $scope.isEditing = function(entity) {
        return !!entity.isEditing;
      }

      $scope.removeEntity = function(entity) {
        ApplyanceAPI.deleteEntity(entity.id).then(function() {
          $scope.entities.splice($scope.entities.indexOf(entity), 1);
        });
      }

      $scope.triggerEdit = function(entity) {
        entity.isEditing = true;
        $timeout(function() {
          $scope.$broadcast('isEditingEntity-' + entity.id);
        }, 100);
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
          $scope.entities.unshift(entity);
          _.defer(function() {
            $scope.$broadcast('isEditingEntity-' + entity.id);
          });
        });
      }

    }]);
