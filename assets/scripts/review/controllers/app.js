'use strict';

module.exports = angular.module('Review')
  .controller('AppCtrl', ['$scope', 'Store',
    function ($scope, Store) {

      $scope.AppState = {
        newQuestion: false
      };

      $scope.toggleCreateQuestionDialog = function(toggleValue) {
        $scope.AppState.newQuestion = toggleValue || !$scope.AppState.newQuestion;
      };

    }]);
