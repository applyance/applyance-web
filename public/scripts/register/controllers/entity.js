'use strict';

module.exports = angular.module('Register')
  .controller('EntityCtrl', ['$scope', '$http', 'ApplyanceAPI', '$timeout',
    function ($scope, $http, ApplyanceAPI, $timeout) {

      $scope.isValid = function() {
        $scope.form.entity.isValid = true;
        if ($scope.form.entity.name.length == 0) {
          $scope.form.entity.isValid = false;
        }
      };

      $scope.$watch('form.entity', $scope.isValid, true);

      $scope.clickChoose = function() {
        $timeout(function() {
          var logo = document.getElementById('logo');
          var event = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
          });
          logo.dispatchEvent(event);
        }, 100);
      };

    }]);
