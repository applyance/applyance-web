'use strict';

angular.module('ApplyanceApp', ['ngRoute', 'restangular', 'angularMoment'])
  .config(function($routeProvider, $locationProvider) {

    $routeProvider
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .when('/applications', {
        templateUrl: 'views/applications.html',
        controller: 'ApplicationsCtrl'
      })
      .when('/applications/:applicationId', {
        templateUrl: 'views/application.html',
        controller: 'ApplicationCtrl'
      })
      .otherwise({
        redirectTo: '/applications'
      });

    $locationProvider.html5Mode(true);

  });
