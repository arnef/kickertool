function TeamDrawer() {
    var _self = this;
    
    const GOALIE = 1;
    const STRIKER = 2;
    const BOTH = 4;
    const PRO = 8;
    const AMATEUR = 16;

    var _teams = [];
    
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
    };
    
    var compairePlayer = function(players, matchMethod, danger) {
        var players2 = shuffleArray(players);
        var noMatches = [];
        while (players2.length > 0) {
            var teamplayer1 = players2.pop();
            var match = false;
            for (var i = 0; i < players.length; i++) {
                var teamplayer2 = players[i];
                if (matchMethod(teamplayer1, teamplayer2)) {
                    _teams.push({
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
    };
    
    _self.draw = function(player) {
        _teams = [];
        player = compairePlayer(player, niceMatch, false);
        if (player.length > 0) {
            player = compairePlayer(player, fairMatch, false);
        }
        if (player.length > 0) {
            player = compairePlayer(player, badMatch, true);
        }
        return _teams;
    };

}
