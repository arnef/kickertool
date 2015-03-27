(function() {
    var app = angular.module('kteaminput', []);

    app.controller('TeamInputController', function(DataService) {
        var _self = this;

        const GOALIE = 1;
        const STRIKER = 2;
        const BOTH = 4;
        const PRO = 8;
        const AMATEUR = 16;

        _self.optionsType = [{
            name: 'Gesetzt',
            value: PRO
        }, {
            name: 'Gelost',
            value: AMATEUR
        }];

        _self.optionsPosition = [{
            name: 'Torwart / Stürmer',
            value: BOTH
        }, {
            name: 'Torwart',
            value: GOALIE
        }, {
            name: 'Stürmer',
            value: STRIKER
        }];

        _self.newPlayer = {
            type: PRO,
            position: BOTH
        };

        _self.players = DataService.player;


        _self.teams = DataService.teams;


        /**
         * Fügt Spieler zu Liste hinzu
         **/
        _self.addPlayer = function() {
            _self.players.push(_self.newPlayer);
            _self.newPlayer = {
                type: PRO,
                position: BOTH
            };
        };


        // create randmon players
        (function() {
            for (var i = 0; i < 12; i++) {
                var type = Math.floor(Math.random() * 2);
                var position = Math.floor(Math.random() * 3);
                _self.players.push({
                    name: 'player ' + (i + 1) + ' ' + _self.optionsPosition[position].name + ' ' + _self.optionsType[type].name,
                    position: _self.optionsPosition[position].value,
                    type: _self.optionsType[type].value,
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

        var compairePlayers = function(players, matchMethod) {
            var players2 = shuffleArray(players);
            var noMatches = [];
            while (players2.length > 0) {
                var teamplayer1 = players2.pop();
                var match = false;
                for (var i = 0; i < players.length; i++) {
                    var teamplayer2 = players[i];
                    if (matchMethod(teamplayer1, teamplayer2)) {
                        _self.teams.push({
                            player1: teamplayer1,
                            player2: teamplayer2,
                            points: 0
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
        _self.createTeams = function() {
            var players = [].concat(_self.players);
            players = compairePlayers(players, niceMatch);
            if (players.length > 0) {
                players = compairePlayers(players, fairMatch);
                for (var i = 0; i < players.length; i++) {
                    players[i].danger = true;
                }
            }

            if (players.length > 0) {
                players = compairePlayers(players, badMatch);
            }
        };

        _self.getPosition = function(value) {
            switch (value) {
                case GOALIE:
                    return _self.optionsPosition[1].name;
                case STRIKER:
                    return _self.optionsPosition[2].name;
                case BOTH:
                    return _self.optionsPosition[0].name;
            }
        };

        _self.removePlayer = function(index) {
            _self.players.splice(index, 1);
        }
    });
})();
