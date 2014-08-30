'use strict';

module.exports = angular.module('Review')
  .controller('EntitySettingsCtrl', ['$scope', '$rootScope', 'flash', 'ApplyanceAPI', 'Store', '$timeout',
    function ($scope, $rootScope, flash, ApplyanceAPI, Store, $timeout) {

      $scope.flash = flash;
      $scope.address = {
        field: ""
      };

      $scope.e = angular.copy(Store.getActiveEntity());

      if ($scope.e.location) {
        var a = $scope.e.location.address;
        $scope.address.field = a.address_1 + "\n" + a.city + ", " + a.state + " " + a.postal_code;
      }

      if ($scope.e.logo) {
        $scope.e.attachment = {
          url: $scope.e.logo.url
        };
      }

      $scope.hasAddressChanged = false;
      $scope.addressChange = function() {
        $scope.hasAddressChanged = true;
      }

      $scope.clickChoose = function() {
        $timeout(function() {
          var logo = document.querySelectorAll('#logo');
          var event = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
          });
          logo[0].dispatchEvent(event);
        }, 100);
      }

      $scope.isUpdating = false;
      $scope.startUpdateEntity = function() {
        $scope.isUpdating = true;
        if (!$scope.e.fileObj) {
          $scope.updateEntity();
          return;
        }
        ApplyanceAPI.uploadAttachment(
          $scope.e.fileObj,
          $scope.e.fileObj.type)
          .then($scope.onUploadAttachment);
      };

      $scope.onUploadAttachment = function(attachment) {
        $scope.updateEntity({
          name: $scope.e.fileObj.name,
          token: attachment.data.token
        });
      };

      $scope.updateEntity = function(logo) {
        var entity = {
          id: $scope.e.id,
          name: $scope.e.name
        };
        if (logo) {
          entity.logo = logo;
        }
        if ($scope.hasAddressChanged) {
          entity.location = {
            address: $scope.address.field
          };
        }
        ApplyanceAPI.putEntity(entity).then($scope.onUpdateEntity);
      };

      $scope.onUpdateEntity = function(entity) {
        $scope.isUpdating = false;
        Store.setEntity(entity.data);
        $scope.flash.setMessage("Settings updated successfully.");
        $rootScope.$broadcast('flash');
      };

    }]);
