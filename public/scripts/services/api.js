'use strict';

angular.module('ApplyanceApp')
  .run(function(ApplyanceAPI) {})
  .factory('ApplyanceAPI', ['$http', '$rootScope', 'Restangular',
    function($http, $rootScope, Restangular) {

      var apiKey = window.apiKey;
      var apiHost = window.apiHost;

      Restangular.setBaseUrl(apiHost);
      Restangular.setDefaultHeaders({ 'Authorization': "ApplyanceLogin auth=" + apiKey });

      $http.defaults.headers.common['Authorization'] = "ApplyanceLogin auth=" + apiKey;
      $http.defaults.headers.common['Content-Type'] = "application/json";

      this.getMe = function() {
        return $http.get(apiHost + "/accounts/me");
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
            'Content-Type': contentType
          }
        });
      };
      this.updateEntity = function(entityId, updatedEntityObj) {
        return $http.put(apiHost + "/entities/" + entityId, updatedEntityObj);
      };

      // Units
      this.getUnits = function(id) {
        return Restangular.one('entities', id).all('units').getList();
      };
      this.postUnit = function(id, unit) {
        return Restangular.one('entities', id).all('units').post(unit);
      };
      this.deleteUnit = function(id) {
        return Restangular.one('units', id).remove();
      };
      this.putUnit = function(unit) {
        return $http.put(apiHost + "/units/" + unit.id, unit);
      };

      // Admins
      this.getAdmins = function(id) {
        return Restangular.one('entities', id).all('admins').getList();
      };
      this.deleteAdmin = function(id) {
        return Restangular.one('admins', id).remove();
      };
      this.putAdmin = function(admin) {
        return $http.put(apiHost + "/admins/" + admin.id, admin);
      };

      // Admin Invites
      this.getAdminInvites = function(id) {
        return Restangular.one('entities', id).all('admins').all('invites').getList();
      };
      this.postAdminInvite = function(id, invite) {
        return Restangular.one('entities', id).all('admins').all('invites').post(invite);
      };
      this.claimAdminInvite = function(invite) {
        return $http.post("/admins/invites/claim", invite);
      };

      // Reviewers
      this.getReviewers = function(id) {
        return Restangular.one('units', id).all('reviewers').getList();
      };
      this.deleteReviewer = function(id) {
        return Restangular.one('reviewers', id).remove();
      };
      this.putReviewer = function(reviewer) {
        return $http.put(apiHost + "/reviewers/" + reviewer.id, reviewer);
      };

      // Reviewer Invites
      this.getReviewerInvites = function(id) {
        return Restangular.one('units', id).all('reviewers').all('invites').getList();
      };
      this.postReviewerInvite = function(id, invite) {
        return Restangular.one('units', id).all('reviewers').all('invites').post(invite);
      };
      this.claimReviewerInvite = function(invite) {
        return $http.post("/reviewers/invites/claim", invite);
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
        return Restangular.one('entities', id).all('blueprints').getList();
      };
      this.postEntityBlueprint = function(id, blueprint) {
        return Restangular.one('entities', id).all('blueprints').post(blueprint);
      };
      this.getUnitBlueprints = function(id) {
        return Restangular.one('units', id).all('blueprints').getList();
      };
      this.postUnitBlueprint = function(id, blueprint) {
        return Restangular.one('units', id).all('blueprints').post(blueprint);
      };

      // Labels
      this.getLabels = function(id) {
        return Restangular.one('units', id).all('labels').getList();
      };
      this.postLabel = function(id, label) {
        return Restangular.one('units', id).all('labels').post(label);
      };
      this.deleteLabel = function(id) {
        return Restangular.one('labels', id).remove();
      };
      this.putLabel = function(label) {
        return $http.put(apiHost + "/labels/" + label.id, label);
      };

      return this;
    }])
;
