'use strict';

var angular = require("angular");
require("angular-route");

var ApplyanceApi = require("../services/api");

angular.module('Apply', [ApplyanceApi.name, 'ngRoute'])
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

require("./directives");
require("./controllers/form");
