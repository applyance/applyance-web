'use strict';

module.exports = angular.module('Review')
  .controller('SpotApplicationsCtrl', ['$scope', '$routeParams', 'ApplyanceAPI', 'Store', 'spot_data',
    function ($scope, $routeParams, ApplyanceAPI, Store, spot_data) {

      $scope.activeEntity = Store.getActiveEntity();
      $scope.spot = spot_data.spot;
      $scope.citizens = spot_data.citizens;

      $scope.getLabels = function(citizen) {
        if ($scope.activeEntity.parent) {
          return citizen.labels;
        }
        return _.reject(citizen.labels, function(label) {
          return label.entity_id != $scope.activeEntity.id;
        });
      };

      $scope.getAvatarUrl = function(citizen) {
        if (citizen.account.avatar) {
          return citizen.account.avatar.url;
        }
        return 'https://www.gravatar.com/avatar/' + CryptoJS.MD5(citizen.account.email) + '?d=mm';
      };

      $scope.getRating = function(citizen) {
        var cumulative = 0.0;
        _.each(citizen.ratings, function(rating) {
          cumulative += rating.rating;
        });
        cumulative = cumulative / citizen.ratings.length;
        return Math.round(cumulative);
      };

      $scope.isRatingSet = function(i, citizen) {
        return (i <= $scope.getRating(citizen));
      };

    }
  ]
);
