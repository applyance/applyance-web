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
        $timeout(function() {
          $scope.form.submitted = true;
        },1500);
        return;

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

                // Mass create blueprints

                $http.post('/accounts/login/headless', {
                  email: $scope.form.reviewer.email,
                  password: $scope.form.reviewer.password
                }).then(function() {
                  $scope.form.submitted = true;
                })
              });
            });
          }
        );
      }

      $scope.blueprints = [];

      $scope.getBlueprintFromDefinition = function(definition) {
        return _.find($scope.blueprints, function(blueprint) {
          return blueprint.definition.id == definition.id;
        });
      };

      $scope.isSet = function(definition) {
        return !!$scope.getBlueprintFromDefinition(definition);
      };

      $scope.toggle = function(definition) {
        var blueprint = $scope.getBlueprintFromDefinition(definition);
        if (blueprint) {
          ApplyanceAPI.deleteBlueprint(blueprint.id).then(function() {
            $scope.blueprints.splice($scope.blueprints.indexOf(blueprint), 1);
          });
        } else {
          ApplyanceAPI.postBlueprint($scope.entity.id, {
            definition_id: definition.id,
            position: 1,
            is_required: true
          }).then(function(blueprint) {
            $scope.blueprints.push(blueprint);
          });
        }
      };

    }]);
