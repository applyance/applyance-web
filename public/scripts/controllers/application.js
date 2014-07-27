'use strict';

angular.module('ApplyanceApp')
  .controller('ApplicationCtrl', function ($scope, $routeParams, ApplyanceAPI) {
    ApplyanceAPI.getApplication($routeParams['applicationId']).then(function(application) {
       $scope.application = application;
    });
  });
