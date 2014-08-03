'use strict';

module.exports = angular.module('Applyance')
  .directive('focusOn', function() {
     return function(scope, elem, attr) {
        scope.$on(attr.focusOn, function(e) {
          elem[0].focus();
        });
     };
  })
