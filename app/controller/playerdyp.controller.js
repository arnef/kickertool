(function () {
  'use strict';

  angular.module('app')
    .controller('PlayerDypController', function ($rootScope, $scope, $location, TeamDrawer, Dialog) {
      var T = $rootScope.globals;
      $scope.focusInput = true;
      $scope.btnText = T.ongoing ? 'Zurück zum Turnier' : 'Turnier starten';

      $scope.TYPES = [
        {
          name: 'Gesetzt',
          value: TeamDrawer.PRO
      },
        {
          name: 'Gelost',
          value: TeamDrawer.AMATEUR
      }];
      $scope.POSITIONS = [
        {
          name: 'Torwart/Stürmer',
          value: TeamDrawer.BOTH
      },
        {
          name: 'Torwart',
          value: TeamDrawer.GOALIE
      },
        {
          name: 'Stürmer',
          value: TeamDrawer.STRIKER
      }];

      $scope.newPlayer = {
        type: TeamDrawer.PRO,
        position: TeamDrawer.BOTH
      };

      $scope.validateInput = function () {
        return !($scope.newPlayer && $scope.newPlayer.name && $scope.newPlayer.name.split(' ').join('') !== '');
      }

      function addPlayer() {
        for (var i = 0; i < T.playerList.length; i++) {
          if (T.playerList[i].name.toLowerCase() === $scope.newPlayer.name.toLowerCase()) {
            return false;
          }
        }
        T.playerList.push(angular.copy($scope.newPlayer));
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

      $scope.disabledDraw = function () {
        return !(T.playerList.length > 0 && T.playerList.length % 2 === 0);
      };

      $scope.remove = function (idx) {
        var player = T.playerList[idx];
        if (player) {
          Dialog.confirm({
            title: 'Spieler entfernen?',
            body: 'Den Spieler ' + player.name + ' löschen?',
            confirm: 'Ja',
            cancel: 'Nein'
          }).result.then(function (result) {
            if (result === 1) {
              T.playerList.splice(idx, 1);
            }

          });
        }
        $scope.focusInput = true;
      };

      $scope.createTeams = function () {
        T.teamList = TeamDrawer.draw(T.playerList);
      };

      $scope.start = function () {
        if (!T.ongoing) {
          T.ongoing = true;
          //SwissSystem.nextRound();
        }
        $location.path('tournament');
      }
    });
})();