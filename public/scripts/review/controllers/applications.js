'use strict';

module.exports = angular.module('Review')
  .controller('ApplicationsCtrl', ['$scope', 'ApplyanceAPI', 'Context',
    function ($scope, ApplyanceAPI, Context) {

      ApplyanceAPI.getApplications(Context.getGroup(), Context.getId()).then(function(applications) {
         $scope.applications = applications;
      });

    }]);
