'use strict';

// Vendor Libs
var angular = require("angular");
window.CryptoJS = require("crypto-js");
window.moment = require("moment");
require("angular-moment");
require("angular-route");

// Define Review Module
angular.module('Review', [require("../services/api").name, 'ngRoute', 'angularMoment'])
  .config(['$routeProvider', '$locationProvider', 'me', require("./routes")]);

require("./directives");
require("./filters");

require("./services/store");
require("./services/flash");

require("./controllers/header/header");
require("./controllers/header/account");

require("./controllers/applications");
require("./controllers/application");
require("./controllers/settings");
require("./controllers/account");

require("./controllers/entities/blueprints");
require("./controllers/entities/entities");
require("./controllers/entities/reviewers");
require("./controllers/entities/settings");
require("./controllers/entities/labels");
