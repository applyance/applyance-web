'use strict';

module.exports = angular.module('Register')
  .directive('aplRegisterScrollToStep', ['$timeout', '$document', '$rootScope',
    function($timeout, $document, $rootScope) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          element.on('click', function() {
            $timeout(function() {
              var someElement = angular.element(
                document.getElementById("step" + attrs.aplRegisterScrollToStep));
              $document.scrollToElement(someElement, 0, 500).then(function() {
                $rootScope.$broadcast('register-scrolled-to-step-' + attrs.aplRegisterScrollToStep);
              });
            }, 100);
          });
        }
      };
    }
  ])
;
