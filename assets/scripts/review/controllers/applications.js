'use strict';

module.exports = angular.module('Review')
  .controller('ApplicationsCtrl', ['$scope', '$http', 'ApplyanceAPI', 'Store',
    function ($scope, $http, ApplyanceAPI, Store) {

      ApplyanceAPI.getCitizens(Store.getActiveEntityId()).then(function(citizens) {
         $scope.citizens = citizens;
         _.each($scope.citizens, $scope.getAvatarUrl);
      });

      $scope.activeEntity = Store.getActiveEntity();

      $scope.getLabels = function(citizen) {
        if ($scope.activeEntity.parent) {
          return citizen.labels;
        }
        return _.reject(citizen.labels, function(label) {
          return label.entity_id != $scope.activeEntity.id;
        });
      };

      $scope.getAvatarUrl = function(citizen) {
        citizen.avatarUrl = -1;
        if (citizen.account.avatar) {
          citizen.avatarUrl = citizen.account.avatar.url;
          return;
        }

        var gravatarUrl = 'https://www.gravatar.com/avatar/' + CryptoJS.MD5(citizen.account.email) + '?d=404';
        $http.get(gravatarUrl, {
            responseType: 'arraybuffer'
          })
          .success(function(data, status, headers, config) {
            var arr = new Uint8Array(data),
                raw = String.fromCharCode.apply(null, arr),
                b64 = btoa(raw),
                dataUrl = "data:image/jpeg;base64," + b64;
            citizen.avatarUrl = dataUrl;
          });
        return;
      };

      $scope.getRating = function(citizen) {
        var cumulative = 0.0;
        _.each(citizen.ratings, function(rating) {
          cumulative += rating.rating;
        });
        cumulative = cumulative / citizen.ratings.length;
        return cumulative;
      };

      $scope.isRatingSet = function(i, citizen) {
        return (i <= Math.round($scope.getRating(citizen)));
      };

    }]);
