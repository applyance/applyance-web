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
          $scope.blueprints = blueprints.plain().concat($scope.blueprints);
        });
      }

      $scope.childEntities = [];
      $scope.selectedChildEntities = [];
      ApplyanceAPI.getEntities($scope.entity.id).then(function(entities) {
        $scope.childEntities = entities.plain();
      });

      $scope.toggleSelectedChildEntity = function(childEntity) {
        var selectedChildEntity = _.findWhere($scope.selectedChildEntities, { id: childEntity.id });
        if (selectedChildEntity) {
          $scope.selectedChildEntities.splice($scope.selectedChildEntities.indexOf(selectedChildEntity), 1);
          $scope.blueprints = _.reject($scope.blueprints, function(blueprint) {
            return blueprint.entity && (blueprint.entity.id == selectedChildEntity.id);
          });
        } else {
          $scope.selectedChildEntities.push(childEntity);
          ApplyanceAPI.getBlueprints(childEntity.id).then(function(blueprints) {
            blueprints = $scope.mapDatumsToBlueprints(blueprints.plain());
            $scope.blueprints = $scope.blueprints.concat(blueprints);
          });
        }
      };

      $scope.isChildEntitySelected = function(childEntity) {
        return _.contains($scope.selectedChildEntities, childEntity);
      };

      $scope.spots = [];
      $scope.selectedSpots = [];
      ApplyanceAPI.getSpots($scope.entity.id).then(function(spots) {
        $scope.spots = spots.plain();
      });

      $scope.toggleSelectedSpot = function(spot) {
        var selectedSpot = _.findWhere($scope.selectedSpots, { id: spot.id });
        if (selectedSpot) {
          $scope.selectedSpots.splice($scope.selectedSpots.indexOf(selectedSpot), 1);
          $scope.blueprints = _.reject($scope.blueprints, function(blueprint) {
            return blueprint.spot && (blueprint.spot.id == selectedSpot.id);
          });
        } else {
          $scope.selectedSpots.push(spot);
          ApplyanceAPI.getSpotBlueprints(spot.id).then(function(blueprints) {
            blueprints = $scope.mapDatumsToBlueprints(blueprints.plain());
            $scope.blueprints = $scope.blueprints.concat(blueprints);
          });
        }
      };

      $scope.isSpotSelected = function(spot) {
        return _.contains($scope.selectedSpots, spot);
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
        $scope.step = 'email';
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

      $scope.onAuthenticateSuccess = function(me) {
        if (me.citizens.length > 0) {
          $scope.mapMeToApplicant(me);
          ApplyanceAPI.getProfile(me.account.id).then($scope.onProfileLoad);
        } else {
          $scope.passwordNotFound();
        }
      };

      $scope.onProfileLoad = function(profile) {
        $scope.mapProfileToApplicant(profile);
        ApplyanceAPI.getDatums(profile.id).then($scope.onDatumsLoad);
      };

      $scope.mapMeToApplicant = function(me) {
        $scope.applicant.name = me.account.name;
      };

      $scope.mapProfileToApplicant = function(profile) {
        if (profile.phone_number) {
          $scope.applicant.phone_number = profile.phone_number;
        }
        if (profile.location) {
          var a = profile.location.address;
          $scope.applicant.location.address =
            a.address_1 + "\n" + a.city + ", " + a.state + " " + a.postal_code;
        }
      };

      $scope.onDatumsLoad = function(datums) {
        $scope.datums = datums.plain();
        $scope.mapDatumsToBlueprints($scope.blueprints);
        $scope.passwordNote = 'found';
        $scope.step = 'blueprints';
        $scope.checkForReadyToSubmit();
      }

      $scope.mapDatumsToBlueprints = function(blueprints) {
        _.each(blueprints, function(blueprint) {
          if (blueprint.definition.is_contextual) {
            return;
          }
          var thisDatum = _.find($scope.datums, function(datum) {
            return datum.definition.id == blueprint.definition.id;
          });
          if (thisDatum) {
            blueprint.detail = thisDatum.detail;
          }
        });
        return blueprints;
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
            if ((!blueprint.detail || (blueprint.detail.value.length == 0))
                && (!blueprint.attachments || (blueprint.attachments.length == 0))) {
              isComplete = false;
            }
          });
          $scope.readyToSubmit = isComplete;
        }
      }

      $scope.onSubmit = function() {
        var fields = [];
        _.each($scope.blueprints, function(blueprint) {
          if (!blueprint.detail && !blueprint.attachments) {
            return;
          }
          var field = {
            datum: {
              definition_id: blueprint.definition.id,
              detail: blueprint.detail
            }
          };
          if (blueprint.attachments && (blueprint.attachments.length > 0)) {
            field.datum.attachments = blueprint.attachments;
          }
          fields.push(field);
        });

        var application = {
          applicant: $scope.applicant,
          fields: fields
        };

        if ($scope.selectedChildEntities.length > 0) {
          application.entity_ids = _.pluck($scope.selectedChildEntities, 'id');
        } else {
          application.entity_ids = [];
          application.entity_ids.push($scope.entity.id);
        }

        if ($scope.selectedSpots.length > 0) {
          application.spot_ids = _.pluck($scope.selectedSpots, 'id');
        }

        $scope.submitting = true;
        ApplyanceAPI.postApplication(application).then(function(application) {
          $scope.submitting = false;
          $scope.submitted = true;
        });

      }

    }]);
