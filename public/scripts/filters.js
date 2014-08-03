'use strict';

module.exports = angular.module('Applyance')
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
  .filter('nl2p', function () {
    return function(text){
      text = String(text).trim();
      return (text.length > 0 ? '<p>' + text.replace(/[\r\n]+/, '</p><p>') + '</p>' : null);
    }
  })
  .filter('friendlyAddress', function () {
    return function(obj) {
      return obj.address_1 + "<br />" + obj.city + ", " + obj.state + " " + obj.postal_code;
    }
  })
;
