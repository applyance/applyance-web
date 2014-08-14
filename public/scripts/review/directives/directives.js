'use strict';

module.exports = angular.module('Review')
  .directive('ngModelOnblur', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      priority: 1, // needed for angular 1.2.x
      link: function(scope, elm, attr, ngModelCtrl) {
          if (attr.type === 'radio' || attr.type === 'checkbox') return;

          elm.unbind('input').unbind('keydown').unbind('change');
          elm.bind('blur', function() {
              scope.$apply(function() {
                  ngModelCtrl.$setViewValue(elm.val());
              });
          });
      }
    };
  })
  .directive('contextSwitcher', ['Store', '$location', '$document', '$filter',
    function (Store, $location, $document, $filter) {
    return {
      restrict: 'AE',
      replace: true,
      templateUrl: 'scripts/review/directives/contextSwitcher.html',
      link: function(scope, elem, attrs) {
        scope.showEntityList = false;

        var sortedEntities = [];

        scope.entities = function() {
          if (Store.getIsSortDirty()) {
            var entityList = Store.getEntities();
            var parentEntitiesList = [];
            var childEntitiesLists = {};

            // Group the entities by parent entites
            angular.forEach(entityList, function(e, i) {
              if (e.parent) {
                if (!childEntitiesLists[e.parent.id]) {
                  childEntitiesLists[e.parent.id] = [];
                }
                childEntitiesLists[e.parent.id].push(e);
              } else {
                parentEntitiesList.push(e);
              }
            });

            // Alpha-numerically sort all the lists
            var sortingPredicates = ['name', 'created_at'];
            var sortedParentEntitiesList = $filter('orderBy')(parentEntitiesList, sortingPredicates);
            var sortedChildEntityLists = {};
            sortedEntities = [];
            angular.forEach(sortedParentEntitiesList, function(pe, i) {

              var childEntitiesList = childEntitiesLists[pe.id];
              var sortedChildEntitiesList = $filter('orderBy')(childEntitiesList, sortingPredicates);

              // Insert the parent followed by it's children into the master list
              sortedEntities.push(pe);
              angular.forEach(sortedChildEntitiesList, function(sortedChild, i) {
                sortedEntities.push(sortedChild);
              });
            });

            Store.setIsSortDirty(false);
          }

          return sortedEntities;
        };
        scope.activeEntity = function() {
          return Store.getActiveEntity();
        };
        scope.updateEntitySelect = function(selectedEntity) {
          scope.showEntityList = false;
          Store.setActiveEntityId(selectedEntity.id);

          var pathParts = $location.path().split('/');
          var mainContext = pathParts[1];
          var secondaryContext = pathParts[3];

          switch(mainContext) {
            case "entities":
              $location.path('/entities/' + Store.getActiveEntityId() + '/' + secondaryContext);
              break;
            case "spots":
              $location.path('/entities/' + Store.getActiveEntityId() + '/spots');
              break;
            case "accounts":
              break;
            default:
              $location.path('/entities/' + Store.getActiveEntityId() + '/applications');
          }

        };
        elem.on('click', function(e) {
          e.stopPropagation();
        });
        $document.on('click', function() {
          scope.$apply(function() {
            scope.showEntityList = false;
          });
        });
      }
    };
  }])
  .directive('ngConfirmClick', [
    function() {
      return {
        link: function (scope, element, attr) {
          var msg = attr.ngConfirmClick || "Are you sure?";
          var clickAction = attr.confirmedClick;
          element.bind('click',function (e) {
            e.stopPropagation();
            if (window.confirm(msg)) {
              scope.$eval(clickAction)
            }
          });
        }
      };
    }
  ])
  .directive('aplGo', ['$location', '$timeout',
    function($location, $timeout) {
      return {
        link: function (scope, element, attr) {
          var targetPath = attr.aplGo;
          var canGo = (attr.aplCanGo == "true");
          if (canGo) {
            element.bind('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              $timeout(function() {
                $location.path(targetPath);
              }, 50);
            });
          }
        }
      }
    }
  ])
  .directive('aplClickOutside', ['$document', function($document) {
    return {
      scope: {
        aplClickOutside: '&'
      },
      link: function(scope, elem, attr, ctrl) {
        elem.bind('click', function(e) {
          e.stopPropagation();
        });
        $document.bind('click', function() {
          scope.$apply(function() {
            scope.aplClickOutside();
          });
        });
      }
    }
  }])
  .directive('aplTooltip', ['$document', function($document) {
    return {
      restrict: 'A',
      link: function(scope, elem, attr, ctrl) {

        var tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.innerHTML = attr.aplTooltip;
        document.body.appendChild(tooltip);

        var tether = null;
        elem.bind('mouseenter', function(e) {
          tooltip.classList.add('is-open');
          tether = new Tether({
            element: tooltip,
            target: elem[0],
            attachment: 'top center',
            targetAttachment: 'bottom center',
            offset: '-18px 0'
          });
        });

        elem.bind('mouseleave', function(e) {
          tooltip.classList.remove('is-open');
          tether.destroy();
        });

      }
    }
  }])
  .directive('aplColorSwatch', ['Store', '$location', '$document', '$filter',
    function (Store, $location, $document, $filter) {
    return {
      restrict: 'AE',
      templateUrl: 'scripts/review/directives/colorSwatch.html',
      scope: {
        color: "=",
        onColorSelected: "&"
      },
      link: function(scope, elem, attrs) {
        scope.showPane = false;
        scope.colors = [
          { hex: "FF3E3E" },
          { hex: "FF9A3E" },
          { hex: "E5DC35" },
          { hex: "3EFF7E" },
          { hex: "40D2FF" },
          { hex: "D93EFF" },

          { hex: "992623" },
          { hex: "995C25" },
          { hex: "999925" },
          { hex: "25994C" },
          { hex: "267E99" },
          { hex: "822399" }
        ];
        scope.selectedColor = _.findWhere(scope.colors, { hex: scope.color });

        scope.selectColor = function(color) {
          scope.selectedColor = color;
          scope.onColorSelected({
            color: color.hex
          });
          scope.showPane = false;
        };
      }
    }
  }])
;
