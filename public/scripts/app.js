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
        templateUrl: 'views/applications.html'
      })
      .when('/applications/:id', {
        templateUrl: 'views/application.html',
        controller: 'ApplicationCtrl'
      })
      .when('/entities/:id/settings', {
        templateUrl: 'views/settings/entity.html',
        controller: 'EntitySettingsCtrl'
      })
      .otherwise({
        redirectTo: '/applications'
      });

    $locationProvider.html5Mode(true);

  });
