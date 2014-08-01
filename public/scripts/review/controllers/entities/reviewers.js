'use strict';

angular.module('Review')
  .controller('EntityReviewersCtrl', ['$scope', 'ApplyanceAPI', 'Me', 'Context',
    function ($scope, ApplyanceAPI, Me, Context) {

      ApplyanceAPI.getEntity(Context.getId()).then(function(entity) {
        $scope.entity = entity.plain();

        $scope.reviewers = [];
        ApplyanceAPI.getReviewers($scope.entity.id).then(function(reviewers) {
           $scope.reviewers = reviewers;
        });

        $scope.invites = [];
        ApplyanceAPI.getReviewerInvites($scope.entity.id).then(function(invites) {
           $scope.invites = invites;
        });
      });

      $scope.scopes = [{name: "admin"}, {name: "limited"}];
      $scope.selectedScope =  $scope.scopes[1];

      $scope.newInvite = {};

      $scope.isRevokable = function(reviewer) {
        return reviewer.account.id != Me.getMe().account.id;
      };

      $scope.revokeAccess = function(reviewer) {
        if ($scope.isRevokable(reviewer)) {
          ApplyanceAPI.deleteReviewer(reviewer.id);
        }
      };

      $scope.isInviteClaimed = function(invite) {
        return invite.status == "claimed";
      };

      $scope.inviting = false;

      $scope.inviteReviewer = function() {
        $scope.inviting = true;
      };

      $scope.commitInvite = function() {
        if ($scope.newInvite.email && $scope.selectedScope.name) {
          ApplyanceAPI.postReviewerInvite($scope.entity.id, {
            email: $scope.newInvite.email,
            scope: $scope.selectedScope.name
          }).then(function(invite) {
            $scope.invites.push(invite);
            $scope.inviting = false;
            $scope.newInvite = {};
          });
        }
      };

    }]);
