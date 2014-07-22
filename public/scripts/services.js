'use strict';

angular.module('ApplyanceApp')
  .run(function(ApplyanceAPI) {})
  .factory('ApplyanceAPI', ['$http', '$rootScope', 'Restangular',
    function($http, $rootScope, Restangular) {

      Restangular.setBaseUrl("https://applyance.apiary-mock.com");


      this.getApplications = function() {
        return Restangular.one("spots", 1).all("applications").getList();
      };

      this.getApplication = function(id) {
        return Restangular.one('applications', id).get();
      };

      return this;
    }])
;
