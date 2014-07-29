'use strict';

angular.module('ApplyanceApp')
  .controller('ApplicationCtrl', ['$scope', '$routeParams', 'ApplyanceAPI',
    function ($scope, $routeParams, ApplyanceAPI) {

      ApplyanceAPI.getApplication($routeParams['id']).then(function(application) {
        $scope.application = application;
      });

    }]);
