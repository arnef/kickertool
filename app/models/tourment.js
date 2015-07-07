/**
 * [[Description]]
 */
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
      koRound = false,
      lastPreRound = false,
      modusModel = null,
      runningMatches = function () {
        var runningMatches = 0;
        for (var i = 0; i <tables.length; i++) {
          if (tables[i] != null) {
            runningMatches += 1;
          }
        }
        runningMatches += nextMatches.length;
        return runningMatches;
      },
      newRound = function () {
        var rm = runningMatches();
        if (koRound) {
          return rm == 0;
        }
        else if (lastPreRound) {
          return false;
        } else {
          return lastPreRound || rm < preCalcNextRound;
        }
      },
      teamIsPlaying = function (match) {
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
      },
      sortRanking = function () {
        self.getRanking().sort(function (a, b) {
            var apoints = a.isOut() ? a.getOut() : a.getPoints();
            var bpoints = b.isOut() ? b.getOut() : b.getPoints();
            return bpoints - apoints;
        });
      };


  /**
   * Set the type of the tourment
   * @param {Number} newModus
   */
  self.setModus = function (newModus) {
    modus = newModus;
    switch (newModus) {
      case FAIR_FOR_ALL:
      case ONE_ON_ONE:
      case TWO_ON_TWO:
        console.debug('set modus');
        modusModel = new SwissSystem();
        break;
    }
  };


  /**
   * Get the tourment modus
   * @returns {Number}
   */
  self.getModus = function () {
    return modus;
  };


  /**
   * Can add a Player/team during the tourment
   * @returns {Boolean}
   */
  self.canAddParticipant = function () {
    if (modus == FAIR_FOR_ALL) {
      return false;
    } else {
      var rankingLength = self.getRanking().length;
      return playedMatches.length  >= (rankingLength + (rankingLength % 2)) / 2;
    }
  };


  /**
   * Set the amount of tables
   * @param {Number} countTables
   */
  self.setTables = function (countTables) {
    tables = new Array(countTables);
  };


  /**
   * get list of tables
   * @returns {Array}
   */
  self.getTables = function () {
    return tables;
  };


  /**
   * get a match from a table
   * @param   {Number} idx index of table
   * @returns {Match}  match
   */
  self.getTable = function (idx) {
    return tables[idx];
  };


  /**
   * add a Player/Team to the tourment
   * @param   {Player/Team} p
   * @returns {Boolean}     added succesfully
   */
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


  /**
   * remove a player/team from the tourment
   * @param {Number} idx index of the participant
   */
  self.removeParticipant = function (idx) {
    var list = player;
    if (modus == TWO_ON_TWO) {
      list = teams;
    }
    list.splice(idx, 1);
  };


  /**
   * create teams for fair for all dpy
   */
  self.drawTeams = function () {
    if (modus == FAIR_FOR_ALL) {
      teams = new FairForAllDrawer(player).draw();
    }
  };


  /**
   * get all participants
   * @returns {Array}
   */
  self.getParticipants = function () {
    var list = player;
    if (modus == TWO_ON_TWO) {
      list = teams;
    }
    return list;
  };


  /**
   * get a player / team
   * @param   {Number}      idx index
   * @returns {Player/Team}
   */
  self.getParticipant = function (idx) {
    var list = player;
    if (modus == TWO_ON_TWO) {
      list = teams;
    }
    return list[idx];
  }


  /**
   * get ranking
   * @returns {Array} current Ranking
   */
  self.getRanking = function () {
    switch (modus) {
      case FAIR_FOR_ALL:
      case TWO_ON_TWO:
        return teams;
      case ONE_ON_ONE:
        return player;
    }
  };


  /**
   * [[Description]]
   * @param {[[Type]]} newLastPreRound [[Description]]
   */
  self.setLastPreRound = function (newLastPreRound) {
    lastPreRound = newLastPreRound;
  };


  /**
   * [[Description]]
   * @returns {[[Type]]} [[Description]]
   */
  self.getNextMatches = function () {
    return nextMatches;
  };


  /**
   * [[Description]]
   */
  self.nextRound = function () {
    console.debug('start next round');
    var nm = modusModel.nextRound(self.getRanking());
    console.debug(nm);
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

  /**
   * [[Description]]
   * @returns {[[Type]]} [[Description]]
   */
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
        sortRanking();
        playedMatches.push(m);
        return self.getNextMatch();
      }

    }

    return m;

  };

  /**
   * [[Description]]
   * @param {[[Type]]} tableIdx [[Description]]
   */
  self.deferMatch = function (tableIdx) {
    var match = tables[tableIdx];
    if (match != null) {
      match.stopPlaying();
      nextMatches.push(match);
      tables[tableIdx] = self.getNextMatch();
    }
  };


  /**
   * [[Description]]
   * @param   {[[Type]]} tableIdx [[Description]]
   * @returns {Boolean}  [[Description]]
   */
  self.canDeferMatch = function (tableIdx) {
    var match = tables[tableIdx];
    if (match != null) {
      return modusModel.canDeferMatch(match.getRound());
    }
    else {
      return false;
    }
  };

  /**
   * [[Description]]
   * @param   {[[Type]]} idx [[Description]]
   * @returns {Boolean}  [[Description]]
   */
  self.canReenterScore = function (idx) {
    var match = playedMatches[idx];
    if (match != null) {
      if (match.getHome().isGhost() || match.getAway().isGhost()) {
        return false;
      }
      return modusModel.canDeferMatch(match.getRound()) || modusModel.canDeferMatch(match.getRound()+1);
    } else {
      return false;
    }
  };


  /**
   * [[Description]]
   * @param {[[Type]]} match [[Description]]
   * @param {[[Type]]} score [[Description]]
   */
  self.reenterScore = function (match, score) {
    match.resetScore(score);
    sortRanking();
  };


  /**
   * [[Description]]
   * @param   {Number} tableIdx Index of table
   * @param   {Number} score    Score [WINNER_HOME, WINNER_AWAY, DRAW]
   * @returns null
   */

  self.setScoreOnTable = function (tableIdx, score) {
    var match = tables[tableIdx];
    if (match != null) {
      match.setScore(score, koRound);
      sortRanking();
      playedMatches.push(match);
      tables[tableIdx] = null;
      if (newRound()) {
        console.debug('new round');
        self.nextRound();
      } else {
        tables[tableIdx] = self.getNextMatch();
      }

    }
  };


  /**
   * [[Description]]
   * @returns {[[Type]]} [[Description]]
   */
  self.getPlayedMatches = function () {
    return playedMatches;
  };


  /**
   * [[Description]]
   */
  self.start = function () {
    if (runningMatches() == 0) {
      console.debug('Start Tourment');
      preCalcNextRound = Math.ceil(self.getRanking().length * 0.2);
      console.debug(preCalcNextRound);
      if (preCalcNextRound > tables.length) {
        preCalcNextRound = tables.length + (self.getRanking().length % 2);
        console.debug(preCalcNextRound);
      }
      self.nextRound();
    }
  };


  /**
   * [[Description]]
   * @returns {[[Type]]} [[Description]]
   */
  self.isKoRound = function () {
    return koRound;
  };


  /**
   * [[Description]]
   */
  self.startKoRound = function () {
    koRound = true;
    modusModel = new KO(self.getRanking());
    nextMatches = modusModel.nextRound(self.getRanking());
    for (var i = 0; i < tables.length; i++) {
      var m = tables[i];
      if (m != null) {
        m.stopPlaying();
      }
      tables[i] = self.getNextMatch();
    }
  };
}
