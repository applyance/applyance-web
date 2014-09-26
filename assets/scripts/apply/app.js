'use strict';

window.jQuery   = require("jquery");
window.Tether   = require("tether");

require("angular");
require("angular-route");
require("angular-scroll");
require("angular-elastic");

var ApplyanceApi = require("../services/api");

angular.module('Apply', [ApplyanceApi.name, 'ngRoute', 'monospaced.elastic', 'duScroll'])
  .config(['$routeProvider', '$locationProvider', 'slugUrl',
    function($routeProvider, $locationProvider, slugUrl) {

      $routeProvider
        .when('/:slugUrl*', {
          templateUrl: '/views/apply/main.html',
          controller: 'FormCtrl'
        })
        .otherwise({
          redirectTo: '/' + slugUrl
        });

      $locationProvider.html5Mode(true);

    }
  ]);

require("../directives");

require("../directives/blueprints/shorttext");
require("../directives/blueprints/longtext");
require("../directives/blueprints/fileupload");
require("../directives/blueprints/dropdown");

require("./directives");

require("../filters");

require("./controllers/form");
require("./controllers/locations");
require("./controllers/spots");
require("./controllers/questions");
