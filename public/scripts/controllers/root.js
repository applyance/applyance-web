'use strict';

angular.module('ApplyanceApp')
  .controller('RootCtrl', function ($scope, ApplyanceAPI, $location) {

    ApplyanceAPI.setApiHost(apiHost);
    ApplyanceAPI.setApiKey(apiKey);

    $scope.isActive = function(route) {
      return route === $location.path();
    }

    ApplyanceAPI.getMe().then(function(me) {
      $scope.me = me.data;
      $scope.entity = $scope.me.admins[0].entity;
      $scope.context = "entities"
      $scope.contextId = $scope.entity.id;
    });

    $scope.getAvatarURL = function() {
      if (!$scope.me) { return; }

      if ($scope.me.account.avatar) {
        return $scope.me.account.avatar.url;
      }
      return 'https://www.gravatar.com/avatar/' + CryptoJS.MD5($scope.me.account.email);
    }

  });
