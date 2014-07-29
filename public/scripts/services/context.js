angular.module('ApplyanceApp')
  .run(function(Context) {})
  .service('Context', ['$location', 'Me',
    function($location, Me) {

      this.parts = [];
      this.inited = false;

      this.init = function() {
        if (this.inited) {
          return this;
        }
        this.parts = $location.path().split('/');
        this.inited = true;
        return this;
      };

      this.reload = function() {
        this.parts = $location.path().split('/');
        return this;
      };

      this.exists = function() {
        this.init();
        return _.contains(["entities", "units"], this.getGroup()) && this.getId();
      }

      this.getGroup = function() {
        this.init();
        return this.parts[1] || null;
      };

      this.getId = function() {
        this.init();
        return parseInt(this.parts[2]) || null;
      };

      this.getObject = function(defaultGroup, defaultId) {
        return {
          group: this.getGroup() || defaultGroup || null,
          id: this.getId() || defaultId || null
        }
      };

      this.getPart = function(int) {
        this.init();
        return this.parts[int] || null;
      };

      this.getParts = function(int) {
        this.init();
        return this.parts;
      };

    }])
;