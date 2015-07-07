(function () {
  'use strict';

  angular.module('kInsertController', [])

  .controller('InsertController', function ($scope, $location, dialogs,  Tourment) {

    $scope.TYPES = [
      { name: 'Gesetzt', value: PRO },
      { name: 'Gelost', value: AMATEUR }
    ];

    $scope.POSITIONS = [
      { name: 'Torwart/Stürmer', value: BOTH },
      { name: 'Torwart', value: GOALIE },
      { name: 'Stürmer', value: STRIKER }
    ];

    $scope.newPlayer = {
      type: PRO,
      position: BOTH
    };

    $scope.isFairForAll = Tourment.getModus() == FAIR_FOR_ALL;

    var validatePlayer = function (p) {
      return p != null && p.name != null && p.name.split(' ').join('') != '';
    };

    $scope.validateInput = function () {
      if (Tourment.getModus() == TWO_ON_TWO) {
        return !(validatePlayer($scope.newPlayer1)
                 && validatePlayer($scope.newPlayer2));
      } else {
        return !validatePlayer($scope.newPlayer);
      }
    };

    var s1 = Tourment.getModus() == TWO_ON_TWO ?
            'Team' : 'Spieler';
    $scope.header = Tourment.getModus() == ONE_ON_ONE ?
            'Spieler' : 'Teams';


    $scope.add = function () {
      var p = null;
      if (Tourment.getModus() == TWO_ON_TWO) {
        p = new Team(
          new Player($scope.newPlayer1.name),
          new Player($scope.newPlayer2.name));
      } else {
        p = new Player($scope.newPlayer.name,
                       $scope.newPlayer.position,
                       $scope.newPlayer.type);
      }
      if (Tourment.addParticipant(p)) {
        $scope.newPlayer.name = null;
        $scope.newPlayer1 = null;
        $scope.newPlayer2 = null;
        $scope.focusInput = true;
      } else {
        dialogs.error(
          s1 +  ' schon vorhanden',
          s1 + ' "' + p.getName() + '" ist schon angemeldet.',
          { size: 'sm' })
        .result.then(function () {
          $scope.focusInput = true;
        });
      }

    };


    $scope.remove = function (idx) {
      dialogs.confirm(
        s1 + ' löschen?',
        s1 + ' "' + Tourment.getParticipant(idx).getName() + '" löschen?',
        { size: 'sm' })
      .result.then(function () {
        Tourment.removeParticipant(idx);
      });
    };

    $scope.getPlayer = function () {
      return Tourment.getParticipants();
    };


    $scope.disabledDraw = function () {
      return !(Tourment.getParticipants().length > 0
              && Tourment.getParticipants().length % 2 == 0);
    };

    $scope.getTeams = function () {
      return Tourment.getRanking();
    }

    $scope.createTeams = function () {
      Tourment.drawTeams();
    };

    $scope.start = function () {
      Tourment.start();
      $location.path('tourment');
    };

    $scope.focusInput = true;
  });

})();
