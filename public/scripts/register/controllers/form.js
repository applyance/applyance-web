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
      }

      $scope.submit = function() {

        ApplyanceAPI.uploadAttachment(
          $scope.form.entity.fileObj,
          $scope.form.entity.fileObj.type).then(
          function(r) {
            $scope.form.entity.logo = {
              name: $scope.form.entity.fileObj.name,
              token: r.data.token
            };
            ApplyanceAPI.postNewEntity($scope.form.entity).then(function(entity) {
              $scope.form.entity = entity;
              ApplyanceAPI.postReviewer(entity.id, $scope.form.reviewer).then(function(reviewer) {
                console.dir(reviewer);
                $scope.form.reviewer = reviewer;
                $scope.form.submitted = true;
              });
            });
          }
        );


      }

    }]);
