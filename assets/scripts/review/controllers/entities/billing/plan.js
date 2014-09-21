'use strict';

module.exports = angular.module('Review')
  .controller('EntityBillingPlanCtrl', ['$scope', '$rootScope', '$location', 'flash', 'ApplyanceAPI', 'Store',
    function ($scope, $rootScope, $location, flash, ApplyanceAPI, Store) {

      $scope.flash = flash;
      $scope.form = {
        saving: false
      };

      $scope.switchPlan = function(stripe_id) {
        if ($scope.isCurrentPlan(stripe_id)) {
          return;
        }
        $scope.form.saving = true;
        if ((stripe_id != 'free') && !$scope.customer.last4) {
          $scope.flash.setMessage('You must first enter in your credit card information to enroll in that plan.');
          $location.path('entities/' + $scope.activeEntity.id + '/billing/card').search('plan', stripe_id);
        } else {
          ApplyanceAPI.putEntityCustomer({
            id: $scope.customer.id,
            plan: stripe_id
          }).then(function(entityCustomer) {
            $scope.customer = entityCustomer.data;
            $rootScope.$broadcast('planChange');
          });
        }
      };

      $scope.isCurrentPlan = function(stripe_id) {
        if (!$scope.customer) {
          return false;
        }
        return stripe_id == $scope.customer.plan.stripe_id;
      };

      $scope.getActionLabel = function(stripe_id) {
        if ($scope.isCurrentPlan(stripe_id)) {
          return 'Current Plan'
        }
        if ($scope.form.saving) {
          return (stripe_id == 'free') ? 'Downgrading' : 'Upgrading';
        }
        return (stripe_id == 'free') ? 'Downgrade' : 'Upgrade';
      };

    }
  ]
);
