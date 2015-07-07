(function () {
  'use strict';

  angular.module('kTourmentController', [])

  .controller('TourmentController', function ($scope, $location, dialogs, Tourment) {

    var self = this,
      currentTab = 0;

    $scope.isLastRound = false;

    $scope.toggleLastRound = function () {
      $scope.isLastRound = !$scope.isLastRound;
      Tourment.setLastPreRound($scope.isLastRound);
    }

    $scope.add = function () {
      $location.path('insert');
    };

    $scope.addDisabled = function () {
      return Tourment.canAddParticipant();
    };

    $scope.isTab = function (tab) {
      return currentTab == tab;
    };

    $scope.setTab = function (tab) {
      if (tab == 1 && !$scope.isKoRound()) {
        dialogs.confirm('K.O. Runde starten',
                        'Soll die K.O. Runde gestartet werden?<br/>Danach kann nicht mehr zur Vorrunde zurück gewechselt werden!',
                        { size: 'md' })
        .result.then(function () {
          Tourment.startKoRound();
          currentTab = tab;
        });
      }
      else if (!($scope.isKoRound() && tab == 0)) {
        currentTab = tab;
      }
    };

    $scope.showReenterScore = function (idx) {
      return Tourment.canReenterScore(idx);
    };

    $scope.getTables = function () {
      return Tourment.getTables();
    };

    $scope.getRanking = function () {
      return Tourment.getRanking();
    };

    $scope.getNextMatches = function () {
      return Tourment.getNextMatches();
    };

    $scope.getPlayedMatches = function () {
      return Tourment.getPlayedMatches();
    };

    $scope.insertScore = function (tableIdx) {
      var m = Tourment.getTable(tableIdx);
      if (m != null) {
        dialogs.create('templates/result_dialog.html',
                       'InsertResultDialogController',
                       { home: m.getHome().getName(),
                         away: m.getAway().getName(),
                         isKoRound: $scope.isKoRound()
                       },
                       { size: 'md' })
        .result.then(function (score) {
          Tourment.setScoreOnTable(tableIdx, score);
        });
      }
    };

    $scope.deferMatch = function (tableIdx) {
      if ($scope.canDeferMatch(tableIdx)) {
      dialogs.confirm('Spiel zurückstellen',
                      'Soll das Spielan Tisch ' + (tableIdx + 1)
                      + ' zurückgestellt werden?',
                      { size: 'sm' })
      .result.then(function () {
        Tourment.deferMatch(tableIdx);
      });
    }
    };

    $scope.isKoRound = function () {
      return Tourment.isKoRound();
    };

    $scope.canDeferMatch = function (tableIdx) {
      return Tourment.canDeferMatch(tableIdx);
    };

    $scope.modus = Tourment.getModus();


    $scope.reenterScore = function (idx) {
      var match = Tourment.getPlayedMatches()[idx];
      if (match != null) {
        dialogs.create('templates/result_dialog.html',
                       'InsertResultDialogController',
                       { home: match.getHome().getName(),
                         away: match.getAway().getName(),
                         isKoRound: match.getRound() < 0},
                       { size: 'md' })
        .result.then(function (score) {
          Tourment.reenterScore(match, score);
        });
      }
    };

  })

  .controller('InsertResultDialogController', function ($scope, $modalInstance, data) {
    $scope.head = data.head;
    $scope.home = data.home;
    $scope.away = data.away;
    $scope.isKoRound = data.isKoRound;

    $scope.saveResult = function (idx) {
      $modalInstance.close((WINNER_HOME + idx));
    };
    $scope.cancel = function () {
      $modalInstance.dismiss();
    };
  });
})();
