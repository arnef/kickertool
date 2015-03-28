(function() {
    var app = angular.module('kteaminput', []);

    app.controller('TeamInputController', function($scope, $location, dialogs, DataService) {
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
        
        $scope.teams = DataService.teams;
        $scope.player = DataService.player;

        /**
         * Fügt Spieler zu Liste hinzu
         **/
        $scope.addPlayer = function() {
            if ($scope.newPlayer.name != '') {
                $scope.player.push($scope.newPlayer);
                $scope.newPlayer = {
                    type: PRO,
                    position: BOTH
                };
            }
        };


        // create randmon players
        (function() {
            for (var i = 0; i < 12; i++) {
                var type = Math.floor(Math.random() * 2);
                var position = Math.floor(Math.random() * 3);
                $scope.player.push({
                    name: 'player ' + (i + 1),
                    position: $scope.POSITIONS[position].value,
                    type: $scope.TYPES[type].value,
                });
            }
        })();

        /**
         * 
         **/
        var shuffleArray = function(array) {
            var m = array.length,
                t, i;

            // While there remain elements to shuffle
            while (m) {
                // Pick a remaining element…
                i = Math.floor(Math.random() * m--);

                // And swap it with the current element.
                t = array[m];
                array[m] = array[i];
                array[i] = t;
            }

            return array;
        }


        /**
         *
         **/
        var niceMatch = function(player1, player2) {
            const match1 = GOALIE + STRIKER + AMATEUR + PRO;
            const match2 = GOALIE + BOTH + AMATEUR + PRO;
            const match3 = STRIKER + BOTH + AMATEUR + PRO;

            var teamValue = player1.type + player2.type + player1.position + player2.position;

            return teamValue == match1 || teamValue == match2 || teamValue == match3;
        };

        var fairMatch = function(player1, player2) {
            const match1 = BOTH + BOTH + AMATEUR + PRO;
            var teamValue = player1.type + player2.type + player1.position + player2.position;

            return teamValue == match1;
        };

        var badMatch = function(player1, player2) {
            return player1.name != player2.name;
        }

        var compairePlayers = function(players, matchMethod, danger) {
            var players2 = shuffleArray(players);
            var noMatches = [];
            while (players2.length > 0) {
                var teamplayer1 = players2.pop();
                var match = false;
                for (var i = 0; i < players.length; i++) {
                    var teamplayer2 = players[i];
                    if (matchMethod(teamplayer1, teamplayer2)) {
                        $scope.teams.push({
                            name: teamplayer1.name + ' / ' + teamplayer2.name,
                            points: 0,
                            danger: danger
                        });
                        players.splice(i, 1);
                        match = true;
                        break;
                    }
                }
                if (!match) {
                    noMatches.push(teamplayer1);
                }
            }
            return noMatches;
        };


        /**
         * Lose Teams aus
         **/
        $scope.createTeams = function() {
            var players = [].concat($scope.player);
            players = compairePlayers(players, niceMatch, false);
            if (players.length > 0) {
                players = compairePlayers(players, fairMatch, false);
            }
            if (players.length > 0) {
                players = compairePlayers(players, badMatch, true);
            }
        };


        $scope.getPosition = function(value) {
            switch(value) {
                case BOTH:
                    return $scope.POSITIONS[0].name;
                case GOALIE:
                    return $scope.POSITIONS[1].name;
                case STRIKER:
                    return $scope.POSITIONS[2].name;
            }
        };
        
        $scope.getType = function(value) {
            switch (value) {
                case PRO:
                    return $scope.TYPES[0].name;
                case AMATEUR:
                    return $scope.TYPES[1].name;
            }
        };
    
        $scope.removePlayer = function(index) {
            var dlg = dialogs.confirm(
                'Spieler löschen', 
                'Spieler "' + $scope.player[index].name + '" entfernen?', 
                {size: 'sm'});
            dlg.result.then(function(btn){
                $scope.player.splice(index, 1);
            });
            
        };
        
        $scope.startTourment = function() {
            $location.path('turnier');
        };
    });
})();
