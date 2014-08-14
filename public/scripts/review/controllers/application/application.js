'use strict';

module.exports = angular.module('Review')
  .controller('ApplicationCtrl', ['$scope', '$routeParams', 'ApplyanceAPI', 'Store', '$filter', '$sce', 'citizen_data',
    function ($scope, $routeParams, ApplyanceAPI, Store, $filter, $sce, citizen_data) {

      $scope.activeEntity = Store.getActiveEntity();
      $scope.citizen = citizen_data.citizen;
      $scope.ratings = $scope.citizen.ratings;
      $scope.profile = citizen_data.profile;
      $scope.application = citizen_data.application;
      $scope.sidebar = {
        collapsed: false
      };

      if ($scope.activeEntity.parent == null) {
        $scope.citizen.labels = _.reject($scope.citizen.labels, function(label) {
          return label.entity_id != $scope.activeEntity.id;
        });
      }

      $scope.getEntityFromApplicationSpot = function(application, spot) {
        return _.findWhere(application.entities, { id: spot.entity_id });
      };

      $scope.getApplyable = function() {
        var applyableStr = "";

        var spots = [],
            entities = [];

        _.each($scope.citizen.applications, function(application) {
          spots = spots.concat(application.spots);
          entities = entities.concat(application.entities);
        });

        var spotEntityIds = [];
        if (spots.length > 0) {
          spotEntityIds = _.pluck(spots, 'entity_id');
          var spotStrs = [],
              spotsGrouped = _.groupBy(spots, 'entity_id');
          _.each(spotsGrouped, function(spots, entity_id, list) {
            var entity = _.findWhere(entities, { id: parseInt(entity_id) });
            spotStrs.push(_.pluck(spots, 'name').join(", ") + " at " + entity.name);
          });
          applyableStr += spotStrs.join(", and ")
        }

        var entitiesToInclude = _.filter(entities, function(entity) {
          return !_.contains(spotEntityIds, entity.id);
        });
        if (entitiesToInclude.length > 0) {
          applyableStr += ((spots.length > 0) ? ", and " : "") + _.pluck(entitiesToInclude, 'name').join(", ");
        }

        return applyableStr;
      };

      $scope.getAvatarUrl = function() {
        if (!$scope.citizen) {
          return;
        }

        if ($scope.citizen.account.avatar) {
          return $scope.citizen.account.avatar.url;
        }
        var gravatarEmail = CryptoJS.MD5($scope.citizen.account.email);
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
          ApplyanceAPI.postRating($scope.citizen.id, {
            application_id: $scope.application.id,
            rating: targetRating.value
          }).then(function(rating) {
            $scope.ratings.push(rating);
            $scope.$broadcast('ratingChange')
          });
        }
      };

      $scope.renderDetail = function(detail) {
        return $sce.trustAsHtml($filter('nl2p')(detail));
      };

      $scope.renderAddress = function(address) {
        return $sce.trustAsHtml($filter('friendlyAddress')(address));
      };

      $scope.getMeRating = function() {
        return _.find($scope.ratings, function(rating) {
          return rating.account.id == Store.getAccount().id;
        });
      };

      var meRating = $scope.getMeRating();
      if (meRating) {
        $scope._setRatingOption(meRating.rating);
      }

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

      $scope.$broadcast('ratingChange');

    }]);
