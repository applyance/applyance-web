'use strict';

module.exports = angular.module('Register')
  .controller('ReviewerCtrl', ['$scope', '$http', 'ApplyanceAPI', '$timeout',
    function ($scope, $http, ApplyanceAPI, $timeout) {

      $scope.isValid = function() {
        $scope.form.reviewer.isValid = true;
        if (
             $scope.form.reviewer.name.length == 0
          || $scope.form.reviewer.email.length == 0
          || $scope.form.reviewer.password.length == 0) {
          $scope.form.reviewer.isValid = false;
        }
      };

      $scope.$watch('form.reviewer', $scope.isValid, true);

    }]);
