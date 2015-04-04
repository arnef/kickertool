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
    };
    /**
    *
    */
    _self.newRound = function() {
        
        if (_self.round == _teams.length-1) {
            alert('K.O. Runde starten!');
            return;
        }
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
                teams.splice(0, 1);
                teams.splice(useNext, 1);
                useNext = 0;
            }
        }
    };
    
    
    _self.setWinner = function(match, score) {
        if (score == 0) {
            match.score.team1 = 2;
            match.team1.points += 2;
        }
        if (score == 1) {
            match.score.team1 = 1;
            match.score.team2 = 1;
            match.team1.points += 1;
            match.team2.points += 1;
        }
        if (score == 2) {
            match.score.team2 = 2;
            match.team2.points += 2;
        }
        _teams.sort(function (a, b) {
            return b.points - a.points;
        });
        _self.playedMatches.push(match);
    };
    
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
                        console.log('Played');
                        break;
                    }
        }
        return played;
    };
}
