'use strict';

angular.module('Review')
  .controller('ApplicationsCtrl', ['$scope', 'ApplyanceAPI', 'Context',
    function ($scope, ApplyanceAPI, Context) {

      $scope.applications = [];
      ApplyanceAPI.getApplications(Context.getGroup(), Context.getId()).then(function(applications) {
         $scope.applications = applications;
      });

    }]);
