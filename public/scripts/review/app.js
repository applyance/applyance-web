'use strict';

angular.module('Review', ['Applyance', 'ngRoute', 'angularMoment'])
  .config(['$routeProvider', '$locationProvider', 'me',
    function($routeProvider, $locationProvider, me) {

      $routeProvider
        .when('/accounts/:id/settings', {
          templateUrl: 'views/review/settings/account.html',
          controller: 'AccountSettingsCtrl'
        })

        .when('/dashboard', {
          templateUrl: 'views/review/dashboard.html',
          controller: 'DashboardCtrl'
        })

        .when('/:parent/:id/applications', {
          controller: 'ApplicationsCtrl',
          templateUrl: 'views/review/applications/applications.html'
        })
        .when('/applications/:id', {
          templateUrl: 'views/review/applications/application.html',
          controller: 'ApplicationCtrl'
        })

        .when('/entities/:id/settings', {
          templateUrl: 'views/review/settings/settings.html',
          controller: 'SettingsCtrl'
        })
        .when('/entities/:id/entities', {
          templateUrl: 'views/review/settings/settings.html',
          controller: 'SettingsCtrl'
        })
        .when('/entities/:id/reviewers', {
          templateUrl: 'views/review/settings/settings.html',
          controller: 'SettingsCtrl'
        })
        .when('/entities/:id/blueprints', {
          templateUrl: 'views/review/settings/settings.html',
          controller: 'SettingsCtrl'
        })
        .when('/entities/:id/labels', {
          templateUrl: 'views/review/settings/settings.html',
          controller: 'SettingsCtrl'
        })

        .otherwise({
          redirectTo: '/entities/' + me.reviewers[0].entity.id + '/applications'
        });

      $locationProvider.html5Mode(true);

    }]);
