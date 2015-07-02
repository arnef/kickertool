(function() {
    var app = angular.module('controller-dyp', []);

    app.controller('DypController', function($scope, $location, $window, dialogs, Tourment) {
        var _self = this;

        const GOALIE = 1;
        const STRIKER = 2;
        const BOTH = 4;
        const PRO = 8;
        const AMATEUR = 16;
    

        $scope.TYPES = [{
            name: 'Gesetzt',
            value: PRO
        }, {
            name: 'Gelost',
            value: AMATEUR
        }];

        $scope.POSITIONS = [{
            name: 'Torwart/Stürmer',
            value: BOTH
        }, {
            name: 'Torwart',
            value: GOALIE
        }, {
            name: 'Stürmer',
            value: STRIKER
        }];

        $scope.newPlayer = {
            type: PRO,
            position: BOTH
        };

        var _player = [],
            teams = [];
        
        var player_in_list = function (player) {
            player = player.name.split(' ').join('').toLowerCase();
            for (var i = 0; i < _player.length; i++) {
                var current_player = _player[i].name.split(' ').join('').toLowerCase();
                if (current_player == player) {
                    return true;
                }
            }
            return false;
        };
        
        var focusInputField = function () {
            $('input')[0].focus();
        };
        
        $scope.addPlayer = function() {
            if ($scope.newPlayer.name != '' && !player_in_list($scope.newPlayer)) {
                _player.push($scope.newPlayer);
                $scope.newPlayer  = {
                    type: $scope.newPlayer.type,
                    position: $scope.newPlayer.position
                };
                focusInputField();
                setTimeout(function () {
                    $('#scrolltable').scrollTop(99*99);
                }, 20);
            }
            else {
                var dlg = dialogs.error(
                    'Spieler schon eingetragen!',
                    'Der Name ' + $scope.newPlayer.name 
                    + ' ist schon vergeben.', { size: 'sm'});
                dlg.result.then(function () {
                    focusInputField();
                });
            }
        };
        
        
        
        $scope.showPlayerList = function() {
            return _player.length > 0;
        };
        
        $scope.getPlayer = function() {
            return _player;
        };

        $scope.showTeamsList = function() {
            return Tourment.getRanking() != null; //drawteams.teams.length > 0;
        };
        
        $scope.getTeams = function() {
            return teams;
        };

       

        var teamdrawer = new TeamDrawer();
        
        /**
         * Lose Teams aus
         **/
        $scope.createTeams = function() {
            teams = teamdrawer.draw([].concat(_player));
        };

        $scope.removePlayer = function (index) {
            var dlg = dialogs.confirm(
                'Spieler löschen',
                'Spieler "' + _player[index].name + '" entfernen?', {
                    size: 'sm'
                });
            dlg.result.then(function(btn) {
                _player.splice(index, 1);
                focusInputField();
            });

        };
        
        $scope.disabledDraw = function() {
            return _player.length % 2 == 1 || _player.length == 0; //drawteams.player.length % 2 == 1;
        }

        $scope.startTourment = function() {
            Tourment.setTeams(teams);
            Tourment.nextRound();
            $location.path('turnier');
        };
    });
})();
