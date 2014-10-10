'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintMaskDate', function () {
    return {
      restrict: 'A',
      link: function (scope, elm, attr) {
        elm.attr('data-inputmask', "'alias': 'mm/dd/yyyy'");
        if (!elm.is('[placeholder]')) {
          elm.attr('placeholder', "mm/dd/yyyy");
        }
        elm.inputmask();
      }
    };
  });
