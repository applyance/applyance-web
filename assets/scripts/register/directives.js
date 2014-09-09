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
  .directive('aplSmoothScroll',
    function(duScrollDuration, scrollContainerAPI) {
      return {
        scope: { aplScrollEnd: '&' },
        link : function($scope, $element, $attr){
          $element.on('click', function(e){
            if(!$attr.href || $attr.href.indexOf('#') === -1) return;
            var target = document.getElementById($attr.href.replace(/.*(?=#[^\s]+$)/, '').substring(1));
            if(!target || !target.getBoundingClientRect) return;

            if (e.stopPropagation) e.stopPropagation();
            if (e.preventDefault) e.preventDefault();

            var offset = ($attr.offset ? parseInt($attr.offset, 10) : 0);
            var duration = $attr.duration ? parseInt($attr.duration, 10) : duScrollDuration;
            var container = scrollContainerAPI.getContainer($scope);

            container.scrollToElement(
              angular.element(target),
              isNaN(offset) ? 0 : offset,
              isNaN(duration) ? 0 : duration
            ).then($scope.aplScrollEnd || angular.noop);
          });
        }
      };
    }
  )
;
