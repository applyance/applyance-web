'use strict';

angular.module('Apply', ['Applyance', 'ngRoute'])
  .config(function($routeProvider, $locationProvider) {

    $routeProvider
      .when('/apply', {
        templateUrl: '/views/apply/form.html',
        controller: 'FormCtrl'
      })
      .otherwise({
        redirectTo: '/apply'
      });

    $locationProvider.html5Mode(true);

  });
