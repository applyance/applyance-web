'use strict';

angular.module('ApplyanceApp')
  .controller('EntityUnitsCtrl', ['$scope', 'ApplyanceAPI', 'Me', 'Context',
    function ($scope, ApplyanceAPI, Me, Context) {

      $scope.entity = Me.getEntity(Context.getId());

      $scope.units = [];
      ApplyanceAPI.getUnits($scope.entity.id).then(function(units) {
         $scope.units = units;
      });

      $scope.isEditing = function(unit) {
        return !!unit.isEditing;
      }

      $scope.removeUnit = function(unit) {
        ApplyanceAPI.deleteUnit(unit.id).then(function() {
          $scope.units.splice($scope.units.indexOf(unit), 1);
        });
      }

      $scope.triggerEdit = function(unit) {
        unit.isEditing = true;
        $scope.$broadcast('isEditingUnit-' + unit.id);
      }

      $scope.updateUnit = function(unit) {
        unit.isEditing = false;
        ApplyanceAPI.putUnit({
          id: unit.id,
          name: unit.name
        });
      }

      $scope.addUnit = function() {
        ApplyanceAPI.postUnit($scope.entity.id, {
          name: "New Unit"
        }).then(function(unit) {
          unit.isEditing = true;
          $scope.units.push(unit);
          _.defer(function() {
            $scope.$broadcast('isEditingUnit-' + unit.id);
          });
        });
      }

    }]);
