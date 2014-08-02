'use strict';

module.exports = angular.module('Review')
  .controller('ApplicationsCtrl', ['$scope', 'ApplyanceAPI', 'Me', 'Context',
    function ($scope, ApplyanceAPI, Me, Context) {

      $scope.entity = Me.getEntity(Context.getId());

      ApplyanceAPI.getApplications(Context.getGroup(), Context.getId()).then(function(applications) {
         $scope.applications = applications;
      });

      $scope.getAvatarUrl = function(application) {
        if (application.applicant.account.avatar) {
          return application.applicant.account.avatar.url;
        }
        return 'https://www.gravatar.com/avatar/' + CryptoJS.MD5(application.applicant.account.email);
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
      }

    }]);
