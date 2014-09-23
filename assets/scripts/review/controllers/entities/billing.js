'use strict';

module.exports = angular.module('Review')
  .controller('EntityBillingCtrl', ['$scope', '$route', '$location', 'ApplyanceAPI', 'Store',
    function ($scope, $route, $location, ApplyanceAPI, Store) {

      if (Store.getActiveEntity().parent) {
        $location.path("/entities/" + Store.getActiveEntityId() + "/settings");
      }

      $scope.billingSection = $location.path().split('/')[4] || "main";
      $scope.activeEntity = Store.getActiveEntity();

      $scope.customer = null;
      ApplyanceAPI.getCustomerForEntity($scope.activeEntity.id).then(function(entityCustomer) {
        $scope.customer = entityCustomer.plain();
        $scope.customer.invoices = _.reject($scope.customer.invoices, function(invoice) {
          return (parseInt(invoice.amount_due) == 0) || !invoice.is_paid;
        });
        _.each($scope.customer.invoices, function(invoice) {
          invoice.status = $scope.getInvoiceStatus(invoice);
        });
      });

      $scope.getInvoiceStatus = function(invoice) {
        if (invoice.is_paid) {
          return "Paid";
        }
        if (invoice.is_forgiven) {
          return "Forgiven";
        }
        if (invoice.is_closed) {
          return "Closed";
        }
        if (invoice.is_attempted) {
          return "Not Paid";
        }
        return "Pending";
      };

    }
  ]
);
