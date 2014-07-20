'use strict';

angular.module('ApplyanceApp', ['ngRoute', 'restangular'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .when('/applications', {
        templateUrl: 'views/applications.html',
        controller: 'ApplicationsCtrl'
      })
      .otherwise({
        redirectTo: '/applications'
      });
  });
