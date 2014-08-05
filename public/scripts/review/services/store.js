module.exports = angular.module('Review')
  .run(function(Store) {})
  .service('Store', ['me', '$rootScope',
    function(me, $rootScope) {

      // Initilize the store based on me data
      var account = me.account;
      var reviewers = me.reviewers;
      var activeEntityId = me.reviewers[0].entity.id;

      //
      // Account
      //
      this.getAccount = function() {
        return account;
      };
      this.setAccount = function(_account) {
        account = _account;
      };

      //
      // Reviewers
      //
      this.getReviewers = function() {
        return reviewers;
      };

      //
      // Entites
      //
      this.getEntities = function() {
        return _.map(reviewers, function(reviewer) {
          return reviewer.entity;
        });
      };
      this.getEntity = function(entityId) {
        return _.find(this.getEntities(), function(entity) {
          return entity.id == entityId;
        });
      };
      this.getActiveEntity = function() {
        var T = this;
        return _.find(this.getEntities(), function(entity) {
          return entity.id == T.getActiveEntityId();
        });
      };
      this.setEntity = function(entity) {
        var reviewerPosition;
        angular.forEach(reviewers, function(position, index) {
          if (position.entity.id == entity.id) {
            reviewerPosition = position;
          }
        });
        reviewerPosition.entity = _.extend(reviewerPosition.entity, entity);
      };
      this.addEntity = function(reviewerPosition) {
        reviewers.push(reviewerPosition);
      };
      this.removeEntity = function(entity) {
        var reviewerPosition;
        angular.forEach(reviewers, function(position, index) {
          if (position.entity.id == entity.id) {
            reviewerPosition = position;
          }
        });
        reviewers.splice(reviewers.indexOf(reviewerPosition), 1);
      };
      this.getCurrentScope = function() {
        var T = this;
        var scope;
        angular.forEach(reviewers, function(position, index) {
          if (position.entity.id == T.getActiveEntityId()) {
            scope = position.scope;
          }
        });
        return scope;
      };
      this.getActiveEntityId = function() {
        return activeEntityId;
      };
      this.setActiveEntityId = function(id) {
        activeEntityId = id;
        $rootScope.$emit("contextChanged", {newEntityId: activeEntityId});
      };

    }])
;
