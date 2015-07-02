function Tourment() {
  'use strict';
  
  var self = this,
    tables = new Array(2),
    player = [],
    teams = null,
    ranking = null,
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
  self.setModus(FAIR_FOR_ALL);
  self.getModus = function () {
    return modus;
  };
  
  
  self.setTables = function (countTables) {
    tables = new Array(countTables);
  };
  
    
  self.addPlayer = function (newPlayer) {
    var playerInList = false;
    for (var i = 0; i < player.length; i++) {
      if (player[i].equals(newPlayer)) {
        playerInList = true;
        break;
      }
    }
    if (!playerInList) {
      player.push(newPlayer);
    }
    return !playerInList;
  };
  
    
  self.addTeam = function (newTeam) {
    var teamInList = false;
    for (var i = 0; i < teams.length; i++) {
      if (teams[i].equals(newTeam)) {
        teamInList = true;
        break;
      }
    }
    if (!teamInList) {
      teams.push(newTeam);
    }
    return !teamInList;
  };
  
  
  self.getPlayer = function () {
    return player;
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