'use strict';

module.exports = angular.module('Apply')
  .controller('FormCtrl', ['$scope', '$http', 'entity', 'ApplyanceAPI',
    function ($scope, $http, entity, ApplyanceAPI) {

      $scope.entity = entity;

      $scope.applicant = {
        name: null,
        email: null,
        password: null,
        datums: []
      };

      $scope.blueprints = [];
      ApplyanceAPI.getBlueprints($scope.entity.id).then(function(blueprints) {
        $scope.blueprints = blueprints.plain();
      });

      $scope.promptPassword = false;
      $scope.promptName = false;

      $scope.checkEmail = function() {
        if (!$scope.applicant.email) {
          return;
        }
        ApplyanceAPI.checkForEmail($scope.applicant.email).success(function() {
          $scope.promptPassword = true;
          $scope.promptName = false;
        }).error(function() {
          $scope.promptName = true;
          $scope.promptPassword = false;
        });
      };

      $scope.authenticate = function() {
        var that = this;
        ApplyanceAPI.authenticate({
          email: $scope.applicant.email,
          password: $scope.applicant.password
        }).success(function(me, status, headers, config) {
          if (me.applicant) {
            $scope.applicant.name = me.account.name;
            var api_key = headers('authorization').split('auth=')[1];
            $http.get(ApplyanceAPI.getApiHost() + "/applicants/" + me.applicant.id + "/datums", {
              headers: { 'Authorization': 'ApplyanceLogin auth=' + api_key }
            }).then(function(datums) {
              _.each($scope.blueprints, function(blueprint) {
                var thisDatum = _.find(datums.data, function(datum) {
                  return datum.definition.id == blueprint.definition.id;
                });
                if (thisDatum) {
                  blueprint.detail = thisDatum.detail;
                }
              });
            });
          }
        });
      };

      $scope.onSubmit = function() {
        // Create fields
        var fields = [];
        _.each($scope.blueprints, function(blueprint) {
          if (!blueprint.detail) {
            return;
          }
          fields.push({
            datum: {
              definition_id: blueprint.definition.id,
              detail: blueprint.detail
            }
          });
        });

        var entity_ids = [];
        entity_ids.push($scope.entity.id);

        var application = {
          applicant: $scope.applicant,
          entity_ids: entity_ids,
          fields: fields
        };

        ApplyanceAPI.postApplication(application).then(function(application) {
          console.dir(application);
        });

      }

    }]);
