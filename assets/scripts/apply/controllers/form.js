'use strict';

module.exports = angular.module('Apply')
  .controller('FormCtrl', ['$scope', 'entity', 'ApplyanceAPI', '$timeout',
    function ($scope, entity, ApplyanceAPI, $timeout) {

      $scope.entity = entity;
      $scope.counts = {
        locations: -1,
        spots: -1
      };
      $scope.form = {
        state: "begin",
        sequence: 0,
        valid: false,
        progress: 0,
        submitting: false,
        submitted: false
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

      //
      // Handle if the form is valid
      //

      $scope.$watch('blueprints', function() {
        var validBlueprints = _.filter($scope.blueprints, function(blueprint) {
          return blueprint._valid;
        });
        $scope.form.progress = Math.round((validBlueprints.length / $scope.blueprints.length) * 100);
        $scope.form.valid = validBlueprints.length == $scope.blueprints.length;
      }, true);

      //
      // Application Submission
      //

      $scope.submit = function() {
        if (!$scope.form.valid) {
          return;
        }

        var accountMappings = {
          name: _.find($scope.blueprints, function(blueprint) {
            return blueprint.definition.helper.account_mapping == "name";
          }),
          email: _.find($scope.blueprints, function(blueprint) {
            return blueprint.definition.helper.account_mapping == "email";
          })
        };

        //
        // Fields
        // Remove the account fields and get the raw datum values from the blueprints.
        //

        var fields = _.compact(
          _.map(
            _.reject($scope.blueprints, function(blueprint) {
              return _.contains([accountMappings.name.id, accountMappings.email.id], blueprint.id);
            }),
            function(blueprint) {
              return blueprint.field();
            }
          )
        );

        var application = {
          account: {
            name: accountMappings.name.datum.detail.entries[0].first + " " + accountMappings.name.datum.detail.entries[0].last,
            email: accountMappings.email.datum.detail.entries[0].value
          },
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

        $scope.form.submitting = true;
        ApplyanceAPI.postApplication(application).then(function(application) {
          $scope.form.submitting = false;
          $scope.form.submitted = true;
        });
      };

    }
  ]);
