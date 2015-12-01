(function () {
  'use strict';

  angular.module('app')
    .controller('TeamController', function ($rootScope, $scope, $location, Dialog) {
      var T = $rootScope.globals;

      $scope.focusInput = true;
      $scope.btnText = T.ongoing ? 'Zurück zum Turnier' : 'Turnier starten';

      $scope.newPlayer1 = {};
      $scope.newPlayer2 = {};

      $scope.validateInput = function () {
        return !
          ($scope.newPlayer1.name && $scope.newPlayer1.name.split(' ').join('') !== '' &&
            $scope.newPlayer2.name && $scope.newPlayer2.name.split(' ').join('') !== '');
      };

      function addTeam() {
        var teamName1 = $scope.newPlayer1.name + ' / ' + $scope.newPlayer2.name;
        var teamName2 = $scope.newPlayer2.name + ' / ' + $scope.newPlayer1.name;
        for (var i = 0; i < T.teamList.length; i++) {
          if (
            T.teamList[i].name.toLowerCase() === teamName1.toLowerCase() ||
            T.teamList[i].name.toLowerCase() === teamName2.toLowerCase()
          )
            return false;
        }
        T.teamList.push({
          name: teamName1,
          points: 0,
          matches: 0
        });
        $scope.newPlayer1.name = null;
        $scope.newPlayer2.name = null;
        return true;
      }

      $scope.add = function () {
        if (!addTeam()) {
          Dialog.alert({
            title: 'Team schon vorhanden',
            body: 'Das Team ' + $scope.newPlayer1.name + ' / ' + $scope.newPlayer2.name + ' ist bereits vorhanden'
          });
        }
        $scope.focusInput = true;
      };


      $scope.remove = function (idx) {
        var team = T.teamList[idx];
        if (team) {
          Dialog.confirm({
            title: 'Team entfernen?',
            body: 'Das Team ' + team.name + ' löschen?',
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
          //SwissSystem.nextRound();
        }
        $location.path('tournament');
      };

    });
})();