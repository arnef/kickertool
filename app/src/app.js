'use strict';

angular.module('app', ['ngRoute', 'ngSanitize', 'ngStorage', 'ui.bootstrap', 'luegg.directives', 'templates-app'])
  .run(function ($rootScope, $localStorage, $location, Dialog, Tournament) {
    // define global const
    $rootScope.FAIR_FOR_ALL = 200;
    $rootScope.ONE_ON_ONE = 201;
    $rootScope.SINGLES = 201;
    $rootScope.DOUBLES = 202;
    $rootScope.TWO_ON_TWO = 202;
    $rootScope.NAME = {};
    $rootScope.NAME[$rootScope.FAIR_FOR_ALL] = 'Fair for all DYP';
    $rootScope.NAME[$rootScope.ONE_ON_ONE] = 'Einzel / Goalie';
    $rootScope.NAME[$rootScope.TWO_ON_TWO] = 'Offenes Doppel';

    // load data
    $rootScope.globals = $localStorage;

    function updateCurrentMaches(team) {
      var i, match;
      if (!$rootScope.globals.currentMatches) {
        return;
      }
      for (i = 0; i < $rootScope.globals.currentMatches.length; i++) {
        match = $rootScope.globals.currentMatches[i];
        if (match != null) {
          if (team.name == match.team1.name) {
            match.team1 = team;
          }
          if (team.name == match.team2.name) {
            match.team2 = team;
          }
        }
      }
    }

    function updateNextMatches(team) {
      var i, match;
      if (!$rootScope.globals.nextMatches) {
        return;
      }
      for (i = 0; i < $rootScope.globals.nextMatches.length; i++) {
        match = $rootScope.globals.nextMatches[i];
        if (team.name == match.team1.name) {
          match.team1 = team;
        }
        if (team.name == match.team2.name) {
          match.team2 = team;
        }
      }
    }

    function updatePlayedMatches(team) {
      var i, m;
      if (!$rootScope.globals.playedMatches) {
        return;
      }
      for (i = 0; i < $rootScope.globals.playedMatches.length; i++) {
        m = $rootScope.globals.playedMatches[i];
        if (team.name == m.team1.name) {
          m.team1 = team;
        }
        if (team.name == m.team2.name) {
          m.team2 = team;
        }
      }
    }

    function updateFinals(team) {
      var i, m;
      // nothing to update if no finals are running
      if (!$rootScope.globals.finals) {
        return;
      }
      for (i = 0; i < $rootScope.globals.finals.length; i++) {
        m = $rootScope.globals.finals[i];
        if (m.team1 && team.name == m.team1.name) {
          m.team1 = team;
        }
        if (m.team2 && team.name == m.team2.name) {
          m.team2 = team;
        }
      }
    }

    function restoreData() {
      var i, t;
      for (i = 0; i < $rootScope.globals.teamList.length; i++) {
        t = $rootScope.globals.teamList[i];
        updateCurrentMaches(t);
        updateNextMatches(t);
        updatePlayedMatches(t);
        updateFinals(t);
      }
    }

    function init() {
      $rootScope.globals.nextMatches = [];
      $rootScope.globals.playedMatches = [];
      $rootScope.globals.currentMatches = [];
      if ($rootScope.globals.tables) {
        $rootScope.globals.currentMatches.length = $rootScope.globals.tables;
      }
      $rootScope.globals.round = 0;
      $rootScope.globals.koRound = false;
      $rootScope.globals.playerList = [];
      $rootScope.globals.teamList = [];
      $rootScope.globals.teamListOut = [];
      $rootScope.globals.ongoing = false;
      $rootScope.globals.currentTab = 0;
    }

    if (!$rootScope.globals.tables) {
      init();
      $location.path('/');
    } else if ($rootScope.globals.ongoing && !($rootScope.globals.playedMatches.length > 0 && $rootScope.globals.playedMatches[$rootScope.globals.playedMatches.length - 1].round === 'Finale')) {
      Dialog.confirm({
        title: 'Turnierdaten vorhanden',
        body: 'Es wurden vorhandene Daten eines laufenden Turniers gefunden. ' +
          'Sollten diese wiederhergestellt werden ? ',
        cancel: 'Nein, neues Turnier starten',
        confirm: 'Ja, Turnier fortsetzen'
      }).then(function (result) {
        if (result === 0) {
          Tournament.clear();
          $location.path('/');
        } else {
          restoreData();
          $location.path('tournament');
        }
      });
    } else {
      Tournament.clear();
      if ($location.path() !== '/insert') {
        $location.path('/');
      }
    }
  })
  // menu
  .run(function ($rootScope, $location, Command, Tournament) {

    Command.on('path', function (event, path) {
      $location.path(path);
    });
    Command.on('tournament', function (event, cmd) {
      if (cmd == 'new') {
        Tournament.clear();
        $location.path('/');
      }
      if (cmd == 'lastRound') {
        Tournament.toogleLastRound();
      }
    });
    Command.on('setTab', function (event, cmd) {
      cmd = cmd == 0 && $rootScope.globals.koRound ? 1 : cmd;
      $rootScope.globals.currentTab = cmd;
      if ($location.path() !== '/tournament') {
        $location.path('/tournament');
      }
    });
  });
