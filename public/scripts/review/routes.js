module.exports = function($routeProvider, $locationProvider, me, $routeParams) {

  $routeProvider
    .when('/accounts/:id/settings', {
      templateUrl: 'views/review/settings/account.html',
      controller: 'AccountSettingsCtrl'
    })

    .when('/dashboard', {
      templateUrl: 'views/review/dashboard.html',
      controller: 'DashboardCtrl'
    })

    // applications
    .when('/:parent/:id/applications', {
      controller: 'ApplicationsCtrl',
      templateUrl: 'views/review/applications/applications.html'
    })
    .when('/applications/:id', {
      templateUrl: 'views/review/applications/application.html',
      controller: 'ApplicationCtrl'
    })

    // settings
    .when('/entities/:id/settings', {
      templateUrl: 'views/review/settings/settings.html',
      controller: 'SettingsCtrl',
      resolve: {
        entity: function(ApplyanceAPI, $route) {
          return ApplyanceAPI.getEntity($route.current.params.id).then(function(entity) {
            return entity.plain();
          })
        }
      }
    })
    .when('/entities/:id/entities', {
      templateUrl: 'views/review/settings/settings.html',
      controller: 'SettingsCtrl',
      resolve: {
        entity: function(ApplyanceAPI, $route) {
          return ApplyanceAPI.getEntity($route.current.params.id).then(function(entity) {
            return entity.plain();
          })
        }
      }
    })
    .when('/entities/:id/reviewers', {
      templateUrl: 'views/review/settings/settings.html',
      controller: 'SettingsCtrl',
      resolve: {
        entity: function(ApplyanceAPI, $route) {
          return ApplyanceAPI.getEntity($route.current.params.id).then(function(entity) {
            return entity.plain();
          })
        }
      }
    })
    .when('/entities/:id/blueprints', {
      templateUrl: 'views/review/settings/settings.html',
      controller: 'SettingsCtrl',
      resolve: {
        entity: function(ApplyanceAPI, $route) {
          return ApplyanceAPI.getEntity($route.current.params.id).then(function(entity) {
            return entity.plain();
          })
        }
      }
    })
    .when('/entities/:id/labels', {
      templateUrl: 'views/review/settings/settings.html',
      controller: 'SettingsCtrl',
      resolve: {
        entity: function(ApplyanceAPI, $route) {
          return ApplyanceAPI.getEntity($route.current.params.id).then(function(entity) {
            return entity.plain();
          })
        }
      }
    })

    .otherwise({
      redirectTo: '/entities/' + me.reviewers[0].entity.id + '/applications'
    });

  $locationProvider.html5Mode(true);

};
