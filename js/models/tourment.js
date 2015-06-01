function Tourment() {
    var self = this;
    
    var tables = new Array(2);
    
    var ranking = null;
        
    var qualifyingRoundModus = new SwissSystem();
   
    
    /**
    *
    */
    self.setCountTables = function(countTables) {
        tables = new Array(countTables);
    };
    
    
    /**
    *
    */
    self.setModus = function(newModus) {
        var playedMatches = qualifyingRoundModus.playedMatches;
        qualifyingRoundModus = newModus;
        if (ranking != null) {
            qualifyingRoundModus.playedMatches = playedMatches;
            qualifyingRoundModus.setTeams(ranking);
        }
        for (var i = 0; i < tables.length; i++) {
            tables[i] = null;
        }
    };
    
    /**
    *
    */
    self.getRanking = function() {
        return ranking;
    };
    
    
    /**
    *
    */
    self.getPlayedMatches = function() {
        return qualifyingRoundModus.playedMatches || [];
    };
    
    
    /**
    *
    */
    self.getNextMatches = function() {
        return qualifyingRoundModus.nextMatches || [];
    };
    
    
    /**
    *
    */
    self.getCurrentMatches = function() {
        return tables;
    };
    
    
    /**
    *
    */
    self.nextRound = function() {
        qualifyingRoundModus.newRound(tables);
        for (var i = 0; i < tables.length; i++) {
            if (tables[i] == null) {
                self.setMatchOnTable(i);
            }
        }
    };
    
    
    self.setTeams = function (teams) {
        ranking = teams;
        qualifyingRoundModus.setTeams(ranking);
    }
    
    /**
    * @param tableIdx: index of table
    * @param score: use 0 for home team wins, 1 for duice and 2 for away team
    *           wins
    */
    self.setWinnerOnTable = function(tableIdx, score) {
        var match = tables[tableIdx];
        qualifyingRoundModus.setWinner(match, score);
        tables[tableIdx] = null;
        self.setMatchOnTable(tableIdx);
    };
    
    self.enterScore = function (match, score) {
        qualifyingRoundModus.enterScore(match, score);
    };
    
    
    /**
    *
    */
    self.setMatchOnTable = function(tableIdx) {
        if (!self.roundIsDone()) {
            var nextMatch = qualifyingRoundModus.nextMatches[0];
            tables[tableIdx] = nextMatch;
            qualifyingRoundModus.nextMatches.splice(0,1);
            if (nextMatch != null && (nextMatch.team2.ghost || nextMatch.team1.ghost)) {
                self.setWinnerOnTable(tableIdx, (nextMatch.team1.ghost ? 2 : 0));
                return;
            }
        }
        else if (qualifyingRoundModus.hasNextRound()) {
            self.nextRound();
            return;
        }
    };
    
    
    /**
    *
    **/
    self.deferMatch  = function (tableIdx) {
        var match = tables[tableIdx];
        if (match != null) {
            tables[tableIdx] = null;
            qualifyingRoundModus.nextMatches.push(match);
            self.setMatchOnTable(tableIdx);
        }
    };
    
    
    /**
    *
    */
    self.roundIsDone = function() {
        var done = qualifyingRoundModus.nextMatches.length == 0;
        var count_matches = 0;
        if (qualifyingRoundModus instanceof SwissSystem) {

            for (var i = 0; i < tables.length; i++) {
                if (tables[i] != null) {
                    count_matches += 1;
                }
            }

            done = done && (count_matches < 3);
        }
        else if  (qualifyingRoundModus instanceof KORound) {
            
            for (var i = 0; i < tables.length; i++) {
                if (tables[i] != null) {
                    done = false;
                    break;
                }
            }
        }
        
        return done;
    };
    
    self.toggleLastRound = function () {
        qualifyingRoundModus.toggleLastRound();
    };
    
    self.isLastRound = function () {
        return qualifyingRoundModus.lastRound;
    };
    
    
    /**
    *
    */
    self.startKORound = function() {
        qualifyingRoundModus = new KORound();
        qualifyingRoundModus.setRanking(ranking);
    }
}
