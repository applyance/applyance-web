'use strict';

module.exports = angular.module('Apply')
  .controller('FormCtrl', ['$scope', '$http', 'entity', 'ApplyanceAPI', '$timeout',
    function ($scope, $http, entity, ApplyanceAPI, $timeout) {

      $scope.entity = entity;
      $scope.counts = {
        locations: 0,
        spots: 0
      };
      $scope.form = {
        state: "begin",
        sequence: 0
      };

      $scope.selectedLocations = [];
      $scope.selectedSpots = [];
      $scope.blueprints = [];

      // Propagate events from the sibling to the children

      $scope.transferEvent = function(evt, object) {
        var newEvtName = evt.name.substring(evt.name.indexOf('.') + 1);
        $scope.$broadcast(newEvtName, object);
      };

      $scope.$on('emit.location.added', $scope.transferEvent);
      $scope.$on('emit.location.removed', $scope.transferEvent);
      $scope.$on('emit.spot.added', $scope.transferEvent);
      $scope.$on('emit.spot.removed', $scope.transferEvent);

      //
      // Handle the submission
      // This posts the application to the server
      //

      $scope.begin = function() {
        $scope.form.state = "locations.select";
        $scope.form.sequence = 1;
      };
      $scope.begin();

      $scope.submit = function() {
        alert('submitting');
      };

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

        if ($scope.selectedLocations.length > 0) {
          application.entity_ids = _.pluck($scope.selectedLocations, 'id');
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

    }
  ]);
