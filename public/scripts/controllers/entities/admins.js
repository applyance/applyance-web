'use strict';

angular.module('ApplyanceApp')
  .controller('EntityAdminsCtrl', ['$scope', 'ApplyanceAPI', 'Me', 'Context',
    function ($scope, ApplyanceAPI, Me, Context) {

      $scope.entity = Me.getEntity(Context.getId());

      $scope.admins = [];
      ApplyanceAPI.getAdmins($scope.entity.id).then(function(admins) {
         $scope.admins = admins;
      });

      $scope.isRevokable = function(admin) {
        return admin.access_level != "owner";
      }

      $scope.revokeAccess = function(admin) {
        if ($scope.isRevokable(admin)) {
          ApplyanceAPI.deleteAdmin(admin.id)
        }
      }

    }]);
