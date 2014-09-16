'use strict';

module.exports = angular.module('Review')
  .controller('AccountSettingsCtrl', ['$scope', '$rootScope', 'apiKey', 'ApplyanceAPI', 'Store', '$timeout', 'flash',
  function ($scope, $rootScope, apiKey, ApplyanceAPI, Store, $timeout, flash) {

    $scope.apiKey = apiKey;
    $scope.flash = flash;
    $scope.currentInfo = Store.getAccount();
    $scope.account = angular.copy($scope.currentInfo);

    if ($scope.account.avatar) {
      $scope.account.attachment = {
        url: $scope.account.avatar.url
      };
    }

    $scope.clickChoose = function() {
      $timeout(function() {
        var logo = document.querySelectorAll('#avatar');
        var event = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
        logo[0].dispatchEvent(event);
      }, 100);
    }

    $scope.passwordNeeded = false;
    $scope.checkForPasswordNeeded = function() {
      $scope.passwordNeeded = (($scope.account.newPassword.length > 0) || ($scope.account.email != $scope.currentInfo.email));
    }

    $scope.isUpdating = false;
    $scope.updateAccount = function() {

      $scope.isUpdating = true;
      var updatedAccount = {};

      // Name
      var newName = ($scope.account.name == $scope.currentInfo.name) ? null : $scope.account.name;
      if (newName) {
        updatedAccount["name"] = newName;
      }

      // Email
      var newEmail = ($scope.account.email == $scope.currentInfo.email) ? null : $scope.account.email;
      if (newEmail) {
        updatedAccount["email"] = newEmail;
      }

      // Password
      var newPassword = (($scope.account.newPassword) && ($scope.account.newPassword.length > 0)) ? $scope.account.newPassword : null;
      if (newPassword) {
        updatedAccount["new_password"] = newPassword;
      }

      // Verify password
      if (newPassword || newEmail) {
        updatedAccount["password"] = $scope.account.currentPassword;
      }

      // Avatar
      if ($scope.account.fileObj) {
        ApplyanceAPI.uploadAttachment($scope.account.fileObj,
          $scope.account.fileObj.type).then(
          function(r) {
            updatedAccount['avatar'] = {
              name: $scope.account.fileObj.name,
              token: r.data.token
            };
            updatedAccount["id"] = $scope.currentInfo.id;
            ApplyanceAPI.updateAccount(updatedAccount.id, updatedAccount).then(function(account) {
              $scope.afterUpdate(account);
            });
          }
        );
      } else if (!_.isEmpty(updatedAccount)) {
        updatedAccount["id"] = $scope.currentInfo.id;
        ApplyanceAPI.updateAccount(updatedAccount.id, updatedAccount).then(function(account) {
          $scope.afterUpdate(account);
        });

      } else {
        $scope.isUpdating = false;
      }

    };

    $scope.afterUpdate = function(account) {
      Store.setAccount(account);
      $scope.currentInfo = account;
      $scope.isUpdating = false;

      $scope.flash.setMessage("Account settings updated successfully.");
      $rootScope.$broadcast('flash');
    };

  }]);
