'use strict';

module.exports = angular.module('Review')
  .controller('EntityBillingCtrl', ['$scope', 'ApplyanceAPI', '$timeout', 'Store',
    function ($scope, ApplyanceAPI, $timeout, Store) {

      $scope.activeEntity = Store.getActiveEntity();

      $scope.updateBilling = function() {

      };

    }
  ]
);
