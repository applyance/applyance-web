'use strict';

module.exports = angular.module('Review')
  .controller('EntityReviewersCtrl', ['$scope', 'ApplyanceAPI', 'Store',
    function ($scope, ApplyanceAPI, Store) {

      $scope.getActiveEntityName = function() {
        return Store.getActiveEntity().name;
      };

      $scope.reviewers = [];
      ApplyanceAPI.getReviewers(Store.getActiveEntityId()).then(function(reviewers) {
         $scope.reviewers = reviewers;
      });

      $scope.invites = [];
      ApplyanceAPI.getReviewerInvites(Store.getActiveEntityId()).then(function(invites) {
         $scope.invites = invites;
      });

      $scope.scopes = [{ scope: "admin", name: "Administrator" }, { scope: "limited", name: "Reviewer" }];
      $scope.selectedScope =  $scope.scopes[1];

      $scope.newInvite = {};

      $scope.isRevokable = function(reviewer) {
        return reviewer.account.id != Store.getAccount().id;
      };

      $scope.revokeAccess = function(reviewer) {
        if ($scope.isRevokable(reviewer)) {
          ApplyanceAPI.deleteReviewer(reviewer.id);
        }
      };

      $scope.isInviteClaimed = function(invite) {
        return invite.status == "claimed";
      };

      $scope.closeNewPrompt = function() {
        $scope.inviting = false;
      }

      $scope.inviting = false;

      $scope.inviteReviewer = function() {
        $scope.inviting = true;
      };

      $scope.commitInvite = function() {
        if ($scope.newInvite.email && $scope.selectedScope.name) {
          ApplyanceAPI.postReviewerInvite(Store.getActiveEntityId(), {
            email: $scope.newInvite.email,
            scope: $scope.selectedScope.scope
          }).then(function(invite) {
            $scope.invites.push(invite);
            $scope.inviting = false;
            $scope.newInvite = {};
          });
        }
      };

    }]);
