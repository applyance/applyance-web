angular.module('Review')
  .run(function(Me) {})
  .service('Me', ['ApplyanceAPI', '$q', 'me',
    function(ApplyanceAPI, $q, me) {

      this.me = me;

      this.setMe = function(_me) {
        this.me = _me;
      };

      this.getMe = function() {
        return this.me;
      };

      this.updateMe = function(accountInfo) {
        var that = this;
        return ApplyanceAPI.updateMe(accountInfo.id, accountInfo).then(function(me) {
          var dfr = $q.defer();
          that.me.name = me.name;
          that.me.email = me.email;
          dfr.resolve(me);
          return dfr.promise;
        });
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
