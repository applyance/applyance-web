'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintMaskMonth', function () {
    return {
      restrict: 'A',
      link: function (scope, elm, attr) {
        elm.attr('data-inputmask', "'alias': 'mm/yyyy'");
        if (!elm.is('[placeholder]')) {
          elm.attr('placeholder', "mm/yyyy");
        }
        elm.inputmask();
      }
    };
  });
