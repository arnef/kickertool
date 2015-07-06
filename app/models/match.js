function Match(newHome, newAway, newRound) {
  'use strict';
  
  
  var self = this,
    home = newHome,
    away = newAway,
    round = newRound,
    score = null;
  
  self.setScore = function (newScore) {
    score = newScore;
    switch (score) {
      case WINNER_HOME:
        home.addPoints(2);
        break;
      case DRAW:
        home.addPoints(1);
        away.addPoints(1);
        break;
      case WINNER_AWAY:
        away.addPoints(2);
        break;
    }
  };
  
  
  self.resetScore = function (newScore) {
    switch (score) {
      case WINNER_HOME:
        home.removePoints(2);
        break;
      case DRAW:
        home.removePoints(1);
        away.removePoints(1);
        break;
      case WINNER_AWAY:
        away.removePoints(2);
        break;
    }
    self.setScore(newScore);
  };
  
  
  self.getScore = function () {
    switch (score) {
      case WINNER_HOME:
        return '2:0';

      case DRAW:
        return '1:1';

      case WINNER_AWAY:
        return '0:2';

      default:
        return 'vs.';
    }
  };
  
  
  self.getHome = function () {
    return home;
  };
  
  
  self.getAway = function () {
    return away;
  };
  
  self.getRound = function () {
    return round;
  };
  
  
  self.equals = function (match) {
    return (
      (self.getHome().equals(match.getHome()) 
       && self.getAway().equals(match.getAway()))
      ||
      (self.getHome().equals(match.getAway())
       && self.getAway().equals(match.getHome()))
    );
  };
}