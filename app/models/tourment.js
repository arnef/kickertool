function Tourment() {
  'use strict';
  
  var self = this,
    tables = new Array(2),
    player = [],
    teams = [],
    playedMatches = [],
    modus = null,
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
  
  
  self.setScoreOnTable = function (tableIdx, score) {
    var match = tables[tableIdx];
    if (match != null) {
      match.setScore(score);
      playedMatches.push(match);
      tables[tableIdx] = self.getNextMatch();
      self.getRanking().sort(function (a, b) {
        return b.getPoints() - a.getPoints();
      });
      
    }
  };
  
  self.getNextMatches = function () {
    return modusModel.getNextMatches();
  };
  
  self.getNextMatch = function () {
    var m = self.getNextMatches()[0];
    self.getNextMatches().splice(0, 1);
    
    if (m != null 
        && (m.getHome().isGhost() || m.getAway().isGhost())) {
      var score = m.getHome().isGhost() ? 102 : 100;
      m.setScore(score);
      playedMatches.push(m);
      return self.getNextMatch();
    };
    
    return m;
  };
  
  self.getPlayedMatches = function () {
    return playedMatches;
  };
  
  self.nextRound = function () {
    modusModel.nextRound();
    for (var i = 0; i < tables.length; i++) {
      if (tables[i] == null) {
        tables[i] = self.getNextMatch();
      }
    }
  };
    
  
  // dummy data for testing
  (function () {
    self.setModus(ONE_ON_ONE);  
    for (var i = 0; i < 7; i++) {
      self.addParticipant(new Player('Player ' + (i+1)));
    }
  })();
  
}