(function(angular) {
  'use strict';

  angular.module('app')
    .controller('TournamentController', function($rootScope, $scope, $location, Dialog, Tournament) {
      var T,
        scores;

      T = $rootScope.globals;

      $scope.isLastRound = T.lastRound == T.round;
      $scope.scoreOpen = -1;
      scores = ['2:0', '1:1', '0:2'];

      $scope.toggleLastRound = function() {
        $scope.isLastRound = !$scope.isLastRound;
        if ($scope.isLastRound) {
          T.lastRound = T.round;
        } else {
          T.lastRound = T.teamList.length / 2;
        }
      };

      $scope.add = function() {
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

      $scope.addDisabled = function() {
        return T.round > 1 || T.koRound;
      };

      $scope.isTab = function(tab) {
        return T.currentTab === tab;
      };

      $scope.setTab = function(tab) {
        if (tab == 1 && !T.koRound) {
          Dialog.confirm({
            title: 'K.o. Runde starten',
            body: 'Soll die K.o. Runde gestartet werden?\nDannach kann nicht mehr zu Vorrunde zurück gewechselt werden!',
            confirm: 'Ja',
            cancel: 'Nein'
          }).then(function(result) {
            if (result === 1) {
              Tournament.startKo();
              T.currentTab = tab;
              //console.log($rootScope.finals);
            }
          });
        } else if (!(T.koRound && tab == 0)) {
          $scope.scoreOpen = -1;
          T.currentTab = tab;
        }
      };

      $scope.showReenterScore = function(round) {
        return round === T.round;
      };


      $scope.toggleScore = function(idx) {
        if (T.currentMatches[idx] == null) {
          $scope.scoreOpen = -1;
          Tournament.fillTables(idx);
          return;
        }

        if (idx == $scope.scoreOpen) {
          $scope.scoreOpen = -1;
        } else {
          $scope.scoreOpen = idx;
        }
      };

      $scope.insertScore = function(idx, score) {
        console.log(score);
        var match = T.currentMatches[idx];
        if (match != null) {
          if ($scope.scoreOpen == idx) {
            //  $scope.scoreOpen[idx] = false;
            if (score == undefined || score == 1 && (!T.withDraw || T.koRound)) {
              return;
            }

            Tournament.enterScore(idx, scores[score]);
            $scope.scoreOpen == -1;
          }
        }
      };

      $scope.deferMatch = function(tableIdx) {
        if ($scope.canDeferMatch(tableIdx)) {
          Dialog.confirm({
              title: 'Spiel zurückstellen',
              body: 'Soll das Spiel an Tisch ' + (tableIdx + 1) + ' zurückgestellt werden?',
              cancel: 'Nein',
              confirm: 'Ja'
            })
            .then(function(result) {
              if (result === 1) {
                Tournament.deferMatch(tableIdx);
              }
            });
        }
      };
      $scope.disableInsertScore = function(idx) {
        return T.currentMatches[idx] == null;
      };

      $scope.canDeferMatch = function(tableIdx) {
        var match = T.currentMatches[tableIdx];
        return match != null && T.nextMatches.length > 0 && (T.koRound || match.round == T.round);
      };


      $scope.editScore = function(match, scoreIdx) {
        if (scoreIdx == 1 && (T.koRound || !T.withDraw)) {
          return;
        }
        Tournament.correctScore(match, scores[scoreIdx]);
        $scope.scoreOpen = -1;
      };

      $scope.reenterScore = function(match) {
        if (match.editScore) {
          match.editScore = false;
        } else {
          match.editScore = true;
        }
      };
    });
})(angular);
