(function () {
  'use strict';

  angular.module('app')
    .controller('PlayerController', function ($rootScope, $scope, $location, Dialog, SwissSystem, ScoreService) {
      var T = $rootScope.globals;

      $scope.focusInput = false;
      $scope.btnText = T.ongoing ? 'Zurück zum Turnier' : 'Turnier starten';
      $scope.isFairForAll = false;

      $scope.newPlayer = {};

      $scope.validateInput = function () {
        return !($scope.newPlayer.name && $scope.newPlayer.name.split(' ').join('') !== '');
      }

      function addPlayer() {
        for (var i = 0; i < T.teamList.length; i++) {
          if (T.teamList[i].name.toLowerCase() === $scope.newPlayer.name.toLowerCase()) {
            return false;
          }
        }
        T.teamList.push({
          name: $scope.newPlayer.name,
          points: 0,
          matches: 0
        });
        $scope.newPlayer.name = null;
        return true;
      }

      $scope.add = function () {
        if (!addPlayer()) {
          Dialog.alert({
            title: 'Spieler schon vorhanden',
            body: 'Der Spieler ' + $scope.newPlayer.name + ' ist bereits vorhanden!'
          });
        }
        $scope.focusInput = true;
      };

      function removePlayer(idx) {
        var team = T.teamList[idx];
        if (T.ongoing && !T.koRound) {
          for (var i = 0; i < T.currentMatches; i++) {
            if (T.currentMatches[i] !== null) {
              var match = T.currentMatches[i];
              if (match.team1.name === team.name) {
                SwissSystem.enterScore(i, '0:2');
              }
              if (match.team2.name === team.name) {
                SwissSystem.enterScore(i, '2:0')
              }
            }
          }
          for (var j = 0; j < T.nextMatches; j++) {
            var match = T.nextMatches[j];
            if (match.team1.name === team.name) {
              T.playedMatches.push(match);
              ScoreService.reenterScore(match, '0:2');
              T.nextMatches.splice(j, 1);
              break;
            }
            if (match.team2.name == team.name) {
              T.playedMatches.push(match);
              ScoreService.reenterScore(match, '2:0');
              T.nextMatches.splice(j, 1);
              break;
            }
          }
          T.teamList.splice(idx, 1);
        }
        if (T.ongoing && T.koRound) {
          console.debug('set team out');
        }
        if (!T.ongoing) {
          T.teamList.splice(idx, 1);
        }
      }

      $scope.remove = function (idx) {
        var team = T.teamList[idx];
        if (team) {
          Dialog.confirm({
            title: 'Spieler entfernen?',
            body: 'Den Spieler ' + team.name + ' löschen?',
            confirm: 'Ja',
            cancel: 'Nein'
          }).result.then(function (result) {
            if (result === 1)
              removePlayer(idx);
            //T.teamList.splice(idx, 1);
          });
        }
        $scope.focusInput = true;
      };

      $scope.start = function () {
        if (!T.ongoing) {
          T.ongoing = true;
        }
        $location.path('tournament');
      };

      if (T.teamList.length === 0) {
        for (var i = 0; i < 8; i++) {
          T.teamList.push({
            name: 'Player ' + (i + 1),
            points: 0,
            matches: 0
          });
        }
      }
    });
})();