angular.module('ApplyanceApp')
  .run(function(Me) {})
  .service('Me', ['ApplyanceAPI',
    function(ApplyanceAPI) {

      this.me = null;
      this.inited = false;
      this.initFns = [];

      this.onInit = function(fn) {
        if (this.inited) {
          fn.call();
        } else {
          this.initFns.push(fn);
        }
      };

      this.init = function() {
        if (this.inited) {
          return;
        }
        var service = this;
        return ApplyanceAPI.getMe().then(function(_me) {
          service.inited = true;
          service.me = _me.data;
          _.each(service.initFns, function(fn) { fn.call(); });
          return service;
        });
      };

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
        return _.map(this.me.admins, function(admin) {
          return admin.entity;
        });
      };

      this.getUnits = function() {
        return _.map(this.me.reviewers, function(reviewer) {
          return reviewer.unit;
        });
      };

      this.getEntity = function(entityId) {
        return _.find(this.getEntities(), function(entity) {
          return entity.id == entityId;
        });
      };

      this.getUnit = function(unitId) {
        return _.find(this.getUnits(), function(unit) {
          return unit.id == unitId;
        });
      };

    }])
;
