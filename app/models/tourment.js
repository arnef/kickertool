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
        modusModel = new SwissSystem();
        break;
      case KO_ROUND:
        modusModel = new KoRound();
        break;
    }
  };
  self.setModus(ONE_ON_ONE);
  self.getModus = function () {
    return modus;
  };
  
  
  self.setTables = function (countTables) {
    tables = new Array(countTables);
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
        return teams.sort(function (a, b) {
          return a.points - b.points;
        });
      case ONE_ON_ONE:
        return player.sort(function (a, b) {
          return a.points - b.points;
        });
    }
  };
  
  
  self.setScoreOnTable = function (tableIdx, score) {
    var match = tables[tableIdx];
    if (match != null) {
      match.setScore(score);
      playedMatches.push(match);
      tables[tableIdx] = null;
    }
  };
}