'use strict';

angular.module('ApplyanceApp')
  .run(function(ApplyanceAPI) {})
  .factory('ApplyanceAPI', ['$http', '$rootScope', 'Restangular',
    function($http, $rootScope, Restangular) {

      Restangular.setBaseUrl(apiHost);
      Restangular.setDefaultHeaders({'Authorization': "ApplyanceLogin auth=" + apiKey});

      this.getMe = function() {
        return $http.get(apiHost + "/accounts/me", {headers: {'Authorization': "ApplyanceLogin auth=" + apiKey}});
      };
      this.getUnits = function(entityId) {
        return Restangular.one('entities', entityId).all('units').getList();
      };
      this.getSpots = function(unitId) {
        return Restangular.one("units", unitId).all("spots").getList();
      };
      this.getApplications = function(spotId) {
        return Restangular.one("spots", spotId).all("applications").getList();
      };
      this.getApplication = function(id) {
        return Restangular.one('applications', id).get();
      };

      return this;
    }])
;
