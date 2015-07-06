function SwissSystem(newRanking) {
  'use strict';
  
  var self = this,
    ranking = newRanking,
    round = 0,
    lastRound = false,
    matches = null,
    playedMatches = [];
  
  
  var maxRounds = function () {
    return ranking.length -1;
  };
  
  self.canDeferMatch = function (matchRound) {
    return round == matchRound;
  };
 
  
  self.nextRound = function () {
    var nextMatches = [];
    if (round < maxRounds()) {
      round += 1;
      if (round == 1) {
        ranking.shuffle();
      }
      
      
      var teams = [].concat(ranking);
      
      if (teams.length % 2 == 1) {
        console.debug('add ghost team');
        teams.push(Player.ghost());
      }
      var useNext = 0;
      
      while (teams.length > 0) {
        var t1 = teams[0];
        var t2 = teams[(useNext + 1)];
        
        //console.debug('Match', t1.getName(), 'vs.', t2.getName());
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
          if (useNext > teams.length) {
            console.debug('kein match');
            return;
          }
        } else {
          nextMatches.push(match);
          playedMatches.push(match);
          teams.splice(0, 1);
          teams.splice(useNext, 1);
          useNext = 0;
        }
      }
    }
    return nextMatches;
  };
  
  /**self.getNextMatches = function () {
    return nextMatches;
  };*/
  
}