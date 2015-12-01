(function () {
  'use strict';

  angular.module('app')
    .factory('Dialog', ['$uibModal', function ($uibModal) {
      function teams(teamList) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'templates/teams.dialog.view.html',
          controller: 'TeamsDialogController',
          size: 'md',
          resolve: {
            items: {
              teamList: teamList
            }
          }
        });

        return modalInstance;
      }

      function score(team1, team2) {
        return $uibModal.open({
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
        });
      }

      function confirm(content) {
        return $uibModal.open({
          animation: true,
          templateUrl: 'templates/confirm.dialog.view.html',
          controller: 'ConfirmDialogController',
          size: 'md',
          resolve: {
            items: {
              content: content
            }
          }
        });
      }

      function alert(content) {
        return $uibModal.open({
          animation: true,
          templateUrl: 'templates/alert.dialog.view.html',
          controller: 'AlertDialogController',
          size: 'md',
          resolve: {
            items: {
              content: content
            }
          }
        });
      }

      return {
        teams: teams,
        score: score,
        alert: alert,
        confirm: confirm
      };
    }])
    .controller('ConfirmDialogController', function ($scope, $uibModalInstance, items) {
      $scope.content = items.content;

      $scope.cancel = function () {
        $uibModalInstance.close(0);
      };

      $scope.confirm = function () {
        $uibModalInstance.close(1);
      };
    })
    .controller('TeamsDialogController',
      function ($scope, $uibModalInstance, items) {
        $scope.teamList = items.teamList;

        $scope.cancel = function () {
          $uibModalInstance.dismiss();
        };

        $scope.start = function () {
          $uibModalInstance.close();
        }
      })
    .controller('AlertDialogController', function ($scope, $uibModalInstance, items) {
      $scope.content = items.content;
      $scope.confirm = function () {
        $uibModalInstance.dismiss();
      };
    })
    .controller('ScoreDialogController',
      function ($rootScope, $scope, $uibModalInstance, items) {
        $scope.team1 = items.team1;
        $scope.team2 = items.team2;
        //TODO ko round
        $scope.draw = $rootScope.globals.withDraw === '1' && !$rootScope.globals.koRound;
        $scope.cancel = function () {
          $uibModalInstance.dismiss();
        };
        $scope.score = function (idx) {
          var scores = ['2:0', '1:1', '0:2'];
          $uibModalInstance.close(scores[idx]);
        };
      });

})();