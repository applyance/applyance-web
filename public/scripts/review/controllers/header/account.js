'use strict';

module.exports = angular.module('Review')
  .controller('AccountCtrl', ['$scope', 'Store', '$rootScope', '$location',
    function ($scope, Store, $rootScope, $location) {

      $scope.accountId = Store.getAccount().id;

      $scope.getAvatarURL = function() {
        if (!Store.getAccount()) { return; }

        if (Store.getAccount().avatar) {
          return Store.getAccount().avatar.url;
        }
        return 'https://www.gravatar.com/avatar/' + CryptoJS.MD5(Store.getAccount().email) + '?d=mm';
      };

    }]);
