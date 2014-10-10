'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintMaskSocialsecuritynumber', function () {
    return {
      restrict: 'A',
      link: function (scope, elm, attr) {
        elm.attr('data-inputmask', "'mask': '999-99-9999'");
        elm.attr('placeholder', '___-__-____');
        elm.inputmask();
      }
    };
  });
