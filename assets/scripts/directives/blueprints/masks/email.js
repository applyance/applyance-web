'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintMaskEmail', function () {
    return {
      restrict: 'A',
      link: function (scope, elm, attr) {
        elm.attr('data-inputmask', "'alias': 'email'");
        elm.attr('placeholder', '_@_');
        elm.inputmask();
      }
    };
  });
