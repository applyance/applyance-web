'use strict';

angular.module('ApplyanceApp', ['ngRoute', 'restangular', 'angularMoment'])
  .config(function($routeProvider, $locationProvider) {

    $routeProvider
      .when('/accounts/:id/settings', {
        templateUrl: 'views/review/settings/account.html',
        controller: 'AccountSettingsCtrl',
        resolve: {
          me: function(Me) {
            return Me.init();
          }
        }
      })

      .when('/dashboard', {
        templateUrl: 'views/review/dashboard.html',
        controller: 'DashboardCtrl'
      })

      .when('/:parent/:id/applications', {
        controller: 'ApplicationsCtrl',
        templateUrl: 'views/review/applications/applications.html',
        resolve: {
          me: function(Me) {
            return Me.init();
          }
        }
      })
      .when('/applications/:id', {
        templateUrl: 'views/review/applications/application.html',
        controller: 'ApplicationCtrl',
        resolve: {
          me: function(Me) {
            return Me.init();
          }
        }
      })

      .when('/entities/:id/settings', {
        templateUrl: 'views/review/settings/settings.html',
        controller: 'SettingsCtrl',
        resolve: {
          me: function(Me) {
            return Me.init();
          }
        }
      })
      .when('/entities/:id/entities', {
        templateUrl: 'views/review/settings/settings.html',
        controller: 'SettingsCtrl',
        resolve: {
          me: function(Me) {
            return Me.init();
          }
        }
      })
      .when('/entities/:id/reviewers', {
        templateUrl: 'views/review/settings/settings.html',
        controller: 'SettingsCtrl',
        resolve: {
          me: function(Me) {
            return Me.init();
          }
        }
      })
      .when('/entities/:id/blueprints', {
        templateUrl: 'views/review/settings/settings.html',
        controller: 'SettingsCtrl',
        resolve: {
          Me: function(Me) {
            return Me.init();
          }
        }
      })
      .when('/entities/:id/labels', {
        templateUrl: 'views/review/settings/settings.html',
        controller: 'SettingsCtrl',
        resolve: {
          me: function(Me) {
            return Me.init();
          }
        }
      })

      .otherwise({
        redirectTo: '/',
        resolve: {
          me: function(Me) {
            return Me.init();
          }
        }
      });

    $locationProvider.html5Mode(true);

  });
