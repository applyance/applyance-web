'use strict';

module.exports = angular.module('Register')
  .controller('FormCtrl', ['$scope', '$http', 'ApplyanceAPI', '$timeout',
    function ($scope, $http, ApplyanceAPI, $timeout) {

      $scope.form = {
        step: 1,
        submitted: false,
        reviewer: {
          name: "",
          email: "",
          password: "",
          isValid: false
        },
        entity: {
          name: "",
          isValid: false
        }
      };

      $scope.blueprints = [];

      $scope.submit = function() {
        $scope.form.submitting = true;
        if ($scope.form.entity.fileObj) {
          ApplyanceAPI.uploadAttachment(
            $scope.form.entity.fileObj,
            $scope.form.entity.fileObj.type
          ).then($scope.onAttachmentUpload);
        } else {
          $scope.createEntity();
        }
      }

      $scope.onAttachmentUpload = function(attachment) {
        $scope.form.entity.logo = {
          name: $scope.form.entity.fileObj.name,
          token: attachment.data.token
        };
        $scope.createEntity();
      };

      $scope.onLoggedIn = function() {
        $scope.form.submitted = true;
      };

      $scope.onCreateBlueprints = function(blueprints) {
        $http.post('/accounts/login/headless', {
          email: $scope.form.reviewer.email,
          password: $scope.form.reviewer.password
        }).then($scope.onLoggedIn);
      };

      $scope.onAuthenticate = function(data, status, headers, config) {
        var api_key = headers('authorization').split('auth=')[1];

        // Mass create blueprints
        $http.post(ApplyanceAPI.getApiHost() + "/entities/" + $scope.entity.id + "/blueprints", {
          blueprints: $scope.blueprints
        }, {
          headers: { 'Authorization': 'ApplyanceLogin auth=' + api_key }
        }).then($scope.onCreateBlueprints);
      };

      $scope.onCreateReviewer = function(reviewer) {
        $scope.reviewer = reviewer;

        // Authenticate
        ApplyanceAPI.authenticate({
          email: $scope.form.reviewer.email,
          password: $scope.form.reviewer.password
        }).success($scope.onAuthenticate);
      };

      $scope.onCreateEntity = function(entity) {
        $scope.entity = entity;
        ApplyanceAPI.postReviewer(entity.id, $scope.form.reviewer).then($scope.onCreateReviewer);
      };

      $scope.createEntity = function() {
        ApplyanceAPI.postNewEntity($scope.form.entity).then($scope.onCreateEntity);
      };

    }]);
