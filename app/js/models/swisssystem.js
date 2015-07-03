function SwissSystem() {
    var _self = this;



    _teams = null;
    _self.nextMatches = [];
    _self.playedMatches = [];
    
    var matches = null;
    _self.round = 0;
    _self.lastRound = false;
    
    var maxRounds = function () {
      return _teams.length - 1;
    };
    
    _self.toggleLastRound = function () {
        _self.lastRound = !_self.lastRound;
    };


    this.setTeams = function(teams) {
        //maxRounds = teams.length-1;
        if (teams.length % 2 == 1) {
            teams.push({
                name: 'Freilos',
                ghost: true,
                points: -100
            });
        }
        _teams = teams;
    };
    /**
     *
     */
    _self.newRound = function(tables) {
        if (_self.round < maxRounds()) {
            matches = [].concat(_self.playedMatches);
            if (tables != null) {
                for (var i = 0; i < tables.length; i++) {
                    var m = tables[i];
                    if (m != null) {
                        matches.push(m);
                    }
                }
            }
            
            
            _self.round += 1;
            var teams = [].concat(_teams);
            var useNext = 0;
            while (teams.length > 0) {
                var match = {
                    round: _self.round,
                    team1: teams[0],
                    team2: teams[(1 + useNext)],
                    score: {
                        team1: 0,
                        team2: 0
                    }
                };
                if (matchPlayed(match, tables)) {
                    useNext += 1;
                } else {
                    _self.nextMatches.push(match);
                    teams.splice(0, 1);
                    teams.splice(useNext, 1);
                    useNext = 0;
                }
            }
        }
    };

    
    _self.hasNextRound = function() {
        var result = _self.round < maxRounds() && !_self.lastRound;
        console.debug('has next round', result);
        return result;
    };

    _self.setWinner = function(match, score) {
        _self.enterScore(match, score);
        _self.playedMatches.push(match);
    };
    
    _self.enterScore = function (match, score) {
        if (score == 0) {
            match.score.team1 = 2;
            match.score.team2 = 0;
            match.team1.points += 2;
        }
        if (score == 1) {
            match.score.team1 = 1;
            match.score.team2 = 1;
            match.team1.points += 1;
            match.team2.points += 1;
        }
        if (score == 2) {
            match.score.team1 = 0;
            match.score.team2 = 2;
            match.team2.points += 2;
        }
        _teams.sort(function(a, b) {
            return b.points - a.points;
        });
    };

    // 
    var matchPlayed = function(match) {
        if (match.team2.name == 'Freilos') return false;
        if (match.team1.name == 'Freilos') return false;
        
        
        var played = false;

        for (var i = 0; i < matches.length; i++) {
            var playedMatch = matches[i];
            if (((playedMatch.team1.name == match.team1.name 
                    && playedMatch.team2.name == match.team2.name) 
                || (playedMatch.team1.name == match.team2.name 
                    && playedMatch.team2.name == match.team1.name))) {
                played = true;
                console.log('Played');
                break;
            }
        }
        return played;
    };
}