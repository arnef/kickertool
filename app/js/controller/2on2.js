(function() {
    var app = angular.module('controller-2on2', []);

    app.controller('2on2Controller', function($scope, $location, $window, dialogs, Tourment) {
        var _self = this;

    
        
        $scope.newPlayer1 = {};
        $scope.newPlayer2 = {};

        var _player = [];
        
        var player_in_list = function (player1, player2) {
            var team1 = player1.name + '/' + player2.name;
            team1 = team1.split(' ').join('').toLowerCase();
            var team2 = player2.name + '/' + player1.name;
            team2 = team2.split(' ').join('').toLowerCase();

            for (var i = 0; i < _player.length; i++) {
                var current_player = _player[i].name.split(' ').join('').toLowerCase();
                if (current_player == team1 || current_player == team2) {
                    return true;
                }
            }
            return false;
        };
        
        var focusInputField = function () {
            //$('input')[0].focus();
        };
        focusInputField();
        
        $scope.addPlayer = function() {
            if ($scope.newPlayer1.name != '' && $scope.newPlayer2.name != '' && !player_in_list($scope.newPlayer1, $scope.newPlayer2)) {
                var team = {
                    name: $scope.newPlayer1.name + ' / ' + $scope.newPlayer2.name,
                    points: 0
                }
                _player.push(team);
                $scope.newPlayer1 = {};
                $scope.newPlayer2 = {};
                focusInputField();
                setTimeout(function () {
                    $('#scrolltable').scrollTop(99*99);
                }, 20);
            }
            else {
                var dlg = dialogs.error(
                    'Team schon eingetragen!',
                    'Das Team ' + $scope.newPlayer1.name + ' / ' + $scope.newPlayer2.name 
                    + ' ist schon eingetragen.', { size: 'sm'});
                dlg.result.then(function () {
                    $('input')[0].focus();
                });
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
        });


    

        $scope.removePlayer = function(index) {
            var dlg = dialogs.confirm(
                'Spieler löschen',
                'Spieler "' + _player[index].name + '" entfernen?', {
                    size: 'sm'
                });
            dlg.result.then(function(btn) {
                _player.splice(index, 1);
                $('input')[0].focus();
            });

        };

        $scope.startTourment = function() {
          _player = TeamDrawer.shuffleArray(_player);
            Tourment.setTeams(_player);
            Tourment.nextRound();
            $location.path('turnier');
        };
    });
})();
