'use strict';

angular.module('ApplyanceApp')
  .controller('UnitReviewersCtrl', ['$scope', 'ApplyanceAPI', 'Me', 'Context',
    function ($scope, ApplyanceAPI, Me, Context) {

      $scope.unit = Me.getUnit(Context.getId());

      $scope.reviewers = [];
      ApplyanceAPI.getReviewers($scope.unit.id).then(function(reviewers) {
         $scope.reviewers = reviewers;
      });

      $scope.isRevokable = function(reviewer) {
        return reviewer.access_level != "full";
      };

      $scope.revokeAccess = function(reviewer) {
        if ($scope.isRevokable(reviewer)) {
          ApplyanceAPI.deleteReviewer(reviewer.id);
        }
      };

    }]);
