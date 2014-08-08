'use strict';

module.exports = angular.module('Apply')
  .controller('FormCtrl', ['$scope', '$http', 'entity', 'ApplyanceAPI', '$timeout',
    function ($scope, $http, entity, ApplyanceAPI, $timeout) {

      $scope.entity = entity;

      $scope.applicant = {
        name: "",
        email: "",
        password: "",
        phone_number: "",
        location: {
          address: ""
        },
        datums: []
      };

      $scope.blueprints = [];
      ApplyanceAPI.getBlueprints($scope.entity.id).then(function(blueprints) {
        $scope.blueprints = $scope.blueprints.concat(blueprints.plain());
      });

      if ($scope.entity.parent) {
        ApplyanceAPI.getBlueprints($scope.entity.parent.id).then(function(blueprints) {
          $scope.blueprints = $scope.blueprints.concat(blueprints.plain());
        });
      }

      $scope.childEntities = [];
      $scope.selectedChildEntities = [];
      ApplyanceAPI.getEntities($scope.entity.id).then(function(entities) {
        $scope.childEntities = entities.plain();
      });

      $scope.toggleSelectedChildEntities = function(childEntity) {
        var selectedChildEntity = _.findWhere($scope.selectedChildEntities, { id: childEntity.id });
        if (selectedChildEntity) {
          $scope.selectedChildEntities.splice($scope.selectedChildEntities.indexOf(selectedChildEntity), 1);
        } else {
          $scope.selectedChildEntities.push(childEntity);
        }
      };

      $scope.isChildEntitySelected = function(childEntity) {
        return _.contains($scope.selectedChildEntities, childEntity);
      };

      $scope.$watch('blueprints', function() {
        $scope.checkForReadyToSubmit();
      }, true);

      $scope.$watch('applicant', function() {
        $scope.checkForReadyToSubmit();
      }, true);

      $scope.submitting = false;
      $scope.submitted = false;

      $scope.resetEmail = function() {
        $scope.emailNote = 'check';
        $scope.passwordNote = 'check';
        $scope.step = 'blueprints';
        $scope.showPassword = false;
        $scope.readyToSubmit = false;
      }
      $scope.resetEmail();

      $scope.checkEmail = function() {
        if (!$scope.applicant.email) {
          $scope.resetEmail();
          return;
        }
        $scope.emailNote = 'loading';
        ApplyanceAPI
          .checkForEmail($scope.applicant.email)
          .success($scope.emailFound)
          .error($scope.emailNotFound);
      };

      $scope.emailFound = function() {
        $scope.step = 'password';
        $scope.emailNote = 'found';
        $scope.showPassword = true;
      };

      $scope.emailNotFound = function() {
        $scope.step = 'blueprints';
        $scope.checkForReadyToSubmit();
        $scope.emailNote = 'notFound';
        $scope.showPassword = false;
      };

      $scope.skipPassword = function() {
        $scope.step = 'blueprints';
        $scope.showPassword = false;
        $scope.checkForReadyToSubmit();
        $timeout(function() {
          $scope.$broadcast('nameFocus');
        });
      }

      $scope.authenticate = function() {
        if (!$scope.applicant.password) {
          $scope.step = 'password';
          $scope.passwordNote = 'check';
          return;
        }
        $scope.passwordNote = 'loading';

        ApplyanceAPI.authenticate({
            email: $scope.applicant.email,
            password: $scope.applicant.password
          })
          .success($scope.onAuthenticateSuccess)
          .error(function() {
            $scope.passwordNotFound();
          });
      };

      $scope.onAuthenticateSuccess = function(me, status, headers, config) {
        if (me.applicant) {
          $scope.mapMeToApplicant(me);
          var api_key = headers('authorization').split('auth=')[1];
          $http.get(ApplyanceAPI.getApiHost() + "/applicants/" + $scope.applicant.id + "/datums", {
            headers: { 'Authorization': 'ApplyanceLogin auth=' + api_key }
          }).then($scope.onDatumsLoad);
        } else {
          $scope.passwordNotFound();
        }
      };

      $scope.mapMeToApplicant = function(me) {
        $scope.applicant.id = me.applicant.id;
        $scope.applicant.name = me.account.name;
        if (me.applicant.phone_number) {
          $scope.applicant.phone_number = me.applicant.phone_number;
        }
        if (me.applicant.location) {
          var a = me.applicant.location.address;
          $scope.applicant.location.address =
            a.address_1 + "\n" + a.city + ", " + a.state + " " + a.postal_code;
        }
      }

      $scope.onDatumsLoad = function(datums) {
        _.each($scope.blueprints, function(blueprint) {
          if (blueprint.definition.is_contextual) {
            return;
          }
          var thisDatum = _.find(datums.data, function(datum) {
            return datum.definition.id == blueprint.definition.id;
          });
          if (thisDatum) {
            blueprint.detail = thisDatum.detail;
          }
        });
        $scope.passwordNote = 'found';
        $scope.step = 'blueprints';
        $scope.checkForReadyToSubmit();
      }

      $scope.passwordNotFound = function() {
        $scope.passwordNote = 'notFound';
        $scope.step = 'blueprints';
        $scope.checkForReadyToSubmit();
      }

      $scope.checkForReadyToSubmit = function() {
        $scope.readyToSubmit = true;
        if (
               ($scope.applicant.name.length == 0)
            || ($scope.applicant.phone_number.length == 0)
            || ($scope.applicant.location.address.length == 0)) {
          $scope.readyToSubmit = false;
          return;
        }
        if ($scope.blueprints.length > 0) {
          var isComplete = true;
          _.each($scope.blueprints, function(blueprint) {
            if (!blueprint.detail || (blueprint.detail.value.length == 0)) {
              isComplete = false;
            }
          });
          $scope.readyToSubmit = isComplete;
        }
      }

      $scope.onSubmit = function() {
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

        $scope.submitting = true;
        $timeout(function() {
          ApplyanceAPI.postApplication(application).then(function(application) {
            $scope.submitting = false;
            $scope.submitted = true;
          });
        }, 750);

      }

    }]);
