'use strict';

module.exports = angular.module('Review')
  .controller('ApplicationCtrl', ['$scope', '$routeParams', 'ApplyanceAPI', 'Store', '$filter', '$sce', 'citizen_data',
    function ($scope, $routeParams, ApplyanceAPI, Store, $filter, $sce, citizen_data) {

      if (!Store.hasActiveFeature('applicantView')) {
        $location.path($scope.getRootPath());
      }

      $scope.apiHost = ApplyanceAPI.getApiHost();
      $scope.apiKey = ApplyanceAPI.getApiKey();

      $scope.activeEntity = Store.getActiveEntity();
      $scope.citizen = citizen_data.citizen;
      $scope.ratings = $scope.citizen.ratings;
      $scope.profile = citizen_data.profile;
      $scope.application = citizen_data.application;
      $scope.fields = _.sortBy($scope.application.fields, function(field) {
        return field.datum.definition.default_position;
      });
      $scope.sidebar = {
        collapsed: false
      };

      if ($scope.activeEntity.parent == null) {
        $scope.citizen.labels = _.reject($scope.citizen.labels, function(label) {
          return label.entity_id != $scope.activeEntity.id;
        });
      }

      $scope.isAttachmentImage = function(attachment) {
        return (attachment.content_type.indexOf("image", 0) === 0);
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

        spots = _.uniq(spots, function(spot) {
          return spot.id;
        });
        entities = _.uniq(entities, function(entity) {
          return entity.id;
        });

        var spotEntityIds = [];
        if (spots.length > 0) {
          spotEntityIds = _.pluck(spots, 'entity_id');
          var spotStrs = [],
              spotsGrouped = _.groupBy(spots, 'entity_id');
          _.each(spotsGrouped, function(spots, entity_id, list) {
            var entity = _.findWhere(entities, { id: parseInt(entity_id) });
            var spotStr = _.pluck(spots, 'name').join(', ');
            if (entity.parent) {
              spotStr += " at " + entity.name;
            }
            spotStrs.push(spotStr);
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
        return 'https://www.gravatar.com/avatar/' + gravatarEmail + '?s=256&d=mm';
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
        if (detail.entries) {
          detail.value = _.map(detail.entries, function(entry) {
            return entry.value;
          });
          detail.value = detail.value.join(", ");
        } else {
          if (detail.value == true) {
            detail.value = "Yes";
          } else if (detail.value == false) {
            detail.value = "No";
          }
        }
        return $sce.trustAsHtml($filter('nl2p')(detail.value));
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

      $scope.entityLabels = [];

      ApplyanceAPI.getLabels($scope.activeEntity.id).then(function(labels) {
        // labels = _.reject(labels, function(label) {
        //   return _.contains(_.pluck($scope.citizen.labels, 'id'), label.id);
        // });
        $scope.entityLabels = $scope.entityLabels.concat(labels);
      });

      if ($scope.activeEntity.parent) {
        ApplyanceAPI.getLabels($scope.activeEntity.parent.id).then(function(labels) {
          // labels = _.reject(labels, function(label) {
          //   return _.contains(_.pluck($scope.citizen.labels, 'id'), label.id);
          // });
          labels = _.each(labels, function(label) { label.isParent = true; });
          $scope.entityLabels = $scope.entityLabels.concat(labels);
        });
      }

      $scope.dropdown = {
        open: false
      };

      $scope.toggleLabelOnCitizen = function(label) {
        var labelIds = _.pluck($scope.citizen.labels, 'id');
        if (_.contains(labelIds, label.id)) {
          labelIds = _.without(labelIds, label.id);
          $scope.citizen.labels = _.reject($scope.citizen.labels, function(srcLabel) {
            return srcLabel.id == label.id;
          });
          // $scope.entityLabels.push(label);
        } else {
          labelIds.push(label.id);
          $scope.citizen.labels.push(label);
          // $scope.entityLabels = _.reject($scope.entityLabels, function(srcLabel) {
          //   return srcLabel.id == label.id;
          // });
        }
        ApplyanceAPI.putCitizen($scope.citizen.id, { label_ids: labelIds });
      };

      $scope.isLabelOnCitizen = function(label) {
        return _.findWhere($scope.citizen.labels, { id: label.id });
      };

    }]);
