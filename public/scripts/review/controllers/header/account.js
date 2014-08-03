'use strict';

var CryptoJS = require("crypto-js");

module.exports = angular.module('Review')
  .controller('AccountCtrl', ['$scope', 'Store', '$rootScope', '$location',
    function ($scope, Store, $rootScope, $location) {

      $scope.accountId = Store.getAccount().id;

      $scope.entities = function() {
        return Store.getEntities();
      };
      $scope.getActiveEntity = function() {
        return Store.getActiveEntity();
      };
      $scope.selectedEntity = _.findWhere($scope.entities(), { id: Store.activeEntityId });

      $scope.updateEntitySelect = function() {
        Store.activeEntityId = $scope.selectedEntity.id;
        $location.path('/entities/' + Store.activeEntityId + '/applications');
      };

      // Update the context on route change
      $rootScope.$on("$routeChangeSuccess", function(args) {

        var entityId = $location.path().split("/")[2];
        if (entityId) {
          Store.activeEntityId = entityId;
        }

        $rootScope.inSettings = false;
      });

      $scope.getAvatarURL = function() {
        if (!Store.getAccount()) { return; }

        if (Store.getAccount().avatar) {
          return Store.getAccount().avatar.url;
        }
        return 'https://www.gravatar.com/avatar/' + CryptoJS.MD5($scope.me.account.email) + '?d=mm';
      };

    }]);
