'use strict';

module.exports = angular.module('Apply')
  .directive('aplShrinkHeaderOnReach', ['$document', '$timeout', function($document, $timeout) {
    return function(scope, elem, attr) {
      var $html = angular.element('html'),
          $header = angular.element('.apply-header'),
          $headerImg = $header.find('.apply-entity__logo'),
          $container = angular.element('.apply-form-container'),
          classRemoved = true,
          headerHeight = 0;

      $timeout(function() {
        headerHeight = $header.outerHeight(true);
      }, 100);

      $headerImg.on('load', function() {
        headerHeight = $header.outerHeight(true);
      });

      $document.on('scroll', function() {
        if ($document.scrollTop() >= elem.offset().top) {
          if (classRemoved) {
            $html.addClass('is-header-shrunk');
            $container.css('margin-top', headerHeight);
            classRemoved = false;
          }
        } else if (!classRemoved) {
          $html.removeClass('is-header-shrunk');
          $container.removeAttr('style');
          classRemoved = true;
        }
      });
    };
  }])
  .directive('aplScrollNextSection', ['$document', '$timeout', function($document, $timeout) {
    return function(scope, elem, attr) {
      var $header = angular.element('.apply-header'),
          $formSection = elem.closest('.form-section');
      if (!$formSection.length) {
        $formSection = elem.closest(attr.aplScrollNextSection);
      }
      elem.on('click', function(e) {
        $timeout(function() {
          var scrollToHere = $formSection.offset().top + $formSection.outerHeight() + 24 - 65;
          $document.scrollTop(scrollToHere, 400);
        }, 80);
      });
    };
  }])
  .directive('aplAttachInputmask', [function() {
    return {
      scope: {
        aplAttachInputmask: "="
      },
      link: function(scope, elm, attr) {
        scope.aplAttachInputmask[attr.aplAttachInputmaskAs || "_$mask"] = _.bind(elm.inputmask, elm);
      }
    }
  }])
  .directive('aplApplyFocus', [function() {
    return {
      link: function(scope, elm, attr) {
        elm.on('focus', '*', function(e) {
          elm.addClass('is-focused');
          jQuery(this).closest('.apply-questions__item').addClass('is-focused');
        });
        elm.on('blur', '*', function(e) {
          elm.removeClass('is-focused');
          jQuery(this).closest('.apply-questions__item').removeClass('is-focused');
        });
      }
    }
  }])
;
