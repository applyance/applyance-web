'use strict';

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

      $scope.selectedEntity = Store.getActiveEntity();
      $rootScope.$on('contextChanged', function(e, args) {
        $scope.selectedEntity = Store.getActiveEntity();
      });

      $scope.updateEntitySelect = function() {
        Store.setActiveEntityId($scope.selectedEntity.id);
        $location.path('/entities/' + Store.getActiveEntityId() + '/applications');
      };

      $scope.getAvatarURL = function() {
        if (!Store.getAccount()) { return; }

        if (Store.getAccount().avatar) {
          return Store.getAccount().avatar.url;
        }
        return 'https://www.gravatar.com/avatar/' + CryptoJS.MD5(Store.getAccount().email) + '?d=mm';
      };

    }]);
