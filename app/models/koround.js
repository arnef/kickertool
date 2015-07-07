/**
 * [[Description]]
 */
function KO() {
    'use strict';

    var self = this,
        finals = false,
        currentRound = null,
        getRound = function (c) {
          var round = 1;
          while (c > round) {
            round = round * 2;
          }
          return round / 2;
        };


  /**
   * [[Description]]
   * @param   {Number}   matchRound
   * @returns {Boolean}
   */
  self.canDeferMatch = function (matchRound) {
    return matchRound == currentRound;
  };


  /**
   * [[Description]]
   * @param   {Array} ranking current ranking
   * @returns {Array} list of next matches
   */
  self.nextRound = function (ranking) {
    var teams = [];
    for (var i = 0; i < ranking.length; i++) {
      if (!ranking[i].isOut()) {
        teams.push(ranking[i]);
      }
    }
    var nextMatches = [];
    var round = getRound(teams.length);
    currentRound = -round;
    if (round >= 1) {
      for (var i = 0; i < round; i++) {
        var p1 = teams[i];
        var p2 = teams[(round*2) - i - 1];
        if (p2 == null) {
          p2 = new Player.ghost();
        }
        var match = new Match(p1, p2, -round);
        nextMatches.push(match);
      }
    }
    return nextMatches;
  };

}
