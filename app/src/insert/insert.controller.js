(function () {
  'use strict';

  angular.module('app')
    .controller('InsertController', function ($rootScope, $scope, $location, Tournament, TeamDrawer, Dialog) {
      var T = $rootScope.globals;
      $scope.players = [{
        position: TeamDrawer.BOTH,
        type: TeamDrawer.PRO
      }];

      if (T.modus == $rootScope.TWO_ON_TWO || T.modus == $rootScope.FAIR_FOR_ALL && T.ongoing) {
        $scope.players = [{}, {}]
      }

      $scope.validateInput = function () {
        for (var i = 0; i < $scope.players.length; i++) {
          var player = $scope.players[i];
          if (!player.name || player.name.split(' ').join('') == '') return false;
        }
        return true;
      }

      $scope.focus = new Array($scope.players.length);
      $scope.focus[0] = true;

      function addDypPlayer() {
        for (var i = 0; i < T.playerList.length; i++) {
          if (T.playerList[i].name.split(' ').join('') === $scope.players[0].name.toUpperCase().split(' ').join(''))
            return false;
        }
        $scope.players[0].name = $scope.players[0].name.toUpperCase();
        T.playerList.push(angular.copy($scope.players[0]));
        delete $scope.players[0].name;
        return true;
      }

      function addPlayer() {
        for (var i = 0; i < T.teamList.length; i++) {
          if (T.teamList[i].name.split(' ').join('') === $scope.players[0].name.toUpperCase().split(' ').join(''))
            return false;
        }
        T.teamList.push({
          name: $scope.players[0].name.toUpperCase(),
          points: 0,
          matches: 0
        });
        delete $scope.players[0].name;
        return true;
      }


      function addTeam() {
        var team1 = $scope.players[0].name + ' / ' + $scope.players[1].name;
        var team2 = $scope.players[1].name + ' / ' + $scope.players[0].name;
        for (var i = 0; i < T.teamList.length; i++) {
          if (T.teamList[i].name.split(' ').join('') === team1.toUpperCase().split(' ').join('') || T.teamList[i].name.split(' ').join('') === team2.toUpperCase().split(' ').join(''))
            return false;
        }
        T.teamList.push({
          name: team1.toUpperCase(),
          points: 0,
          matches: 0
        });
        delete $scope.players[0].name;
        delete $scope.players[1].name;
        return true;
      }

      // add participant to tournament
      $scope.add = function () {
        if (T.modus == $rootScope.FAIR_FOR_ALL && !T.ongoing) {
          if (!addDypPlayer()) {
            Dialog.alert({
              title: 'Spieler schon vorhanden!',
              body: 'Der Spieler ' + $scope.players[0].name.toUpperCase() + ' ist bereits vorhanden'
            });
          }
        }
        if (T.modus == $rootScope.ONE_ON_ONE) {
          if (!addPlayer()) {
            Dialog.alert({
               title: 'Spieler schon vorhanden!',
               body: 'Der Spieler ' + $scope.players[0].name.toUpperCase() + ' ist bereits vorhanden'
            });
          }
        }
        if (T.modus == $rootScope.TWO_ON_TWO || (T.modus == $rootScope.FAIR_FOR_ALL && T.ongoing)) {
          if (!addTeam()) {
            Dialog.alert({
              title: 'Team schon vorhanden!',
              body: 'Das Team ' + ($scope.players[0].name + ' / ' + $scope.players[1].name).toUpperCase() + ' ist bereits vorhanden'
            });
          }
        }
        $scope.focus[0] = true;
      };


      $scope.createTeams = function () {
        T.teamList = TeamDrawer.draw(T.playerList);
      };


      $scope.removePlayer = function (idx) {
        if (T.ongoing) return;
        var player = T.playerList[idx];
        if (player) {
          Dialog.confirm({
            title: 'Spieler entfernen?',
            body: 'Den Spieler ' + player.name + ' löschen?',
            confirm: 'Ja',
            cancel: 'Nein'
          }).then(function (result) {
            if (result === 1)
              T.playerList.splice(idx, 1);

            $scope.focus[0] = true;
          })
        }

      };

      $scope.remove = function (idx) {
        var team = T.teamList[idx];
        if (team) {
          var title = T.modus === $rootScope.ONE_ON_ONE ? 'Spieler entfernen?' : 'Team entfernen?';
          var body = T.modus === $rootScope.ONE_ON_ONE ? 'Den Spieler ' + team.name + ' löschen?' : 'Das Team ' + team.name + ' löschen?';
          Dialog.confirm({
            title: title,
            body: body,
            confirm: 'Ja',
            cancel: 'Nein'
          }).then(function (result) {
            if (result === 1)
              Tournament.removeTeam(idx);

            $scope.focus[0] = true;
          });
        }

      };

      $scope.start = function () {
        console.log('start');
        Tournament.start();
        $location.path('tournament');
      };

      (function () {
        if (T.teamList.length > 0) return;
        for (var i = 0; i < 10; i++) {
          T.teamList.push({
            name: 'PLAYER ' + (i+1),
            points: 0,
            matches: 0
          });
        }
      });

    });
})();
