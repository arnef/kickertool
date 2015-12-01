(function () {
  'use strict';

  angular.module('app')
    .controller('PlayerController', function ($rootScope, $scope, $location, Dialog, SwissSystem) {
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
              T.teamList.splice(idx, 1);
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


      for (var i = 0; i < 20; i++) {
        T.teamList.push({
          name: 'Player ' + (i + 1),
          points: 0,
          matches: 0
        });
      }
    });
})();