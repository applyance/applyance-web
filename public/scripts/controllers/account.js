'use strict';

angular.module('ApplyanceApp')
  .controller('AccountCtrl', ['$scope', '$location', 'Me', 'Context',
    function ($scope, $location, Me, Context) {

      Me.onInit(function() {
        $scope.me = Me.getMe();
        $scope.initContextOptions();

        if (Context.exists()) {
          $scope.activeContextOption = _.findWhere($scope.contextOptions, { group: Context.getGroup(), id: Context.getId() });
        } else {
          $scope.activeContextOption = $scope.contextOptions[0];
        }
      });

      $scope.contextOptions = [];

      $scope.initContextOptions = function() {
        _.each(Me.getEntities(), function(entity) {
          $scope.contextOptions.push({ id: entity.id, name: entity.name, group: 'entities' });
        });
        _.each(Me.getUnits(), function(unit) {
          $scope.contextOptions.push({ id: unit.id, name: unit.name, group: 'units' });
        });
      };

      $scope.updateContextSelect = function() {
        $location.path('/' + $scope.activeContextOption.group + '/' + $scope.activeContextOption.id + '/applications');
      };

      $scope.getAvatarURL = function() {
        if (!$scope.me) { return; }

        if ($scope.me.account.avatar) {
          return $scope.me.account.avatar.url;
        }
        return 'https://www.gravatar.com/avatar/' + CryptoJS.MD5($scope.me.account.email);
      };

    }]);
