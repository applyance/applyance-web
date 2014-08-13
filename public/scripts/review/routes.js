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
    .when('/applicants/:id', {
      templateUrl: 'views/review/applicants/applicant.html',
      controller: 'ApplicationCtrl',
      resolve: {
        citizen_data: function($route, ApplyanceAPI) {
          return ApplyanceAPI.getCitizen($route.current.params.id).then(function(citizen) {
            return ApplyanceAPI.getProfile(citizen.account.id).then(function(profile) {
              return ApplyanceAPI.getApplication(citizen.applications[citizen.applications.length - 1].id).then(function(application) {
                return {
                  application: application.plain(),
                  profile: profile.plain(),
                  citizen: citizen.plain()
                };
              });
            });
          });
        }
      }
    })

    // spots
    .when('/entities/:id/spots', {
      controller: 'SpotsCtrl',
      templateUrl: 'views/review/spots/spots.html'
    })
    .when('/spots/:id/settings', {
      templateUrl: 'views/review/spots/settings.html',
      controller: 'SpotSettingsCtrl',
      resolve: {
        spot: function($route, ApplyanceAPI) {
          return ApplyanceAPI.getSpot($route.current.params.id).then(function(spot) {
            return spot.plain();
          });
        }
      }
    })
    .when('/spots/:id/blueprints', {
      templateUrl: 'views/review/spots/settings.html',
      controller: 'SpotSettingsCtrl',
      resolve: {
        spot: function($route, ApplyanceAPI) {
          return ApplyanceAPI.getSpot($route.current.params.id).then(function(spot) {
            return spot.plain();
          });
        }
      }
    })
    .when('/spots/:id/applications', {
      templateUrl: 'views/review/spots/applications.html',
      controller: 'SpotApplicationsCtrl',
      resolve: {
        spot_data: function($route, ApplyanceAPI) {
          return ApplyanceAPI.getSpot($route.current.params.id).then(function(spot) {
            return ApplyanceAPI.getSpotCitizens($route.current.params.id).then(function(citizens) {
              return {
                citizens: citizens,
                spot: spot
              };
            });
          });
        }
      }
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
