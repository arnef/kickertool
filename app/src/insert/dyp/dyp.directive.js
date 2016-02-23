(function () {
  'use strict';

  angular.module('app')
    .directive('dyp', DypDirective);

  function DypDirective() {
    return {
      templateUrl: 'kickertool-tpls/dyp.view.html',
      controllerAs: 'dypCtrl',
      controller: ['$scope', '$attrs', '$localStorage', 'TeamDrawer', 'Dialog',
        function ($scope, $attrs, $localStorage, TeamDrawer, Dialog) {
          var vm, lastId;

          lastId = 0;
          vm = this;
          $scope.focusInput = true;
          vm.player = {};
          vm.data = $localStorage;
          vm.addPlayer = addPlayer;
          vm.removePlayer = removePlayer;
          vm.drawTeams = drawTeams;
          vm.startTournament = $scope.$eval($attrs.start);

          vm.types = [{
            name: 'Gesetzt',
            value: TeamDrawer.PRO
          }, {
            name: 'Gelost',
            value: TeamDrawer.AMATEUR
          }];
          vm.positions = [{
            name: 'Torwart/Stürmer',
            value: TeamDrawer.BOTH
          }, {
            name: 'Torwart',
            value: TeamDrawer.GOALIE
          }, {
            name: 'Stürmer',
            value: TeamDrawer.STRIKER
          }];

          /**
           * add player to list
           */
          function addPlayer() {
            if (vm.data.round > 1) return;
            vm.player.name = vm.player.name.toUpperCase();
            if (vm.player.name && vm.player.type && vm.player.position) {
              if (playerNotInList()) {
                lastId++;
                vm.player.id = lastId;
                console.log('add player', vm.player);
                vm.data.playerList.push(angular.copy(vm.player));
                clearTeams();
                delete vm.player.name;
                delete vm.player.id;
                $scope.focusInput = true;
              }
            } else {
              Dialog.alert({
                title: 'Spielerdetails fehlen',
                body: 'Bitte Position und Stärke des Spielers angeben'
              });
            }
          }

          /**
           * check for unique names
           * @return {boolean} name of player is not in list
           */
          function playerNotInList() {
            var i;
            for (i = 0; i < vm.data.playerList.length; i++) {
              if (vm.player.name.toLowerCase() == vm.data.playerList[i].name.toLowerCase()) {
                Dialog.alert({
                  title: 'Spieler schon vorhanden',
                  body: 'Der Spieler ' + vm.player.name + ' ist bereits angemeldet'
                });
                return false;
              }
            }
            return true;
          }

          function drawTeams() {
            if (!TeamDrawer.canDraw(vm.data.playerList)) {
              Dialog.confirm({
                title: 'Fehler',
                body: 'Anzahl der Spieler ist ungerade. Soll ein Joker hinzugefügt werden?',
                confirm: 'Ja',
                cancel: 'Nein'
              }).then(function (result) {
                if (result == 1) {
                  vm.data.teamList = TeamDrawer.draw(vm.data.playerList, true);
                }
              });
            } else {
              vm.data.teamList = TeamDrawer.draw(vm.data.playerList);
            }

          }

          /**
           * [removePlayer description]
           * @param  {[type]} idx [description]
           * @return {[type]}     [description]
           */
          function removePlayer(idx) {
            if (vm.data.ongoing) {
              return;
            }
            Dialog.confirm({
              title: 'Spieler entfernen?',
              body: 'Soll ' + vm.data.playerList[idx].name + ' gelöscht werden?',
              confirm: 'Ja',
              cancel: 'Nein'
            }).then(function (result) {
              if (result == 1) {
                vm.data.playerList.splice(idx, 1);
                clearTeams();
              }
            });
          }


          /**
           * [clearTeams description]
           * @return {[type]} [description]
           */
          function clearTeams() {
            if (vm.data.teamList.length > 0) {
              vm.data.teamList = [];
            }
          }
        }
      ]
    };
  }
})();
