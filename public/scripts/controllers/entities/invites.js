'use strict';

angular.module('ApplyanceApp')
  .controller('EntityInvitesCtrl', ['$scope', 'ApplyanceAPI', 'Me', 'Context',
    function ($scope, ApplyanceAPI, Me, Context) {

      $scope.entity = Me.getEntity(Context.getId());

      $scope.invites = [];
      ApplyanceAPI.getAdminInvites($scope.entity.id).then(function(invites) {
         $scope.invites = invites;
      });

      $scope.newInvite = {};

      $scope.isInviteClaimed = function(invite) {
        return invite.status == "claimed";
      };

      $scope.inviting = false;

      $scope.inviteAdmin = function() {
        $scope.inviting = true;
      };

      $scope.commitInvite = function() {
        ApplyanceAPI.postAdminInvite($scope.entity.id, {
          email: $scope.newInvite.email,
          access_level: "limited"
        }).then(function(invite) {
          $scope.invites.push(invite);
          $scope.inviting = false;
          $scope.newInvite = {};
        });
      };

    }]);
