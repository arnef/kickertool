function SwissSystem(newRanking) {
  'use strict';
  
  var self = this,
    ranking = newRanking,
    round = 0,
    lastRound = false,
    matches = null,
    nextMatches = [],
    playedMatches = [];
  
  
  var maxRounds = function () {
    return ranking.length -1;
  };
  
 
  
  self.nextRound = function () {
    if (round < maxRounds()) {
      matches = [].concat(playedMatches);
      if (round == 0) {
        ranking.shuffle();
      }
      round += 1;
      
      var teams = [].concat(ranking);
      var useNext = 0;
      
      while (teams.length > 0) {
        var t1 = teams[0];
        var t2 = teams[(useNext + 1)];
        if (t2 == null) {
          t2 = Player.ghost();
        }
        var match = new Match(t1, 
                              t2,
                              round);
        var matchPlayed = false;
        for (var i = 0; i < playedMatches.length; i++) {
          if (playedMatches[i].equals(match)) {
              matchPlayed = true;
              break;
          }          
        }
        
        if (matchPlayed) {
          useNext += 1;
        } else {
          nextMatches.push(match);
          teams.splice(0, 1);
          teams.splice(useNext, 1);
          useNext = 0;
        }
      }
    }
  };
  
  self.getNextMatches = function () {
    return nextMatches;
  };
  
}