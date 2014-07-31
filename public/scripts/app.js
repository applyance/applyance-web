'use strict';

angular.module('ApplyanceApp', ['ngRoute', 'restangular', 'angularMoment'])
  .config(function($routeProvider, $locationProvider) {

    $routeProvider
      .when('/accounts/:id/settings', {
        templateUrl: 'views/settings/account.html',
        controller: 'AccountSettingsCtrl',
        resolve: {
          me: function(Me) {
            return Me.init();
          }
        }
      })

      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      })

      .when('/:parent/:id/applications', {
        controller: 'ApplicationsCtrl',
        templateUrl: 'views/applications/applications.html',
        resolve: {
          me: function(Me) {
            return Me.init();
          }
        }
      })
      .when('/applications/:id', {
        templateUrl: 'views/applications/application.html',
        controller: 'ApplicationCtrl',
        resolve: {
          me: function(Me) {
            return Me.init();
          }
        }
      })

      .when('/entities/:id/settings', {
        templateUrl: 'views/settings/settings.html',
        controller: 'SettingsCtrl',
        resolve: {
          me: function(Me) {
            return Me.init();
          }
        }
      })
      .when('/entities/:id/units', {
        templateUrl: 'views/settings/settings.html',
        controller: 'SettingsCtrl',
        resolve: {
          me: function(Me) {
            return Me.init();
          }
        }
      })
      .when('/entities/:id/admins', {
        templateUrl: 'views/settings/settings.html',
        controller: 'SettingsCtrl',
        resolve: {
          me: function(Me) {
            return Me.init();
          }
        }
      })
      .when('/entities/:id/blueprints', {
        templateUrl: 'views/settings/settings.html',
        controller: 'SettingsCtrl',
        resolve: {
          Me: function(Me) {
            return Me.init();
          }
        }
      })

      .when('/units/:id/settings', {
        templateUrl: 'views/settings/settings.html',
        controller: 'SettingsCtrl',
        resolve: {
          Me: function(Me) {
            return Me.init();
          }
        }
      })
      .when('/units/:id/reviewers', {
        templateUrl: 'views/settings/settings.html',
        controller: 'SettingsCtrl',
        resolve: {
          me: function(Me) {
            return Me.init();
          }
        }
      })
      .when('/units/:id/blueprints', {
        templateUrl: 'views/settings/settings.html',
        controller: 'SettingsCtrl',
        resolve: {
          me: function(Me) {
            return Me.init();
          }
        }
      })
      .when('/units/:id/labels', {
        templateUrl: 'views/settings/settings.html',
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
