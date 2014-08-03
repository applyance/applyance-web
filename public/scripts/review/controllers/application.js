'use strict';

var CryptoJS = require("crypto-js");

module.exports = angular.module('Review')
  .controller('ApplicationCtrl', ['$scope', '$routeParams', 'ApplyanceAPI', 'Store', '$filter', '$sce',
    function ($scope, $routeParams, ApplyanceAPI, Store, $filter, $sce) {

      $scope.ratings = null;
      ApplyanceAPI.getApplication($routeParams['id']).then(function(application) {
        $scope.application = application.plain();
        $scope.ratings = $scope.application.ratings;
        var meRating = $scope.getMeRating();
        if (meRating) {
          $scope._setRatingOption(meRating.rating);
        }
        $scope.$broadcast('ratingChange');
      });

      $scope.cumulativeRating = 0.0;
      $scope.$on('ratingChange', function() {
        if ($scope.ratings.length == 0) {
          return;
        }

        $scope.cumulativeRating = 0.0;
        _.each($scope.ratings, function(rating) {
          $scope.cumulativeRating += rating.rating;
        });
        $scope.cumulativeRating = $scope.cumulativeRating / $scope.ratings.length;
        $scope.cumulativeRating = Math.round($scope.cumulativeRating * 10) / 10;
      });

      $scope.getEntity = function() {
        if (!$scope.application) {
          return;
        }
        return $scope.application.entities[0];
      };

      $scope.getAvatarUrl = function() {
        if (!$scope.application) {
          return;
        }

        if ($scope.application.applicant.account.avatar) {
          return $scope.application.applicant.account.avatar.url;
        }
        var gravatarEmail = CryptoJS.MD5($scope.application.applicant.account.email);
        return 'https://www.gravatar.com/avatar/' + gravatarEmail + '?d=mm';
      };

      $scope.ratingOptions = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }];

      $scope.mouseoverRatingOption = function(targetRating) {
        _.each($scope.ratingOptions, function($rating) {
          if ($rating.value <= targetRating.value) {
            $rating.active = true;
          }
        });
      };

      $scope.mouseleaveRatingOption = function(targetRating) {
        _.each($scope.ratingOptions, function($rating) {
          $rating.active = false;
        });
      };

      $scope._setRatingOption = function(targetRating) {
        _.each($scope.ratingOptions, function($rating) {
          $rating.set = ($rating.value <= targetRating);
        });
      };

      $scope.setRatingOption = function(targetRating) {
        $scope._setRatingOption(targetRating.value);

        // Send rating to server
        var meRating = $scope.getMeRating();
        if (meRating) {
          meRating.rating = targetRating.value;
          ApplyanceAPI.putRating({
            id: meRating.id,
            rating: meRating.rating
          });
          $scope.$broadcast('ratingChange')
        } else {
          ApplyanceAPI.postRating(Store.getAccount().id, {
            application_id: $scope.application.id,
            rating: targetRating.value
          }).then(function(rating) {
            $scope.ratings.push(rating);
            $scope.$broadcast('ratingChange')
          });
        }
      };

      $scope.getMeRating = function() {
        return _.find($scope.ratings, function(rating) {
          return rating.account.id == Store.getAccount().id;
        });
      };

      $scope.renderDetail = function(detail) {
        return $sce.trustAsHtml($filter('nl2p')(detail));
      };

      $scope.renderAddress = function(address) {
        return $sce.trustAsHtml($filter('friendlyAddress')(address));
      };

    }]);
