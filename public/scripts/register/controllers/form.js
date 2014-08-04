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

      $scope.definitions = [];
      ApplyanceAPI.getDefinitions().then(function(definitions) {
        $scope.definitions = definitions;
      });

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
        $scope.form.submitting = true;
        // $timeout(function() {
        //   $scope.form.submitted = true;
        // },1500);
        // return;

        ApplyanceAPI.uploadAttachment(
          $scope.form.entity.fileObj,
          $scope.form.entity.fileObj.type).then(
          function(r) {
            $scope.form.entity.logo = {
              name: $scope.form.entity.fileObj.name,
              token: r.data.token
            };
            ApplyanceAPI.postNewEntity($scope.form.entity).then(function(entity) {
              $scope.entity = entity;

              ApplyanceAPI.postReviewer(entity.id, $scope.form.reviewer).then(function(reviewer) {
                $scope.reviewer = reviewer;

                // Authenticate
                ApplyanceAPI.authenticate({
                  email: $scope.form.reviewer.email,
                  password: $scope.form.reviewer.password
                }).success(function(data, status, headers, config) {

                  var api_key = headers('authorization').split('auth=')[1];

                  // Mass create blueprints
                  $http.post(ApplyanceAPI.getApiHost() + "/entities/" + $scope.entity.id + "/blueprints", {
                    blueprints: $scope.blueprints
                  }, {
                    headers: { 'Authorization': 'ApplyanceLogin auth=' + api_key }
                  }).then(function(blueprints) {
                    $http.post('/accounts/login/headless', {
                      email: $scope.form.reviewer.email,
                      password: $scope.form.reviewer.password
                    }).then(function() {
                      $scope.form.submitted = true;
                    })
                  });

                });

              });
            });
          }
        );
      }

      $scope.blueprints = [];

      $scope.getBlueprintFromDefinition = function(definition) {
        return _.find($scope.blueprints, function(blueprint) {
          return blueprint.definition_id == definition.id;
        });
      };

      $scope.isSet = function(definition) {
        return !!$scope.getBlueprintFromDefinition(definition);
      };

      $scope.toggle = function(definition) {
        var blueprint = $scope.getBlueprintFromDefinition(definition);
        if (blueprint) {
          $scope.blueprints.splice($scope.blueprints.indexOf(blueprint), 1);
        } else {
          $scope.blueprints.push({
            definition_id: definition.id,
            position: 1,
            is_required: true
          });
        }
      };

    }]);
