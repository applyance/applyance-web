'use strict';

angular.module('Review')
  .controller('AccountSettingsCtrl', ['$scope', '$routeParams', '$location', 'Me', 'Context',
  function ($scope, $routeParams, $location, Me, Context) {

    var currentInfo = Me.getMe().account;
    $scope.updatedAccountInfo = angular.copy(currentInfo);

    $scope.updateAccount = function() {

      var updatedAccountInfo = {};

      // Name
      var newName = $scope.updatedAccountInfo.name == currentInfo.name ? null : $scope.updatedAccountInfo.name;
      if (newName) {
        updatedAccountInfo["name"] = newName;
      }
      // email
      var newEmail = $scope.updatedAccountInfo.email == currentInfo.email ? null : $scope.updatedAccountInfo.email;
      if (newEmail) {
        updatedAccountInfo["email"] = newEmail;
      }
      // password
      var newPassword = $scope.updatedAccountInfo.newPassword != null ? $scope.updatedAccountInfo.newPassword : null;
      if (newPassword) {
        updatedAccountInfo["new_password"] = newPassword;
      }
      // verify password
      if (newPassword || newEmail) {
        updatedAccountInfo["password"] = newPassword;
      }

      // Avatar

      if (updatedAccountInfo != {}) {
        updatedAccountInfo["id"] = currentInfo.id;
        Me.updateMe(updatedAccountInfo);
      }
    };

  }]);
