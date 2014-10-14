'use strict';

module.exports = angular.module('Review')
  .controller('ApplicationProfileCtrl', ['$scope', '$filter', '$http',
    function ($scope, $filter, $http) {
      $scope.isLegacyField = function(field) {
        return moment(field.datum.created_at, 'YYYY-MM-DD HH:mm:ss Z').isBefore('2014-10-13');
      }
    }
  ]);
