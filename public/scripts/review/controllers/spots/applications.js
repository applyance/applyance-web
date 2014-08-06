'use strict';

module.exports = angular.module('Review')
  .controller('SpotApplicationsCtrl', ['$scope', '$routeParams', 'ApplyanceAPI', 'Store',
    function ($scope, $routeParams, ApplyanceAPI, Store) {

      $scope.activeEntity = Store.getActiveEntity();
      $scope.applications = [];
      ApplyanceAPI.getSpot($routeParams['id']).then(function(spot) {
        $scope.spot = spot;
        ApplyanceAPI.getSpotApplications(spot.id).then(function(applications) {
          $scope.applications = applications;
        });
      });

      $scope.getAvatarUrl = function(application) {
        if (application.applicant.account.avatar) {
          return application.applicant.account.avatar.url;
        }
        return 'https://www.gravatar.com/avatar/' + CryptoJS.MD5(application.applicant.account.email) + '?d=mm';
      };

      $scope.getRating = function(application) {
        var cumulative = 0.0;
        _.each(application.ratings, function(rating) {
          cumulative += rating.rating;
        });
        cumulative = cumulative / application.ratings.length;
        return Math.round(cumulative);
      };

      $scope.isRatingSet = function(i, application) {
        return (i <= $scope.getRating(application));
      };

    }
  ]
);
