'use strict';

angular.module('Review')
  .controller('EntitySettingsCtrl', ['$scope', '$routeParams', 'ApplyanceAPI', 'Me', 'Context', '$timeout',
    function ($scope, $routeParams, ApplyanceAPI, Me, Context, $timeout) {

      ApplyanceAPI.getEntity(Context.getId()).then(function(entity) {
        $scope.entity = entity.plain();

        if ($scope.entity.location) {
          var a = $scope.entity.location.address;
          $scope.address = a.address_1 + "\n" + a.city + ", " + a.state + " " + a.postal_code;
        }
      });

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

      $scope.startUpdateEntity = function() {

        if (!$scope.entity.fileObj) {
          $scope.updateEntity();
          return;
        }

        ApplyanceAPI.uploadAttachment($scope.entity.fileObj,
          $scope.entity.fileObj.type).then(
          function(r) {
            $scope.updateEntity({
              name: $scope.entity.fileObj.name,
              token: r.data.token
            });
          },
          function(r) {
            console.log("failed to upload logo");
            console.log(r);
          }
        );

      };

      $scope.updateEntity = function(logo) {

        var entity = {
          id: $scope.entity.id,
          name: $scope.entity.name
        };

        if (logo) {
          entity.logo = logo;
        }

        if ($scope.hasAddressChanged) {
          entity.location = {
            address: $scope.address
          };
        }

        ApplyanceAPI.putEntity(entity).then(
          function(r) {
            console.log("updated entity");
            console.log(r);
          },
          function(r) {
            console.log("failed to update entity");
            console.log(r);
          }
        );
      };

    }]);
