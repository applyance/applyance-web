'use strict';

module.exports = angular.module('Apply')
  .directive('aplBlueprintMaskWebsite', function () {
    return {
      restrict: 'A',
      link: function (scope, elm, attr) {

        elm.attr('placeholder', 'http://');

        elm.inputmask({
          mask: "\\http://*{1,99999}",
          placeholder: "",
          greedy: false,
          definitions: {
            '*': {
              validator: '[^ ]',
              cardinality: 1
            }
          }
        });

      }
    };
  });
