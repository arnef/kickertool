(function() {
    var app = angular.module('controller-1on1', []);

    app.controller('1on1Controller', function($scope, $location, $window, dialogs, Tourment) {
        var _self = this;

    

        $scope.newPlayer = {
            points: 0
        };

        var _player = [];
        
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
        
        $scope.addPlayer = function() {
            if ($scope.newPlayer.name != '' && !player_in_list($scope.newPlayer)) {
                _player.push($scope.newPlayer);
                $scope.newPlayer  = {
                    points: 0
                };
            }
            else {
                var dlg = dialogs.error(
                    'Spieler schon eingetragen!',
                    'Der Name ' + $scope.newPlayer.name 
                    + ' ist schon vergeben.', { size: 'sm'});
            }
        };
        
        
        
        $scope.showPlayerList = function() {
            return _player.length > 0;
        };
        
        $scope.getPlayer = function() {
            return _player;
        };

        // create randmon players
        (function() {
            for (var i = 0; i < 13; i++) {
                var type = Math.floor(Math.random() * 2);
                var position = Math.floor(Math.random() * 3);
                _player.push({
                    name: 'player ' + (i + 1),
                    points: 0
                });
            }
        })();


    

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

        $scope.startTourment = function() {
            Tourment.setTeams(_player);
            Tourment.nextRound();
            $location.path('turnier');
        };
    });
})();
