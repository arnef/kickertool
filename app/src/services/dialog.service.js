'use strict';

angular.module('app')
  .factory('Dialog', ['$rootScope', '$q', '$uibModal', function ($rootScope, $q, $uibModal) {
    var dialog = require('electron').remote.dialog;
    var BrowserWindow = require('electron').remote.BrowserWindow;

    function modal(open) {
      $rootScope.modalDialog = open;
      if (!open)
        $rootScope.$apply();
    }

    /**
     * alert dialog
     * @param  {object} content { tite: title of the dialig,
     *                          	body: message of the }
     * @return {$promise}         $promise with blank resolve
     */
    function alertElectron(content) {
      modal(true);
      var deferred = $q.defer();
      dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
        title: content.title,
        type: 'info',
        message: content.body,
        buttons: ['Ok'],
      }, function () {
        modal(false);
        deferred.resolve();
      });
      return deferred.promise;
    }

    /**
     * Score dialog shows options for match winner
     * @param  {String} team1   Name of home team
     * @param  {String} team2   Name of away team
     * @return {$promise}       $promise with result '2:0', '1:1' or '0:2'
     */
    function scoreElectron(team1, team2) {
      modal(true);
      var deferred = $q.defer();
      var buttons = $rootScope.globals.withDraw && !$rootScope.globals.koRound ? [team1, 'untentschieden', team2] : [team1, team2];
      var scores = buttons.length === 3 ? ['2:0', '1:1', '0:2'] : ['2:0', '0:2'];

      dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
        type: 'none',
        title: 'Gewinner wählen',
        message: 'Wer hat das Spiel gewonnen?',
        buttons: buttons,
        cancelId: -1
      }, function (result) {
        modal(false);
        if (result > -1)
          deferred.resolve(scores[result]);
        else
          deferred.reject();
      });
      return deferred.promise;
    }

    function score(team1, team2) {
      var deferred = $q.defer();

      $uibModal.open({
        animation: true,
        templateUrl: 'templates/score.dialog.view.html',
        controller: 'ScoreDialogController',
        size: 'md',
        resolve: {
          items: {
            team1: team1,
            team2: team2
          }
        }
      }).result.then(function (score) {
        deferred.resolve(score);
      });
      return deferred.promise;
    }

    function confirmElectron(content) {
      modal(true);
      var deferred = $q.defer();
      console.log(content);
      dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
        type: 'question',
        title: content.title,
        message: content.body,
        buttons: [content.cancel, content.confirm]
      }, function (result) {
        modal(false);
        deferred.resolve(result);
      });
      return deferred.promise;
    }

    return {
      score: score,
      alert: alertElectron,
      confirm: confirmElectron
    };
  }]).controller('ScoreDialogController',
    function ($rootScope, $scope, $uibModalInstance, items) {
      $scope.team1 = items.team1;
      $scope.team2 = items.team2;
      //TODO ko round
      $scope.draw = $rootScope.globals.withDraw && !$rootScope.globals.koRound;
      $scope.cancel = function () {
        $uibModalInstance.dismiss();
      };
      $scope.score = function (idx) {
        var scores = ['2:0', '1:1', '0:2'];
        console.debug(scores[idx]);
        $uibModalInstance.close(scores[idx]);
      };
    });
