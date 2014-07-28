'use strict';

angular.module('ApplyanceApp', ['ngRoute', 'restangular', 'angularMoment'])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      })

      .when('/:parent/:id/applications', {
        controller: 'ApplicationsCtrl',
        templateUrl: 'views/applications/applications.html'
      })
      .when('/applications/:id', {
        templateUrl: 'views/applicaitons/application.html',
        controller: 'ApplicationCtrl'
      })

      .when('/entities/:id/settings', {
        templateUrl: 'views/settings/settings.html',
        controller: 'SettingsCtrl'
      })
      .when('/entities/:id/units', {
        templateUrl: 'views/settings/settings.html',
        controller: 'SettingsCtrl'
      })
      .when('/entities/:id/admins', {
        templateUrl: 'views/settings/settings.html',
        controller: 'SettingsCtrl'
      })
      .when('/entities/:id/blueprints', {
        templateUrl: 'views/settings/settings.html',
        controller: 'SettingsCtrl'
      })

      .when('/units/:id/settings', {
        templateUrl: 'views/settings/settings.html',
        controller: 'SettingsCtrl'
      })
      .when('/units/:id/reviewers', {
        templateUrl: 'views/settings/settings.html',
        controller: 'SettingsCtrl'
      })
      .when('/units/:id/blueprints', {
        templateUrl: 'views/settings/settings.html',
        controller: 'SettingsCtrl'
      })
      .when('/units/:id/labels', {
        templateUrl: 'views/settings/settings.html',
        controller: 'SettingsCtrl'
      })

      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);

  });
