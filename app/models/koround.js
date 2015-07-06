function KO(newRanking) {
    'use strict';

    var self = this,
        ranking = newRanking,
        finals = false;

    self.getRoundString = function (round) {
      switch (round) {
        case 1:
          return 'Finale';
          case 2:
          return 'Halbfinale';
        case 4:
          return 'Viertelfinale';
        case 8:
          return 'Achtelfinale';
        default:
          return round + '. Finale';
        }
    };


    var getRound = function (c) {
      var round = 1;
      while (c > round) {
        round = round * 2;
      }
    };


    self.nextRound = function (teams) {
      var round = getRound(teams.length);
      for (var i = 0; round; i++) {
        
      }
    };
    
}
