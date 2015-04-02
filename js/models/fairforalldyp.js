function FairForAllDyp() {
    var _self = this;
    
    var _tables = new Array(2);
    var _player = null;
    var _ranking = null;
        
    var _teamdrawer = new TeamDrawer();
    var _qualifyingRoundModus = new SwissSystem();
    
    
    /**
    *
    */
    this.setCountTables = function(countTables) {
        _tables = new Array(countTables);
    };
    
    
    /**
    *
    */
    this.setModus = function(newModus) {
        console.log('neuer Modus');
        _qualifyingRoundModus = newModus;
        if (_ranking != null) {
            _qualifyingRoundModus.setTeams(_ranking);
            _qualifyingRoundModus.newRound();
        }
        for (var i = 0; i < _tables.length; i++) {
            _tables[i] = null;
        }
    };
    
    
    /**
    *
    */
    this.setPlayer = function(newPlayer) {
        _player = newPlayer;
    };
    
    
    /**
    *
    */
    this.drawTeams = function() {
        var player = [].concat(_player);
        _ranking = _teamdrawer.draw(player);
        _qualifyingRoundModus.setTeams(_ranking);
    };
    
    
    /**
    *
    */
    this.getRanking = function() {
        return _ranking;
    };
    
    
    /**
    *
    */
    this.getPlayedMatches = function() {
        return _qualifyingRoundModus.playedMatches || [];
    };
    
    
    /**
    *
    */
    this.getNextMatches = function() {
        return _qualifyingRoundModus.nextMatches || [];
    };
    
    
    /**
    *
    */
    this.getCurrentMatches = function() {
        return _tables;
    };
    
    
    /**
    *
    */
    _self.nextRound = function() {
        _qualifyingRoundModus.newRound();
        for (var i = 0; i < _tables.length; i++) {
            _tables[i] = _qualifyingRoundModus.nextMatches[0];
            _qualifyingRoundModus.nextMatches.splice(0,1);
        }
    };
    
    
    /**
    * @param tableIdx: index of table
    * @param score: use 0 for home team wins, 1 for duice and 2 for away team
    *           wins
    */
    this.setWinnerOnTable = function(tableIdx, score) {
        var match = _tables[tableIdx];
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
        _ranking.sort(function (a, b) {
            return b.points - a.points;
        });
        _qualifyingRoundModus.playedMatches.push(match);
        _tables[tableIdx] = null;
        _self.setMatchOnTable(tableIdx);
    };
    
    
    /**
    *
    */
    _self.setMatchOnTable = function(tableIdx) {
        if (!_self.roundIsDone()) {
            _tables[tableIdx] = _qualifyingRoundModus.nextMatches[0];
            _qualifyingRoundModus.nextMatches.splice(0,1);
        }
        else {
            _self.nextRound();
        }
    };
    
    
    
    /**
    *
    */
    _self.roundIsDone = function() {
        var done = _qualifyingRoundModus.nextMatches.length == 0;
        for (var i = 0; i < _tables.length; i++) {
            if (_tables[i] != null) {
                done = false;
                break;
            }
        }
        return done;
    };
    
    
    /**
    *
    */
    _self.startKORound = function() {
        _qualifyingRoundModus = new KORound();
        _qualifyingRoundModus.setRanking(_ranking);
    }
}
