'use strict';

angular.module('ApplyanceApp')
  .controller('UnitInvitesCtrl', ['$scope', 'ApplyanceAPI', 'Me', 'Context',
    function ($scope, ApplyanceAPI, Me, Context) {

      $scope.accessLevels = [{name: "full"}, {name: "limited"}];
      $scope.selectedAccessLevel =  $scope.accessLevels[1];

      $scope.unit = Me.getUnit(Context.getId());

      $scope.invites = [];
      ApplyanceAPI.getReviewerInvites($scope.unit.id).then(function(invites) {
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
        if ($scope.newInvite.email && $scope.selectedAccessLevel.name) {
          ApplyanceAPI.postReviewerInvite($scope.unit.id, {
            email: $scope.newInvite.email,
            access_level: $scope.selectedAccessLevel.name
          }).then(function(invite) {
            $scope.invites.push(invite);
            $scope.inviting = false;
            $scope.newInvite = {};
          });
        }
      };

    }]);
