'use strict';

module.exports = angular.module('Register')
  .controller('FormCtrl', ['$scope', '$http', 'ApplyanceAPI', '$timeout', 'domain',
    function ($scope, $http, ApplyanceAPI, $timeout, domain) {

      $scope.domain = domain;

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

      $scope.setFormActivated = function() {
        $scope.$broadcast('formActivated');
      };

      $scope.blueprints = [];
      $scope.definitions = [];
      ApplyanceAPI.getDomainDefinitions($scope.domain.id).then(function(definitions) {
        $scope.definitions = definitions.plain();
        var coreDefinitions = _.filter($scope.definitions, function(definition) {
          return definition.is_core || definition.is_default;
        });
        _.each(coreDefinitions, function(definition) {
          $scope.blueprints.push({
            definition_id: definition.id,
            position: definition.default_position,
            is_required: definition.default_is_required
          });
        });
      });

      $scope.isReviewerValid = function() {
        $scope.form.reviewer.isValid = true;
        if (
             $scope.form.reviewer.name.length == 0
          || $scope.form.reviewer.email.length == 0
          || $scope.form.reviewer.password.length == 0) {
          $scope.form.reviewer.isValid = false;
        }
      };

      $scope.$watch('form.reviewer', $scope.isReviewerValid, true);

      $scope.isEntityValid = function() {
        $scope.form.entity.isValid = true;
        if ($scope.form.entity.name.length == 0) {
          $scope.form.entity.isValid = false;
        }
      };

      $scope.$watch('form.entity', $scope.isEntityValid, true);

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
        var entity = {
          name: $scope.form.entity.name
        };
        if ($scope.form.entity.logo) {
          entity.logo = $scope.form.entity.logo;
        }
        ApplyanceAPI.postDomainEntity($scope.domain.id, entity).then($scope.onCreateEntity);
      };

    }]);
