'use strict';

module.exports = angular.module('Review')
  .controller('EntityEntitiesCtrl', ['$scope', 'ApplyanceAPI', '$timeout', 'Store', '$location',
    function ($scope, ApplyanceAPI, $timeout, Store, $location) {

      if (!Store.hasActiveFeature('locations')) {
        $location.path($scope.getRootPath());
      }

      if (Store.getActiveEntity().parent) {
        $location.path("/entities/" + Store.getActiveEntityId() + "/settings");
      }

      $scope.form = {
        adding: false
      };

      $scope.units = [];
      ApplyanceAPI.getEntities(Store.getActiveEntityId()).then(function(entities) {
         $scope.entities = entities.plain().reverse();
      });

      $scope.isEditing = function(entity) {
        return !!entity.isEditing;
      };

      $scope.removeEntity = function(entity) {
        entity.removing = true;
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
        var activeEntity = Store.getActiveEntity();
        var entityToAdd = { name: "New Entity" };

        if (activeEntity.logo) {
          entityToAdd.logo = {
            name: activeEntity.logo.name,
            token: activeEntity.logo.token
          };
        }

        $scope.form.adding = true;

        // Update DB through API
        ApplyanceAPI.postEntity(Store.getActiveEntityId(), entityToAdd).then(function(entity) {

          // Get this user's reviewer obj
          var accountId = Store.getAccount().id;

          var reviewerObj;
          angular.forEach(entity.reviewers, function(r) {
            if (r.account.id == accountId) {
              reviewerObj = r;
            }
          });
          reviewerObj.entity = entity;

          // Update data Store
          Store.addEntity(reviewerObj);

          // Update scope and UI
          entity.isEditing = true;
          $scope.entities.unshift(entity);
          _.defer(function() {
            $scope.$broadcast('isEditingEntity-' + entity.id);
          });

          $scope.form.adding = false;

        });
      };

      $scope.navToEntitySettings = function(entityId) {
        Store.setActiveEntityId(entityId);
        $location.path('/entities/' + Store.getActiveEntityId() + '/settings');
      };

    }]);
