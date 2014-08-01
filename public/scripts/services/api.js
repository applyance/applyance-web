'use strict';

angular.module('Applyance', ['restangular'])
  .run(function(ApplyanceAPI) {})
  .factory('ApplyanceAPI', ['$http', 'Restangular', 'apiHost', 'apiKey',
    function($http, Restangular, apiHost, apiKey) {

      Restangular.setBaseUrl(apiHost);
      Restangular.setDefaultHeaders({ 'Authorization': "ApplyanceLogin auth=" + apiKey });

      $http.defaults.headers.common['Authorization'] = "ApplyanceLogin auth=" + apiKey;
      $http.defaults.headers.common['Content-Type'] = "application/json";

      this.getMe = function() {
        return $http.get(apiHost + "/accounts/me");
      };
      this.updateMe = function(accountId, accountInfo) {
        return $http.put(apiHost + "/accounts/" + accountId, accountInfo);
      };

      // Accounts
      this.checkForEmail = function(email) {
        return $http.get(apiHost + '/emails?email=' + email);
      };
      this.authenticate = function(auth) {
        return $http.post(apiHost + '/accounts/auth', auth);
      };

      // Applications
      this.getApplications = function(parent, parentId) {
        return Restangular.one(parent, parentId).all("applications").getList();
      };
      this.getApplication = function(id) {
        return Restangular.one('applications', id).get();
      };
      this.postApplication = function(application) {
        return Restangular.all('applications').post(application);
      }

      // Attachments
      this.uploadAttachment = function(fileData, contentType) {
        return $http.post(apiHost + "/attachments", fileData, {
          headers: { 'Content-Type': contentType }
        });
      };

      // Entities
      this.getEntity = function(id) {
        return Restangular.one('entities', id).get();
      };
      this.getEntities = function(id) {
        return Restangular.one('entities', id).all('entities').getList();
      };
      this.postEntity = function(id, entity) {
        return Restangular.one('entities', id).all('entities').post(entity);
      };
      this.deleteEntity = function(id) {
        return Restangular.one('entities', id).remove();
      };
      this.putEntity = function(entity) {
        return $http.put(apiHost + "/entities/" + entity.id, entity);
      };

      // Reviewers
      this.getReviewers = function(id) {
        return Restangular.one('entities', id).all('reviewers').getList();
      };
      this.deleteReviewer = function(id) {
        return Restangular.one('reviewers', id).remove();
      };
      this.putReviewer = function(reviewer) {
        return $http.put(apiHost + "/reviewers/" + reviewer.id, reviewer);
      };

      // Reviewer Invites
      this.getReviewerInvites = function(id) {
        return Restangular.one('entities', id).all('reviewers').all('invites').getList();
      };
      this.postReviewerInvite = function(id, invite) {
        return Restangular.one('entities', id).all('reviewers').all('invites').post(invite);
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
      this.getBlueprints = function(id) {
        return Restangular.one('entities', id).all('blueprints').getList();
      };
      this.postBlueprint = function(id, blueprint) {
        return Restangular.one('entities', id).all('blueprints').post(blueprint);
      };

      // Datums
      this.getDatums = function(id) {
        return Restangular.one('applicants', id).all('datums').getList();
      };

      // Spots
      this.getSpots = function(id) {
        return Restangular.one("entities", id).all("spots").getList();
      };

      // Labels
      this.getLabels = function(id) {
        return Restangular.one('entities', id).all('labels').getList();
      };
      this.postLabel = function(id, label) {
        return Restangular.one('entities', id).all('labels').post(label);
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
