'use strict';

module.exports = angular.module('Review')
  .filter('capitalize', function() {
    return function(input, scope) {
      if (input != null) {
        input = input.toLowerCase();
      }
      return input.substring(0,1).toUpperCase()+input.substring(1);
    }
  })
  .filter('blueprint', function() {
    return function(input, entity) {
      return input.replace("{{ entity.name }}", entity.name);
    }
  })
;
