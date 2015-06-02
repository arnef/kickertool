function Tourment() {
    'use strict';
    
    var FAIR_FOR_ALL = 0,
        ONE_ON_ONE = 1,
        TWO_ON_TWO = 2;
    
    var self = this,
        tables = new Array(2),
        ranking = null,
        qualifyingRoundModus = new SwissSystem();
    
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
            if (nextMatch == null) return;
            tables[tableIdx] = nextMatch;
            qualifyingRoundModus.nextMatches.splice(0,1);
            
            // freilos automatisch weitersetzen
            if (nextMatch != null && (nextMatch.team2.ghost || nextMatch.team1.ghost)) {
                self.setWinnerOnTable(tableIdx, (nextMatch.team1.ghost ? 2 : 0));
                return;
            }
            
            // prüfen ob teams noch spielen
            var team1 = nextMatch.team1.name;
            var team2 = nextMatch.team2.name;
            for (var i = 0; i < tables.length; i++) {
                if (i != tableIdx) {
                    var match_on_table = tables[i];
                    console.debug(match_on_table);
                    if (match_on_table != null) {
                        var team_playing = match_on_table.team1.name == team1 || 
                                match_on_table.team2.name == team1 || 
                                match_on_table.team1.name == team2 ||
                                match_on_table.team2.name == team2;
                        console.debug(team_playing);
                        if (team_playing) {
                            self.deferMatch(tableIdx);
                            return;
                        }
                    }
                    else {
                        self.setMatchOnTable(i);
                        return;
                    }
                }
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
            console.debug('defer match ' + tableIdx + ': ' + match.team1.name + ' vs. ' + match.team2.name);
            tables[tableIdx] = null;
            qualifyingRoundModus.nextMatches.push(match);
            if (qualifyingRoundModus.nextMatches.length > tables.length) {
                self.setMatchOnTable(tableIdx);
            }
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
