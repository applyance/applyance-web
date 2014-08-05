'use strict';

require("angular");
require("angular-route");

var ApplyanceApi = require("../services/api");

angular.module('Register', [ApplyanceApi.name, 'ngRoute', 'duScroll'])
  .config(function($routeProvider, $locationProvider) {

    $routeProvider
      .when('/accounts/register', {
        templateUrl: '/views/register/form.html',
        controller: 'FormCtrl'
      })
      .otherwise({
        redirectTo: '/accounts/register'
      });

    $locationProvider.html5Mode(true);

  });

require("../directives");
require("../filters");
require("./controllers/form");
