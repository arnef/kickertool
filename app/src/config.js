(function () {
  'use strict';

  angular.module('app')
    .config(KickertoolConfig);

  KickertoolConfig.$inject = ['$routeProvider'];

  function KickertoolConfig($routeProvider) {
    $routeProvider
      .when('/settings', {
        templateUrl: 'kickertool-tpls/settings.view.html',
        controller: 'SettingsController',
        controllerAs: 'settingsCtrl'
      })
      .when('/insert', {
        templateUrl: 'kickertool-tpls/insert.view.html',
        controller: 'InsertController'
      })
      .when('/tournament', {
        templateUrl: 'kickertool-tpls/tournament.view.html',
        controller: 'TournamentController'
      })
      .otherwise({
        redirectTo: '/settings'
      });
  }
})();
