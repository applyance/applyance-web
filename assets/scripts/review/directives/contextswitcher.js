'use strict';

module.exports = angular.module('Review')
  .directive('contextSwitcher', ['$rootScope', 'Store', '$location', '$document', '$filter',
    function ($rootScope, Store, $location, $document, $filter) {
    return {
      restrict: 'AE',
      replace: true,
      templateUrl: 'xviews/review/directives/contextSwitcher.html',
      link: function(scope, elem, attrs) {
        scope.showEntityList = false;

        var sortedEntities = [];

        scope.toggleContextMenu = function() {
          $rootScope.toggleMenu('context');
        };

        scope.entities = function() {

          if (!Store.getIsSortDirty()) {
            return sortedEntities;
          }

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
              parentEntitiesList.push(e.parent);
            }
          });
          parentEntitiesList = _.uniq(parentEntitiesList, function(e) { return e.id; })

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

          return sortedEntities;
        };

        scope.activeEntity = function() {
          return Store.getActiveEntity();
        };

        scope.isEntityAccessible = function(entity) {
          return !Store.hasAccessToEntity(entity);
        };

        scope.entityCount = function() {
          return Store.getEntities().length;
        };

        scope.updateEntitySelect = function(selectedEntity) {
          if (!Store.hasAccessToEntity(selectedEntity)) {
            return;
          }

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
;
