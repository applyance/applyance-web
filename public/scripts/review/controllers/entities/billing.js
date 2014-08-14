'use strict';

module.exports = angular.module('Review')
  .controller('EntityBillingCtrl', ['$scope', '$route', 'ApplyanceAPI', 'Store',
    function ($scope, $route, ApplyanceAPI, Store) {

      $scope.activeEntity = Store.getActiveEntity();
      $scope.form = {
        updating: false,
        change: false,
        new: false,
        customer: null
      };

      ApplyanceAPI.getCustomerForEntity($scope.activeEntity.id).then(function(entityCustomer) {
        $scope.form.new = _.isEmpty(entityCustomer.plain());
        $scope.form.customer = entityCustomer.plain();
      });

      $scope.updateBilling = function(status, response) {
				if (response.error) {
					// there was an error. Fix it.
				} else {
					// got stripe token, now charge it or smt
					var token = response.id;
          if ($scope.form.new) {
            ApplyanceAPI.postEntityCustomer($scope.activeEntity.id, {
              stripe_token: token
            }).then(function(entityCustomer) {
              $scope.form.customer = entityCustomer.plain();
              $scope.resetState();
            });
          } else {
            ApplyanceAPI.putEntityCustomer({
              id: $scope.form.customer.id,
              stripe_token: token
            }).then(function(entityCustomer) {
              $scope.form.customer = entityCustomer.data;
              $scope.resetState();
            });
          }
				}
			};

      $scope.resetState = function() {
        $scope.form.new = false;
        $scope.form.updating = false;
        $scope.form.change = false;
        $route.reload();
      };

    }
  ]
);
