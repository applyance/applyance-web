'use strict';

angular.module('ApplyanceApp')
  .controller('ApplicationsCtrl', function ($scope, ApplyanceAPI) {




    ApplyanceAPI.getApplications().then(function(applications) {
       $scope.applications = applications;
    });






  });
