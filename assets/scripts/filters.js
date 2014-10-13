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
  .filter('blueprintText', function() {
    return function(input, blueprintOrEntity) {
      if (blueprintOrEntity.spot) {
        return input.replace("{{ blueprintOrEntity.spot.entity.name }}", blueprintOrEntity.spot.entity.name);
      } else if (blueprintOrEntity.entity) {
        return input.replace("{{ blueprintOrEntity.entity.name }}", blueprintOrEntity.entity.name);
      } else {
        return input.replace("{{ blueprintOrEntity.name }}", blueprintOrEntity.name);
      }
    }
  })
  .filter('nl2p', function() {
    return function(text){
      text = String(text).trim();
      return (text.length > 0 ? '<p>' + text.replace(/[\r\n]+/g, '</p><p>') + '</p>' : null);
    }
  })
  .filter('friendlyAddress', function () {
    return function(obj) {
      return obj.address_1 + "<br />" + obj.city + ", " + obj.state + " " + obj.postal_code;
    }
  })
  .filter('aplMoment', function () {
    return function(input, format) {
      return moment(input, 'YYYY-MM-DD HH:mm:ss Z').format(format);
    }
  })
  .filter('aplCut', function () {
    return function (value, wordwise, max, tail) {
      if (!value) return '';

      max = parseInt(max, 10);
      if (!max) return value;
      if (value.length <= max) return value;

      value = value.substr(0, max);
      if (wordwise) {
          var lastspace = value.lastIndexOf(' ');
          if (lastspace != -1) {
              value = value.substr(0, lastspace);
          }
      }

      return value + (tail || '...');
    };
  })
  .filter('aplUnsafe', function($sce) {
    return function(val) {
      return $sce.trustAsHtml(val);
    };
  })
;
