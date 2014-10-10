'use strict';

window.jQuery   = require("jquery");
window.Tether   = require("tether");
window.async    = require("../ext/async/lib/async");

require("../ext/jquery.inputmask/dist/inputmask/jquery.inputmask.js");
require("../ext/jquery.inputmask/dist/inputmask/jquery.inputmask.date.extensions.js");
require("angular");
require("angular-route");
require("angular-scroll");
require("angular-elastic");

// Load the templates into the template cache

var ApplyanceApi = require("../services/api");
angular.module('Apply', [ApplyanceApi.name, 'ngRoute', 'monospaced.elastic', 'duScroll']);

require("../templates");
require("./templates");

angular.module('Apply')
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

require("../services/BlueprintFactory");

require("../directives");

require("../directives/blueprints/shorttext");
require("../directives/blueprints/longtext");
require("../directives/blueprints/fileupload");
require("../directives/blueprints/dropdown");
require("../directives/blueprints/multiplechoice");
require("../directives/blueprints/yesno");
require("../directives/blueprints/rating");
require("../directives/blueprints/name");
require("../directives/blueprints/address");
require("../directives/blueprints/legal");
require("../directives/blueprints/education");
require("../directives/blueprints/workexperience");
require("../directives/blueprints/reference");
require("../directives/blueprints/email");
require("../directives/blueprints/phonenumber");
require("../directives/blueprints/website");
require("../directives/blueprints/socialsecuritynumber");
require("../directives/blueprints/hourlyavailability");
require("../directives/blueprints/date");

require("../directives/blueprints/masks/phonenumber");
require("../directives/blueprints/masks/email");
require("../directives/blueprints/masks/website");
require("../directives/blueprints/masks/socialsecuritynumber");
require("../directives/blueprints/masks/date");
require("../directives/blueprints/masks/month");

require("./directives");

require("../filters");

require("./controllers/form");
require("./controllers/locations");
require("./controllers/spots");
require("./controllers/questions");
