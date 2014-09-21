'use strict';

module.exports = angular.module('Review')
  .controller('EntityBillingMainCtrl', ['$scope', 'ApplyanceAPI', 'Store',
    function ($scope, ApplyanceAPI, Store) {

      $scope.isTrial = function() {
        if (!$scope.customer) {
          return false;
        }
        return $scope.customer.subscription_status == "trialing";
      };

    }
  ]
);
