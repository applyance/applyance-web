'use strict';

module.exports = angular.module('Register')
  .controller('FormCtrl', ['$scope', '$http', 'ApplyanceAPI', '$timeout',
    function ($scope, $http, ApplyanceAPI, $timeout) {

      $scope.form = {
        step: 1,
        submitted: false,
        reviewer: {},
        entity: {}
      };

      $scope.clickChoose = function() {
        $timeout(function() {
          var logo = document.querySelectorAll('#logo');
          var event = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
          });
          logo[0].dispatchEvent(event);
        }, 100);

        // ApplyanceAPI.uploadAttachment($scope.e.fileObj,
        //   $scope.e.fileObj.type).then(
        //   function(r) {
        //     $scope.updateEntity({
        //       name: $scope.e.fileObj.name,
        //       token: r.data.token
        //     });
        //   },
        //   function(r) {
        //     console.log("failed to upload logo");
        //     console.log(r);
        //   }
        // );
      }

      $scope.submit = function() {
        alert('boom');
      }

    }]);
