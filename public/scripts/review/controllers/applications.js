'use strict';

angular.module('Review')
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

    }]);
