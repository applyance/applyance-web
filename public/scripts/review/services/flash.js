module.exports = angular.module('Review')
  .factory("flash", function($rootScope, $timeout) {
    var queue = [];
    $rootScope.flashMessage = "";

    $rootScope.$on("$routeChangeSuccess", function() {
      $rootScope.flashMessage = queue.shift() || "";
    });

    $rootScope.$on("flash", function() {
      $rootScope.flashMessage = queue.shift() || "";
      $timeout(function() {
        $rootScope.flashMessage = "";
      }, 4500);
    });

    return {
      setMessage: function(message) {
        queue.push(message);
      },
      getMessage: function() {
        return currentMessage;
      }
    };
  });
