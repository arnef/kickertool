function SwissSystem() {
    var _self = this;
    
    
    
    _teams = null;
    _self.nextMatches = [];
    _self.playedMatches = [];
    _self.round = 0;
    
    
    this.setTeams = function(teams) {
        if (teams.length % 2 == 1) {
            teams.push({ name: 'Freilos', ghost: true });
        }
        _teams = teams;
    }
    /**
    *
    */
    _self.newRound = function() {
        _self.round += 1;
        var teams = [].concat(_teams);
        var useNext = 0;
        while (teams.length > 0) {
            var match = {
                round: _self.round,
                team1: teams[0],
                team2: teams[(1 + useNext)],
                score: { team1: 0, team2: 0}
            };
            if (matchPlayed(match)) {
                useNext += 1;
            }
            else {
                _self.nextMatches.push(match);
                useNext = 0;
                teams.splice(0, 1);
                teams.splice(useNext, 1);
            }
        }
    }
    
    
    // 
    var matchPlayed = function(match) {
        var played = false;
        for (var i = 0; i < _self.playedMatches.length; i++) {
            var playedMatch = _self.playedMatches[i];
            if ((playedMatch.team1.name == match.team1.name 
                    && playedMatch.team2.name == match.team2.name )
                || (playedMatch.team1.name == match.team2.name
                    && playedMatch.team2.name == match.team1.name)) {
                        played = true;
                        break;
                    }
        }
        return played;
    }
}
