'use strict';

module.exports = angular.module('Review')
  .controller('EntityBillingCardCtrl', ['$scope', '$rootScope', '$timeout', '$route', '$location', '$routeParams', 'ApplyanceAPI', 'Store',
    function ($scope, $rootScope, $timeout, $route, $location, $routeParams, ApplyanceAPI, Store) {

      $scope.plan = null;
      if ($routeParams.plan) {
        $scope.plan = $routeParams.plan;
      }

      $scope.form = {
        updating: false,
        new: ($scope.customer && $scope.customer.last4 == null)
      };

      $scope.updateBilling = function(status, response) {
        if (response.error) {
          // there was an error. Fix it.
          alert(response.error.message);
          $scope.form.updating = false;
        } else {
          // got stripe token, now charge it or smt
          var token = response.id;
          var hash = {
            id: $scope.customer.id,
            stripe_token: token
          };
          if ($scope.plan) {
            hash.plan = $scope.plan;
          }
          ApplyanceAPI.putEntityCustomer(hash).then(function(entityCustomer) {
            $scope.customer = entityCustomer.data;
            if ($scope.plan) {
              $location.path('entities/' + $scope.activeEntity.id + '/billing');
              $timeout(function() {
                $rootScope.$broadcast('planChange');
              }, 250);
            } else {
              $scope.resetState();
            }
          });
        }
      };

      $scope.resetState = function() {
        $scope.form.new = false;
        $scope.form.updating = false;
        $scope.plan = null;
        $route.reload();
      };

    }
  ]
);
