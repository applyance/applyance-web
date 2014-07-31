'use strict';

angular.module('ApplyanceApp')
  .controller('EntityReviewersCtrl', ['$scope', 'ApplyanceAPI', 'Me', 'Context',
    function ($scope, ApplyanceAPI, Me, Context) {

      $scope.entity = Me.getEntity(Context.getId());

      $scope.reviewers = [];
      ApplyanceAPI.getReviewers($scope.entity.id).then(function(reviewers) {
         $scope.reviewers = reviewers;
      });

      $scope.isRevokable = function(reviewer) {
        return reviewer.account.id != Me.getMe().account.id;
      };

      $scope.revokeAccess = function(reviewer) {
        if ($scope.isRevokable(reviewer)) {
          ApplyanceAPI.deleteReviewer(reviewer.id);
        }
      };

    }]);
