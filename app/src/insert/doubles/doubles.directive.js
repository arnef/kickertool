(function () {
  'use strict';
  angular.module('app')
    .directive('doubles', DoublesDirective);

  function DoublesDirective() {
    return {
      templateUrl: 'kickertool-tpls/doubles.view.html',
      controllerAs: 'doublesCtrl',
      controller: ['$scope', '$attrs', '$localStorage', 'Dialog', 'Tournament',
        function ($scope, $attrs, $localStorage, Dialog, Tournament) {
          var vm;
          console.log('doubles');
          vm = this;
          vm.data = $localStorage;
          $scope.focusInput = true;
          vm.startTournament = $scope.$eval($attrs.start);
          vm.addTeam = addTeam;
          vm.removeTeam = removeTeam;

          function addTeam() {
            if (vm.data.round > 1) {
              return;
            }
            if (vm.name1 && vm.name2) {
              if (teamNotInList()) {
                vm.data.teamList.push({
                  name: vm.name1.toUpperCase() + ' / ' + vm.name2.toUpperCase(),
                  points: 0,
                  matches: 0,
                  out: false
                });
                delete vm.name1;
                delete vm.name2;
                $scope.focusInput = true;
              }
            } else {
              Dialog.alert({
                title: 'Spieler eintragen',
                body: 'Bitte Namen angeben'
              });
            }
          }

          function teamNotInList() {
            var team, teamName, teamName2, i;

            teamName = (vm.name1 + ' / ' + vm.name2).toUpperCase();
            teamName2 = (vm.name2 + ' / ' + vm.name1).toUpperCase();

            for (i = 0; i < vm.data.teamList.length; i++) {
              team = vm.data.teamList[i];
              if (team.name == teamName || team.name == teamName2) {
                Dialog.alert({
                  title: 'Team schon vorhanden',
                  body: team.name + ' bereit vorhanden'
                });

                return false;
              }
            }

            return true;
          }

          function removeTeam(idx) {
            Dialog.confirm({
              title: 'Team entfernen',
              body: 'Soll das Team ' + vm.data.teamList[idx].name + ' gelöscht werden?',
              confirm: 'Ja',
              cancel: 'Nein'
            }).then(function (result) {
              if (result === 1) {
                Tournament.removeTeam(idx);
              }
            });
          }
        }
      ]
    };
  }
})();
