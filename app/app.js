Array.prototype.shuffle = function () {
  var m = this.length,
    t, i;

  while (m) {
    i = Math.floor(Math.random() * m--);
    t = this[m];
    this[m] = this[i];
    this[i] = t;
  }

  return this;
};

(function () {
  'use strict';

  angular.module('app', [
    'ngRoute',
    'ngSanitize',
    'ngStorage',
    'ui.bootstrap',
    'luegg.directives',
    'angular-loading-bar',
    'kUpdateService'
    ])
    .factory('K', function ($rootScope) {
      $rootScope.K = {};
      $rootScope.K.FAIR_FOR_ALL = 200;
      $rootScope.K.ONE_ON_ONE = 201;
      $rootScope.K.TWO_ON_TWO = 202;
      $rootScope.K.NAME = {};
      $rootScope.K.NAME[$rootScope.K.FAIR_FOR_ALL] = 'Fair for all Dyp';
      $rootScope.K.NAME[$rootScope.K.ONE_ON_ONE] = 'Einzel';
      $rootScope.K.NAME[$rootScope.K.TWO_ON_TWO] = 'Offenes Doppel';
      return $rootScope.K;
    })
    .run(function ($rootScope, $localStorage, $location, Dialog) {
      $rootScope.globals = $localStorage;
      var T = $rootScope.globals;

      function clearData() {
        T.nextMatches = [];
        T.playedMatches = [];
        T.currentMatches = new Array(T.tables);
        T.round = 0;
        T.koRound = false;
        T.playerList = [];
        T.teamList = [];
        T.ongoing = false;
      }
      if (!T.tables) {
        clearData();
        $location.path('/');
      } else if (T.ongoing && !(T.playedMatches.length > 0 && T.playedMatches[T.playedMatches.length - 1].round === 'Finale')) {
        Dialog.confirm({
          title: 'Turnierdaten vorhanden',
          body: 'Es wurden vorhandene Daten eines laufenden Turniers gefunden. Sollten diese wiederhergestellt werden?',
          cancel: 'Nein, neues Turnier starten',
          confirm: 'Ja, Turnier fortsetzen'
        }).result.then(function (result) {
          if (result === 0) {
            clearData();
            $location.path('/');
          } else {
            $location.path('tournament');
          }
        })
      } else {
        clearData();
        $location.path('/');
      }
    })
    .config(function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'templates/start.view.html',
          controller: 'StartController'
        })
        .when('/player', {
          templateUrl: 'templates/insert.view.html',
          controller: 'PlayerController'
        })
        .when('/playerDyp', {
          templateUrl: 'templates/insert_dyp.view.html',
          controller: 'PlayerDypController'
        })
        .when('/team', {
          templateUrl: 'templates/insert.view.html',
          controller: 'TeamController'
        })
        .when('/tournament', {
          templateUrl: 'templates/tournament.view.html',
          controller: 'TournamentController'
        });
    });

})();