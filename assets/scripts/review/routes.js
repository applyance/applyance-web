module.exports = function($routeProvider, $locationProvider, me, $routeParams) {

  var hasApplicantListFeature = !!_.find(me.reviewers[0].entity.customer.plan.features, function(feature) {
    return feature.name == 'applicantList';
  });

  //
  // Reusable Route Configurations
  //

  var settingsRoute = {
    templateUrl: 'views/review/settings/settings.html',
    controller: 'SettingsCtrl'
  };

  var spotSettingsRoute = {
    templateUrl: 'views/review/spots/settings.html',
    controller: 'SpotSettingsCtrl',
    resolve: {
      spot: function($route, ApplyanceAPI) {
        return ApplyanceAPI.getSpot($route.current.params.id).then(function(spot) {
          return spot.plain();
        });
      }
    }
  };

  //
  // Route Configuration
  //

  $routeProvider
    .when('/accounts/:id/settings', {
      templateUrl: 'views/review/settings/account.html',
      controller: 'AccountSettingsCtrl'
    })

    // Applications
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

    // Spots
    .when('/entities/:id/spots', {
      controller: 'SpotsCtrl',
      templateUrl: 'views/review/spots/spots.html'
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

    // Spot Settings
    .when('/spots/:id/settings', spotSettingsRoute)
    .when('/spots/:id/blueprints', spotSettingsRoute)

    // Entity Settings
    .when('/entities/:id/settings', settingsRoute)
    .when('/entities/:id/entities', settingsRoute)
    .when('/entities/:id/reviewers', settingsRoute)
    .when('/entities/:id/blueprints', settingsRoute)
    .when('/entities/:id/labels', settingsRoute)
    .when('/entities/:id/billing', settingsRoute)
    .when('/entities/:id/billing/plan', settingsRoute)
    .when('/entities/:id/billing/card', settingsRoute)

    .otherwise({
      redirectTo: '/entities/' + me.reviewers[0].entity.id + '/' + (hasApplicantListFeature ? 'applications' : 'spots')
    });

  $locationProvider.html5Mode(true);

};
