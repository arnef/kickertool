Array.prototype.shuffle = function () {
  'use strict';

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
      'angular-loading-bar'
    ])
    .factory('K', function ($rootScope) {
      return $rootScope.K;
    })
    .controller('NavController', function ($rootScope, $location, $window, K) {
      this.active = function (idx) {
        switch (idx) {
        case 0:
          return $location.path() === '/';
        case 1:
          return $location.path() === '/insert' || $location.path() === '/playerDyp' || $location.path() === '/team';
        case 2:
          return $location.path() === '/tournament';
        }
        return false;
      };

      this.close = function () {
        try {
        var gui = require('nw.gui');
        gui.Window.get().close(true);
      } catch (e) {

      }
    };



    this.version = 'v ' + require('../package.json').version;
    })
    .run(function ($rootScope, $localStorage, $location, Dialog) {
      require('electron').ipcRenderer.on('command', function (event, cmd) {
        cmd = cmd.split('.');
        console.log(event, cmd);
        if (cmd[0] == 'path') {
          console.log('change location ' + cmd[1]);
          $location.path(cmd[1]);
          $rootScope.$apply(); // service dafür, wie bei socket.io
        }
        if (cmd[0] == 'cmd') {
          if (cmd[1] == 'newTournament') {
            clearData();
            $location.path('/');
            $rootScope.$apply();
          }
        }
      });
      // define global const
      $rootScope.K = {};
      $rootScope.K.FAIR_FOR_ALL = 200;
      $rootScope.K.ONE_ON_ONE = 201;
      $rootScope.K.TWO_ON_TWO = 202;
      $rootScope.K.NAME = {};
      $rootScope.K.NAME[$rootScope.K.FAIR_FOR_ALL] = 'Fair for all Dyp';
      $rootScope.K.NAME[$rootScope.K.ONE_ON_ONE] = 'Einzel';
      $rootScope.K.NAME[$rootScope.K.TWO_ON_TWO] = 'Offenes Doppel';

      // load data
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
        T.teamListOut = [];
        T.ongoing = false;
        T.currentTab = 0;
        T.globalPlayerList = [];
      }

      function updateCurrentMaches(team) {
        for (var i = 0; i < T.currentMatches.length; i++) {
          var match = T.currentMatches[i];
          if (match != null) {
            if (team.name == match.team1.name)
              match.team1 = team;
            if (team.name == match.team2.name)
              match.team2 = team;
          }
        }
      }

      function updateNextMatches(team) {
        for (var i = 0; i < T.nextMatches.length; i++) {
          var match = T.nextMatches[i];
          if (team.name == match.team1.name)
            match.team1 = team;
          if (team.name == match.team2.name)
            match.team2 = team;
        }
      }

      function updatePlayedMatches(team) {
        for (var i = 0; i < T.playedMatches.length; i++) {
          var m = T.playedMatches[i];
          if (team.name == m.team1.name)
            m.team1 = team;
          if (team.name == m.team2.name)
            m.team2 = team;
        }
      }

      function updateFinals(team) {
        for (var i = 0; i < T.finals.length; i++) {
          var m = T.finals[i];
          if (m.team1 && team.name == m.team1.name)
            m.team1 = team;
          if (m.team2 && team.name == m.team2.name)
            m.team2 = team;
        }
      }

      function restoreData() {
        for (var i = 0; i < T.teamList.length; i++) {
          var t = T.teamList[i];
          updateCurrentMaches(t);
          updateNextMatches(t);
          updatePlayedMatches(t);
          updateFinals(t);
        }
      }
      if (!T.tables) {
        clearData();
        $location.path('/');
      } else if (T.ongoing && !(T.playedMatches.length > 0 && T.playedMatches[T.playedMatches.length - 1].round === 'Finale')) {
        Dialog.confirm({
          title: 'Turnierdaten vorhanden',
          body: 'Es wurden vorhandene Daten eines laufenden Turniers gefunden. ' +
            'Sollten diese wiederhergestellt werden ? ',
          cancel: 'Nein, neues Turnier starten',
          confirm: 'Ja, Turnier fortsetzen'
        }).then(function (result) {
          if (result === 0) {
            clearData();
            $location.path('/');
          } else {
            restoreData();
            $location.path('tournament');
          }
        })
      } else {
        clearData();
        if ($location.path() !== '/insert')
          $location.path('/');
      }
    })
    .config(function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'templates/start.view.html',
          controller: 'StartController'
        })
        .when('/insert', {
          templateUrl: 'templates/insert.view.html',
          controller: 'InsertController'
        })
        .when('/tournament', {
          templateUrl: 'templates/tournament.view.html',
          controller: 'TournamentController'
        })
        .when('/player', {
          templateUrl: '/templates/player.view.html',
          controller: 'PlayerController'
        });
    });

})();
