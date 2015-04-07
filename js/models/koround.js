function KORound() {
    var _self = this;

    var _ranking = null;
    _self.finals = false;
    _self.winner = null;
    _self.nextMatches = [];
    _self.playedMatches = [];

    _self.setTeams = function(newRanking) {
        _ranking = newRanking;
        _self.winner = [].concat(newRanking);
    };


    var buildMatches = function(type, teams) {
        _self.winner = [];
        for (var i = 0; i < type / 2; i++) {
            var team1 = teams[i];
            var team2 = teams[type - i - 1];
            var match = null;
            if (team2 != null) {
                match = {
                    team1: team1,
                    team2: team2,
                    score: {
                        team1: 0,
                        team2: 0
                    },
                    round: (type / 2) + '. Finale'
                };
            } else {
                match = {
                    team1: team1,
                    team2: {
                        name: 'Freilos',
                        ghost: true
                    },
                    score: {
                        team1: 2,
                        team2: 0
                    },
                    round: (type / 2) + '. Finale'
                };
            }
            _self.nextMatches.push(match);
        }

    };
    
    
    _self.hasNextRound = function() {
        return _self.winner.length > 1;
    };


    _self.setWinner = function(match, score) {
        if (score == 0) {
            match.score = {
                team1: 2,
                team2: 0
            };
            match.team2.out = true;
            _self.winner.push(match.team1);
        }
        if (score == 2) {
            match.score = {
                team1: 0,
                team2: 2
            };
            match.team1.out = true;
            _self.winner.push(match.team2);
        };
        _ranking.sort(function(a, b) {
            var t1 = a.out ? 1 : 0;
            var t2 = b.out ? 2 : 0;
            return t1 - t2;
        });
        _self.playedMatches.push(match);
    };

    var getRound = function() {
        var teams = _self.winner.length;
        console.log('Teams: ' + teams);
        if (teams <= 2) {
            buildMatches(2, _self.winner);
        } else if (teams <= 4) {
            buildMatches(4, _self.winner);
        } else if (teams <= 8) {
            buildMatches(8, _self.winner);
        } else if (teams <= 16) {
            buildMatches(16, _self.winner);
        } else if (teams <= 32) {
            buildMatches(32, _self.winner);
        } else if (teams <= 64) {
            buildMatches(64, _self.winner);
        }
    };





    /**
     *
     */
    _self.newRound = function() {
        if (_self.winner.length > 1) {
            getRound();
        }
    };
}
