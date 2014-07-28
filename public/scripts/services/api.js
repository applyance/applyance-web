'use strict';

angular.module('ApplyanceApp')
  .run(function(ApplyanceAPI) {})
  .factory('ApplyanceAPI', ['$http', '$rootScope', 'Restangular',
    function($http, $rootScope, Restangular) {

      var apiKey = window.apiKey;
      var apiHost = window.apiHost;

      Restangular.setBaseUrl(apiHost);
      Restangular.setDefaultHeaders({'Authorization': "ApplyanceLogin auth=" + apiKey});

      this.getMe = function() {
        return $http.get(apiHost + "/accounts/me", {
          headers: {'Authorization': "ApplyanceLogin auth=" + apiKey}
        });
      };
      this.getUnits = function(entityId) {
        return Restangular.one('entities', entityId).all('units').getList();
      };
      this.getSpots = function(unitId) {
        return Restangular.one("units", unitId).all("spots").getList();
      };
      this.getApplications = function(parent, parentId) {
        return Restangular.one(parent, parentId).all("applications").getList();
      };
      this.getApplication = function(id) {
        return Restangular.one('applications', id).get();
      };
      this.uploadAttachment = function(fileData, contentType) {
        return $http.post(apiHost + "/attachments", fileData, {
          headers: {
            'Authorization': "ApplyanceLogin auth=" + apiKey,
            'Content-Type': contentType
          }
        });
      };
      this.updateEntity = function(entityId, updatedEntityObj) {
        return $http.put(apiHost + "/entities/" + entityId, updatedEntityObj, {
          headers: {
            'Authorization': "ApplyanceLogin auth=" + apiKey
          }
        });
      };
      this.updateUnit = function(unitId, updatedUnitObj) {
        return $http.put(apiHost + "/units/" + unitId, updatedUnitObj, {
          headers: {
            'Authorization': "ApplyanceLogin auth=" + apiKey
          }
        });
      };

      // Definitions
      this.getDefinitions = function() {
        return Restangular.all("definitions").getList();
      };

      // Blueprints
      this.deleteBlueprint = function(id) {
        return Restangular.one('blueprints', id).remove();
      };
      this.getEntityBlueprints = function(id) {
        return Restangular.one('entities', id).all('blueprints');
      };
      this.postEntityBlueprint = function(id, blueprint) {
        return Restangular.one('entities', id).all('blueprints').post(blueprint);
      };

      return this;
    }])
;
