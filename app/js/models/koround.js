function KORound() {
    var _self = this;

    var _ranking = null;
    _self.finals = false;
    _self.winner = null;
    _self.nextMatches = [];
    _self.playedMatches = [];
    _self.lastRound = true;

    _self.setTeams = function(newRanking) {
        _ranking = newRanking;
        _self.winner = [].concat(newRanking);
    };

    
    _self.toggleLastRound = function () {
        return;
    };

    var getRoundName = function(count) {
        switch (count) {
            case 32:
                return '32. Finale';
            case 16:
                return '16. Finale';
            case 8:
                return 'Achtelfinale';
            case 4:
                return 'Viertelfinale';
            case 2:
                return 'Halbfinale';
            case 1:
                return 'Finale';
        }
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
                    rount_points: type/2,
                    round: getRoundName(type/2)
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
                    rount_points: type/2,
                    round: getRoundName(type/2)
                };
            }
            _self.nextMatches.push(match);
        }

    };
    
    
    _self.hasNextRound = function() {
        return _self.winner.length > 1;
    };


    _self.setWinner = function(match, score) {
        _self.enterScore(match, score);
        _self.playedMatches.push(match);
    };

    _self.enterScore = function (match, score) {
        if (score == 0) {
            match.score = {
                team1: 2,
                team2: 0
            };
            match.team2.out = -match.rount_points;
            match.team1.out = 0;
            match.team1.points += 2;
            _self.winner.push(match.team1);
        }
        if (score == 2) {
            match.score = {
                team1: 0,
                team2: 2
            };
            match.team1.out = -match.rount_points;
            match.team2.out = 0;
            match.team2.points += 2;
            _self.winner.push(match.team2);
        };
        _ranking.sort(function(a, b) {
            var t1 = (a.out != null && a.out != 0) ? a.out : a.points;
            var t2 = (b.out != null && b.out != 0) ? b.out : b.points;
            if (a.ghost) t1 = -99;
            if (b.ghost) t2 = -99;
            return t2 - t1;
        });
        _self.winner.sort(function(a, b) {
            return b.points - a.points;
        });
    };
    
    var getRound = function() {
        var teams = _self.winner.length;
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
