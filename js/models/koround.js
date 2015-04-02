function KORound() {
    var _self = this;
    
    var _ranking = null;
    var _winner = null;
    _self.nextMatches = [];
    _self.playedMatches = [];
    
    _self.setTeams = function (newRanking) {
        _ranking = newRanking;
        _winner = newRanking;
    };
    
    
    var buildMatches = function(type) {
        
        for (var i = 0; i < type / 2; i++) {
            var team1 = _winner[i];
            var team2 = _winner[type - i - 1];
            var match = {
                team1: team1,
                team2: team2,
                score: {team1: 0, team2: 0},
                round: (type / 2) + '. Finale'
            };
            _self.nextMatches.push(match);
        }
        _winner = [];
    };
    
    
    var getRound = function() {
        var teams = _winner.length;
        if (teams == 1) {
            alert("Finale");
        }
        else if (teams <= 2) {
            buildMatches(2);
        }
        else if (teams <= 4) {
            buildMatches(4);
        }
        else if (teams <= 8) {
            buildMatches(8);
        }
        else if (teams <= 16) {
            buildMatches(16);
        }
        else if (teams <= 32) {
            buildMatches(32);
        }
        else if (teams <= 64) {
            buildMatches(64);
        }
    };
    
    
    
    
    
    /**
    *
    */
    _self.newRound = function() {
        getRound();
    };
}
