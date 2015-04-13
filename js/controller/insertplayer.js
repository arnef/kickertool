(function() {
    var app = angular.module('kteaminput', []);

    app.controller('InsertPlayerController', function($scope, $location, $window, dialogs, Tourment) {
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

        var _player = [];
        $scope.addPlayer = function() {
            if ($scope.newPlayer.name != '') {
                _player.push($scope.newPlayer);
                $scope.newPlayer  = {
                    type: $scope.newPlayer.type,
                    position: $scope.newPlayer.position
                };
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
            return Tourment.getRanking() || [];//drawteams.teams;
        };

        // create randmon players
        (function() {
            for (var i = 0; i < 10; i++) {
                var type = Math.floor(Math.random() * 2);
                var position = Math.floor(Math.random() * 3);
                _player.push({
                    name: 'player ' + (i + 1),
                    position: $scope.POSITIONS[position].value,
                    type: $scope.TYPES[type].value,
                });
            }
        });


        /**
         * Lose Teams aus
         **/
        $scope.createTeams = function() {
            Tourment.setPlayer(_player);
            Tourment.drawTeams();
        };

        $scope.removePlayer = function(index) {
            var dlg = dialogs.confirm(
                'Spieler löschen',
                'Spieler "' + _player[index].name + '" entfernen?', {
                    size: 'sm'
                });
            dlg.result.then(function(btn) {
                _player.splice(index, 1);
            });

        };
        
        $scope.disabledDraw = function() {
            return _player.length % 2 == 1; //drawteams.player.length % 2 == 1;
        }

        $scope.startTourment = function() {
            
            Tourment.nextRound();
            $location.path('turnier');
        };
    });
})();
