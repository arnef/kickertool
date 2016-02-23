(function () {
  'use strict';

  angular.module('app')
    .directive('singles', SingelsDirective);

  function SingelsDirective() {
    return {
      templateUrl: 'kickertool-tpls/singles.view.html',
      controllerAs: 'singlesCtrl',
      controller: ['$scope', '$attrs', '$localStorage', 'Dialog', 'Tournament',
        function ($scope, $attrs, $localStorage, Dialog, Tournament) {
          var vm;
          $scope.focusInput = true;
          vm = this;
          vm.player = {
            points: 0,
            matches: 0,
            out: false
          };
          vm.data = $localStorage;
          vm.startTournament = $scope.$eval($attrs.start);
          vm.addPlayer = addPlayer;
          vm.removePlayer = removePlayer;



          function addPlayer() {
            if (vm.data.round > 1) return;

            vm.player.name = vm.player.name.toUpperCase();
            if (playerNotInList()) {
              vm.data.teamList.push(angular.copy(vm.player));
              delete vm.player.name;
              $scope.focusInput = true;
            }
          }

          function playerNotInList() {
            var i;
            for (i = 0; i < vm.data.teamList.length; i++) {
              if (vm.player.name.toLowerCase() == vm.data.teamList[i].name.toLowerCase()) {
                Dialog.alert({
                  title: 'Spieler schon vorhanden',
                  body: vm.player.name + ' bereits vorhanden'
                });
                return false;
              }
            }
            return true;
          }

          function removePlayer(idx) {
            Dialog.confirm({
              title: 'Spieler entfernen?',
              body: 'Soll ' + vm.data.teamList[idx].name + ' gelöscht werden?',
              confirm: 'Ja',
              cancel: 'Nein'
            }).then(function (result) {
              if (result == 1) {
                Tournament.removeTeam(idx);
              }

            });
          }
        }
      ]
    };
  }
})();
