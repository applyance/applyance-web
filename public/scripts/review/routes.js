module.exports = function($routeProvider, $locationProvider, me, $routeParams) {

  $routeProvider
    .when('/accounts/:id/settings', {
      templateUrl: 'views/review/settings/account.html',
      controller: 'AccountSettingsCtrl'
    })

    // applications
    .when('/entities/:id/applications', {
      controller: 'ApplicationsCtrl',
      templateUrl: 'views/review/applications/applications.html'
    })
    .when('/applications/:id', {
      templateUrl: 'views/review/applications/application.html',
      controller: 'ApplicationCtrl'
    })

    // spots
    .when('/entities/:id/spots', {
      controller: 'SpotsCtrl',
      templateUrl: 'views/review/spots/spots.html'
    })
    .when('/spots/:id', {
      templateUrl: 'views/review/spots/spot.html',
      controller: 'SpotCtrl'
    })

    // settings
    .when('/entities/:id/settings', {
      templateUrl: 'views/review/settings/settings.html',
      controller: 'SettingsCtrl'
    })
    .when('/entities/:id/entities', {
      templateUrl: 'views/review/settings/settings.html',
      controller: 'SettingsCtrl'
    })
    .when('/entities/:id/reviewers', {
      templateUrl: 'views/review/settings/settings.html',
      controller: 'SettingsCtrl'
    })
    .when('/entities/:id/blueprints', {
      templateUrl: 'views/review/settings/settings.html',
      controller: 'SettingsCtrl'
    })
    .when('/entities/:id/labels', {
      templateUrl: 'views/review/settings/settings.html',
      controller: 'SettingsCtrl'
    })

    .otherwise({
      redirectTo: '/entities/' + me.reviewers[0].entity.id + '/applications'
    });

  $locationProvider.html5Mode(true);

};
