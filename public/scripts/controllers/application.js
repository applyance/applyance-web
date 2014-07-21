'use strict';

angular.module('ApplyanceApp')
  .controller('ApplicationCtrl', function ($scope, ApplyanceAPI) {


    ApplyanceAPI.getApplication(1).then(function(application) {
       $scope.application = application;
    });


  });
