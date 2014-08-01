angular.module('Review')
  .run(function(Me) {})
  .service('Me', ['ApplyanceAPI', 'me',
    function(ApplyanceAPI, me) {

      this.me = me;

      this.setMe = function(_me) {
        this.me = _me;
      };

      this.getMe = function() {
        return this.me;
      };

      this.updateMe = function(accountInfo) {
        return ApplyanceAPI.updateMe(accountInfo.id, accountInfo);
      }

      this.getEntities = function() {
        return _.map(this.me.reviewers, function(reviewer) {
          return reviewer.entity;
        });
      };

      this.getEntity = function(entityId) {
        return _.find(this.getEntities(), function(entity) {
          return entity.id == entityId;
        });
      };

    }])
;
