'use strict';

angular.module('ApplyanceApp')
  .controller('ApplicationsCtrl', function ($scope, $routeParams, ApplyanceAPI) {
    $scope.applications = [];
    // ApplyanceAPI.getApplications($routeParams['parent'], parseInt($routeParams['id'])).then(function(applications) {
    //    $scope.applications = applications;
    // });
  });
