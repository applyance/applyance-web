'use strict';

angular.module('ApplyanceApp')
  .controller('RootCtrl', function ($scope, ApplyanceAPI, $location) {

    ApplyanceAPI.setApiHost(apiHost);
    ApplyanceAPI.setApiKey(apiKey);

    $scope.isActive = function(route) {
      return route === $location.path();
    }

    ApplyanceAPI.getMe().then(function(me) {
       $scope.me = me.data;//
       $scope.entity = $scope.me.admins[0].entity;
       $scope.getEverything();
    });

    $scope.spots = [];
    $scope.getEverything = function() {

      ApplyanceAPI.getUnits($scope.me.admins[0].entity.id).then( function(units) {
        angular.forEach(units, function(unit, index) {
          ApplyanceAPI.getSpots(unit.id).then( function(spots) {
            angular.forEach(spots, function(spot, index) {
              $scope.spots.push(spot);
            });
            $scope.getApplications();
          },
          function(response) {
            console.log("failed to get spots: " + response);
          });
        });
      },
      function(response) {
        console.log("failed to get units: " + response);
      });
    };

    $scope.applications = [];
    $scope.getApplications = function() {
      angular.forEach($scope.spots, function(spot, index) {
        ApplyanceAPI.getApplications(spot.id).then(function(applications) {
          angular.forEach(applications, function(application, index) {
            $scope.applications.push(application);
          });
        });
      });
    };

  });
