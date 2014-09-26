'use strict';

module.exports = angular.module('Apply')
  .controller('LocationsCtrl', ['$scope', '$sce', 'ApplyanceAPI',
    function ($scope, $sce, ApplyanceAPI) {

      $scope.locations = [];
      ApplyanceAPI.getEntities($scope.entity.id).then(function(locations) {
        $scope.locations = locations.plain();
        _.each($scope.locations, $scope.massageAddress);
        $scope.counts.locations = $scope.locations.length;
        if ($scope.locations.length == 0) {
          $scope.nextState();
        }
      });

      $scope.massageAddress = function(location) {
        location.address = null;
        if (location.location) {
          var a = location.location.address,
              la = "";
          if (a.address_1) {
            la = a.address_1 + "<br />";
          }
          la += a.city + ", " + a.state + " " + a.postal_code;
          location.address = $sce.trustAsHtml(la);
        }
      };

      $scope.removeSelectedLocation = function(location) {
        var index = $scope.selectedLocations.indexOf(location);
        if (index > -1) {
          $scope.selectedLocations.splice(index, 1);
        }
      };

      $scope.toggleLocation = function(location) {
        location.is_selected = !!!location.is_selected;
        if (location.is_selected) {
          $scope.selectedLocations.push(location);
        } else {
          $scope.removeSelectedLocation(location);
        }
        $scope.$emit('emit.location.' + (location.is_selected ? 'added' : 'removed'), location);
      };

      $scope.continue = function() {
        $scope.nextState();
      };

      $scope.nextState = function() {
        $scope.form.state = "spots.select";
        $scope.form.sequence = 2;
      };

      $scope.isDisabled = function() {
        return $scope.form.sequence < 1;
      };

    }
  ]);
