'use strict';

window.jQuery = require("jquery");
window.Tether       = require("tether");

require("angular");
require("angular-route");

var ApplyanceApi = require("../services/api");

angular.module('Apply', [ApplyanceApi.name, 'ngRoute'])
  .config(['$routeProvider', '$locationProvider', 'slugUrl',
    function($routeProvider, $locationProvider, slugUrl) {

      $routeProvider
        .when('/:slugUrl*', {
          templateUrl: '/views/apply/form.html',
          controller: 'FormCtrl'
        })
        .otherwise({
          redirectTo: '/' + slugUrl
        });

      $locationProvider.html5Mode(true);

    }
  ]);

require("../directives");

require("../directives/blueprints/text");
require("../directives/blueprints/textarea");
require("../directives/blueprints/fileupload");
require("../directives/blueprints/choice");

require("../filters");
require("./directives");
require("./controllers/form");
