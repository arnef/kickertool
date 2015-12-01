(function () {
  'use strict';

  angular.module('app')

  .controller('TournamentController', function ($rootScope, $scope, $location, Dialog, SwissSystem, Ko, ScoreService) {
    var _self, _currentTab, T, _modus;

    _self = this;
    _currentTab = 0;
    T = $rootScope.globals;
    if (T.koRound) {
      _modus = Ko;
    } else {
      _modus = SwissSystem;
    }
    $scope.isLastRound = T.lastRound === T.round;

    function fillTables(idx) {
      if (T.nextMatches.length === 0) {
        return;
      }
      if (idx !== undefined) {
        T.currentMatches[idx] = T.nextMatches[0];
        T.nextMatches.splice(0, 1);
        if (T.currentMatches[idx].team2.ghost) {
          _modus.enterScore(idx, '2:0', fillTables);
        }
      } else {
        for (var i = 0; i < T.currentMatches.length; i++) {
          if (T.currentMatches[i] == null) {
            T.currentMatches[i] = T.nextMatches[0];
            T.nextMatches.splice(0, 1);
          }
          if (T.currentMatches[i].team2.ghost) {
            _modus.enterScore(i, '2:0', fillTables);
          }
        }
      }
    }
    if (T.round == 0) {
      _modus.nextRound();

    }
    fillTables();



    $scope.toggleLastRound = function () {
      $scope.isLastRound = !$scope.isLastRound;
      if ($scope.isLastRound) {
        T.lastRound = T.round;
      } else {
        T.lastRound = T.teamList.length / 2;
      }
    }

    $scope.add = function () {
      switch (T.modus) {
      case 200:
        $location.path('playerDyp');
        break;
      case 201:
        $location.path('player');
        break;
      case 202:
        $location.path('team');
        break;
      }
    };

    $scope.addDisabled = function () {
      return T.round > 1 || T.koRound;
    };

    $scope.isTab = function (tab) {
      return _currentTab == tab;
    };

    $scope.setTab = function (tab) {
      if (tab == 1 && !T.koRound) {
        Dialog.confirm({
          title: 'K.o. Runde starten',
          body: 'Soll die K.o. Runde gestartet werden?<br>Dannach kann nicht mehr zu Vorrunde zurück gewechselt werden!',
          confirm: 'Ja',
          cancel: 'Nein'
        }).result.then(function (result) {
          if (result === 1) {
            // start ko round
            T.koRound = true;
            if (T.nextMatches.length > 0) {
              T.nextMatches = [];
            }
            for (var i = 0; i < T.currentMatches.length; i++) {
              T.currentMatches[i] = null;
            }
            _modus = Ko;
            console.debug('start ko round');
            _modus.start();
            fillTables();
            _currentTab = tab;
          }
        });
      } else if (!(T.koRound && tab == 0)) {
        _currentTab = tab;
      }
    };

    $scope.showReenterScore = function (idx) {
      return !T.koRound && T.playedMatches[idx].round === T.round;
    };

    $scope.insertScore = function (idx) {
      var match = T.currentMatches[idx];
      if (match !== null) {
        Dialog.score(
          match.team1.name,
          match.team2.name
        ).result.then(function (score) {
          _modus.enterScore(idx, score, fillTables);
        });
      }
    };

    $scope.deferMatch = function (tableIdx) {
      if ($scope.canDeferMatch(tableIdx)) {
        Dialog.confirm({
            title: 'Spiel zurückstellen',
            body: 'Soll das Spiel an Tisch ' + (tableIdx + 1) + ' zurückgestellt werden?',
            cancel: 'Nein',
            confirm: 'Ja'
          })
          .result.then(function (result) {
            if (result === 1) {
              var match = T.currentMatches[tableIdx];
              T.nextMatches.push(match);
              T.currentMatches[tableIdx] = null;
              fillTables(tableIdx);
            }
          });
      }
    };
    $scope.disableInsertScore = function (idx) {
      return T.currentMatches[idx] == null;
    };

    $scope.canDeferMatch = function (tableIdx) {
      var match = T.currentMatches[tableIdx];
      return match !== null && T.nextMatches.length > 0 && (T.koRound || match.round == T.round);
    };


    $scope.reenterScore = function (idx) {
      if ($scope.showReenterScore(idx)) {
        var match = T.playedMatches[idx];
        if (match != null) {
          Dialog.score(
            match.team1.name,
            match.team2.name
          ).result.then(function (score) {
            ScoreService.reenterScore(match, score);
          });
        }
      }
    };

  });
})();