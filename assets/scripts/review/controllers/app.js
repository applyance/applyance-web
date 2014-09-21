'use strict';

module.exports = angular.module('Review')
  .controller('AppCtrl', ['$scope', '$rootScope', '$location', 'Store',
    function ($scope, $rootScope, $location, Store) {

      $scope.AppState = {
        newQuestion: false
      };

      $rootScope.$on("planChange", function() {
        window.location.reload();
      });

      $scope.hasActiveFeature = function(feature) {
        var hasFeature = Store.hasActiveFeature(feature);
        return hasFeature;
      };

      $scope.getRootPath = function(feature) {
        var path = 'entities/' + Store.getActiveEntity().id + '/';
        path += Store.hasActiveFeature('applicantList') ? 'applications' : 'spots';
        return path;
      };

      $scope.toggleCreateQuestionDialog = function(toggleValue) {
        $scope.AppState.newQuestion = toggleValue || !$scope.AppState.newQuestion;
      };

      $scope.activeEntityId = function() {
        return Store.getActiveEntityId();
      };

      $scope.activeEntity = function() {
        return Store.getActiveEntity();
      };

      $scope.isActive = function(route) {
        return route === $location.path();
      };

      $scope.isAdmin = function() {
        return Store.getCurrentScope() == "admin";
      };

      $scope.isActiveEntityRoot = function() {
        return Store.getActiveEntity().parent == null;
      };

      $scope.activeApplicationUrl = function() {
        var url = "/";
        if (Store.getActiveEntity().parent) {
          url += Store.getActiveEntity().parent.slug + "/";
        }
        return url += Store.getActiveEntity().slug;
      };

      // Update the active entity context on route change
      $rootScope.$on("$routeChangeSuccess", function(args) {

        var pathParts = $location.path().split("/");

        if (pathParts[1] == "entities") {
          var entityId = pathParts[2];
          if (entityId) {
            Store.setActiveEntityId(entityId);
          }
        }

        $rootScope.inSettings = false;
      });

    }]);
