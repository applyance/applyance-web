"use strict";

angular.module('ApplyanceApp')
.factory('ApplyanceAPI', function (Restangular) {

  Restangular.setBaseUrl("https://applyance.apiary-mock.com/units/1");

  var baseApplications = Restangular.all("applications");
  baseApplications.getList().then(function(applications) {
    console.log(applications);
  });

});
