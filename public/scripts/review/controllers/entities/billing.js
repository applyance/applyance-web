'use strict';

module.exports = angular.module('Review')
  .controller('EntityBillingCtrl', ['$scope', 'ApplyanceAPI', '$timeout', 'Store',
    function ($scope, ApplyanceAPI, $timeout, Store) {

      $scope.activeEntity = Store.getActiveEntity();

      $scope.updateBilling = function(status, response) {
				if(response.error) {
					// there was an error. Fix it.
				} else {
					// got stripe token, now charge it or smt
					token = response.id
				}
			};

    }
  ]
);
