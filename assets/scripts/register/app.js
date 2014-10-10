'use strict';

require("angular");
require("angular-route");
require("angular-scroll");

var ApplyanceApi = require("../services/api");

angular.module('Register', [ApplyanceApi.name, 'ngRoute', 'duScroll']);

require("../templates");
require("./templates");

angular.module('Register')
  .config(function($routeProvider, $locationProvider) {

    $routeProvider
      .when('/register', {
        templateUrl: '/views/register/form.html',
        controller: 'FormCtrl'
      })
      .otherwise({
        redirectTo: '/register'
      });

    $locationProvider.html5Mode(true);

  });

require("../directives");
require("../directives/blueprints");
require("../filters");
require("./directives");

require("./controllers/form");
