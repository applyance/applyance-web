'use strict';

var angular = require("angular");
require("angular-route");
window.moment = require("moment");
require("angular-moment");

window.CryptoJS = require("crypto-js");

var ApplyanceApi = require("../services/api");

var Routes = require("./routes");

angular.module('Review', [ApplyanceApi.name, 'ngRoute', 'angularMoment'])
  .config(['$routeProvider', '$locationProvider', 'me', Routes]);


require("./directives");
require("./filters");


require("./services/me");
require("./services/context");
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
