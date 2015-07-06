function Tourment() {
  'use strict';
  
  var self = this,
    tables = new Array(2),
    player = [],
    teams = [],
    playedMatches = [],
    nextMatches = [],
    modus = null,
    preCalcNextRound = null,
    modusModel = null;
  
  
  
  self.setModus = function (newModus) {
    modus = newModus;
    switch (newModus) {
      case FAIR_FOR_ALL:
      case ONE_ON_ONE:
      case TWO_ON_TWO:
        modusModel = new SwissSystem(self.getRanking());
        break;
      case KO_ROUND:
        modusModel = new KoRound();
        break;
    }
  };
  
  
  self.getModus = function () {
    return modus;
  };
  
  
  self.setTables = function (countTables) {
    tables = new Array(countTables);
  };
  
  
  self.getTables = function () {
    return tables;
  };
  
  
  self.getTable = function (idx) {
    return tables[idx];
  };
    
  self.addParticipant = function (p) {
    var list = player;
    if (modus == TWO_ON_TWO) {
      list = teams;
    }
    var playerInList = false;
    for (var i = 0; i < list.length; i++) {
      if (list[i].equals(p)) {
        playerInList = true;
        break;
      }
    }
    if (!playerInList) {
      list.push(p);
    }
    return !playerInList;
  };
  
  
  self.removeParticipant = function (idx) {
    var list = player;
    if (modus == TWO_ON_TWO) {
      list = teams;
    }
    list.splice(idx, 1);
  };
  
  
  self.drawTeams = function () {
    if (modus == FAIR_FOR_ALL) {
      teams = new FairForAllDrawer(player).draw();
    }
  };
  
  
  self.getParticipants = function () {
    var list = player;
    if (modus == TWO_ON_TWO) {
      list = teams;
    }
    return list;
  };
  
  self.getParticipant = function (idx) {
    var list = player;
    if (modus == TWO_ON_TWO) {
      list = teams;
    }
    return list[idx];
  }
  
  
  self.getRanking = function () {
    switch (modus) {
      case FAIR_FOR_ALL:
      case TWO_ON_TWO:
        return teams;
      case ONE_ON_ONE:
        return player;
    }
  };
  
  
  
  self.getNextMatches = function () {
    return nextMatches;
  };
  
  var newRound = function () {
    var runningMatches = 0;
    for (var i = 0; i <tables.length; i++) {
      if (tables[i] != null) {
        runningMatches += 1;
      }
    }
    runningMatches += nextMatches.length;
    console.debug(preCalcNextRound);
    return runningMatches < preCalcNextRound;
  };
  
  var teamIsPlaying = function (match) {
    var playing = false;
    for (var i = 0; i < tables.length; i++) {
      var matchOnTable = tables[i];
      if (matchOnTable != null) {
        if (match.getHome().equals(matchOnTable.getHome())
            || match.getAway().equals(matchOnTable.getAway())
            || match.getHome().equals(matchOnTable.getAway())
            || match.getAway().equals(matchOnTable.getHome())
            ) {
          playing = true;
          break;
        }
      }
    }
    return playing;
  };
  
  self.nextRound = function () {
    var nm = modusModel.nextRound();
    if (nm.length > 0) {
      console.debug('next round');
      nextMatches = nextMatches.concat(nm);
      for (var i = 0; i < tables.length; i++) {
        if (tables[i] == null) {
          console.debug('free table', i);
          tables[i] = self.getNextMatch();
        }
      }
    }
  };
  
  self.getNextMatch = function () {
    var m = nextMatches[0];
    nextMatches.splice(0, 1);
    if (m != null) {
      if (m.getHome().isPlaying() || m.getAway().isPlaying()) {
        nextMatches.push(m);
        return self.getNextMatch();
      }
      
      m.startPlaying();
      if (m.getHome().isGhost() || m.getAway().isGhost()) {
        var score = m.getHome().isGhost() ? 102 : 100;
        m.setScore(score);
        playedMatches.push(m);
        return self.getNextMatch();
      }
      
    }

    return m;
    
  };
  
  self.deferMatch = function (tableIdx) {
    var match = tables[tableIdx];
    if (match != null) {
      match.stopPlaying();
      nextMatches.push(match);
      tables[tableIdx] = self.getNextMatch();
    }
  };
  
  
  self.canDeferMatch = function (tableIdx) {
    var match = tables[tableIdx];
    if (match != null) {
      return modusModel.canDeferMatch(match.getRound());
    }
    else {
      return false;
    }
  };
  
  
  self.setScoreOnTable = function (tableIdx, score) {
    var match = tables[tableIdx];
    if (match != null) {
      match.setScore(score);
      playedMatches.push(match);
      tables[tableIdx] = null;
      if (newRound()) {
        console.debug('new round');
        self.nextRound();
      } else {
        tables[tableIdx] = self.getNextMatch();
      }
      self.getRanking().sort(function (a, b) {
        return b.getPoints() - a.getPoints();
      }); 
    }
  };
  
  
  self.getPlayedMatches = function () {
    return playedMatches;
  };
  
  
  self.start = function () {
    preCalcNextRound = Math.ceil(self.getRanking().length * 0.2);
    if (preCalcNextRound > tables.length)
      preCalcNextRound = tables.length + (self.getRanking().length % 2);
    self.nextRound();
  };
  
  
  // dummy data for testing
  (function () {
    self.setModus(ONE_ON_ONE);  
    for (var i = 0; i < 13; i++) {
      self.addParticipant(new Player('Player ' + (i+1)));
    }
  })();
  
}