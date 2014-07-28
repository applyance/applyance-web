'use strict';

angular.module('ApplyanceApp')
  .controller('RootCtrl', function ($scope, ApplyanceAPI, $location) {

    ApplyanceAPI.setApiHost(apiHost);
    ApplyanceAPI.setApiKey(apiKey);

    ApplyanceAPI.getMe().then(function(me) {
      $scope.me = me.data;

      // Fill list of available contexts for this user
      $scope.contexts = [];
      $scope.currentContextObj;

      // Get all the entities
      angular.forEach($scope.me.admins, function(admin, index) {
        var contextObj = {
          id:   admin.entity.id,
          name: admin.entity.name,
          type: "entities"
        };
        $scope.contexts.push(contextObj);

        // set default context
        if (!$scope.currentContextObj) {
          $scope.currentContextObj = contextObj;
          $scope.entity = admin.entity;
        }
      });

      // Get all the units
      angular.forEach($scope.me.reviewers, function(reviewer, index) {
        var contextObj = {
          id:   reviewer.unit.id,
          name: reviewer.unit.name,
          type: "units"
        };
        $scope.contexts.push(contextObj);
      });
    });

    $scope.isActive = function(route) {
      return route === $location.path();
    }

    $scope.getAvatarURL = function() {
      if (!$scope.me) { return; }

      if ($scope.me.account.avatar) {
        return $scope.me.account.avatar.url;
      }
      return 'https://www.gravatar.com/avatar/' + CryptoJS.MD5($scope.me.account.email);
    };

    $scope.updateContext = function() {
      if ($scope.currentContextObj.type == "entities") {
        $scope.entity = $scope.getEntity($scope.currentContextObj.id);
        $location.path("/entities/" + $scope.entity.id + "/applications");
      } else if ($scope.currentContextObj.type == "units") {
        $scope.unit = $scope.getUnit($scope.currentContextObj.id);
        $location.path("/units/" + $scope.unit.id + "/applications");
      }
    };

    $scope.getEntity = function(entityId) {
      return _.find($scope.me.admins, function(admin) {
        return admin.entity.id == entityId;
      });
    };

    $scope.getUnit = function(unitId) {
      return _.find($scope.me.reviewers, function(reviewer) {
        return reviewer.unit.id == unitId;
      });
    };

  });
