'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintMaskPhonenumber', function () {
    return {
      restrict: 'A',
      link: function (scope, elm, attr) {
        elm.attr('data-inputmask', "'mask': '(999) 999-9999'");
        if (!elm.is('[placeholder]')) {
          elm.attr('placeholder', '(___) ___-____');
        }
        elm.inputmask();
      }
    };
  });
