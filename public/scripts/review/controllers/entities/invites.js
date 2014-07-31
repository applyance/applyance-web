'use strict';

angular.module('ApplyanceApp')
  .controller('EntityInvitesCtrl', ['$scope', 'ApplyanceAPI', 'Me', 'Context',
    function ($scope, ApplyanceAPI, Me, Context) {

      $scope.scopes = [{name: "admin"}, {name: "limited"}];
      $scope.selectedScope =  $scope.scopes[1];

      $scope.entity = Me.getEntity(Context.getId());

      $scope.invites = [];
      ApplyanceAPI.getReviewerInvites($scope.entity.id).then(function(invites) {
         $scope.invites = invites;
      });

      $scope.newInvite = {};

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
