module.exports = angular.module('Review')
  .run(function(Store) {})
  .service('Store', ['me',
    function(me) {

      // Initilize the store based on me data
      var account = me.account;
      var reviewers = me.reviewers;
      this.activeEntityId = me.reviewers[0].entity.id;

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
          return entity.id == T.activeEntityId;
        });
      };
      this.setEntity = function(entity) {
        var reviewerPosition;
        angular.forEach(reviewers, function(position, index) {
          if (position.entity.id == entity.id) {
            reviewerPosition = position;
          }
        });
        reviewerPosition.entity = entity;
      };
      this.addEntity = function(entity) {

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
          if (position.entity.id == T.activeEntityId) {
            scope = position.scope;
          }
        });
        return scope;
      };

    }])
;
