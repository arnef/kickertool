function Team(newPlayer1, newPlayer2) {
  'use strict';
  
  var self = this,
    player1 = newPlayer1,
    player2 = newPlayer2,
    points = 0;
  
  
  self.addPoints = function (addPoints) {
    points += addPoints;
  };
  
  
  self.removePoints = function (removePoints) {
    points -= removePoints;
  };
  
  
  self.getName = function () {
    return player1.getName() + ' / ' + player2.getName();
  };
  
  self.getPlayer1 = function () {
    return player1;
  };
  
  self.getPlayer2 = function () {
    return player2;
  };
  
  self.equals = function (team) {
    return (self.getPlayer1().equals(team.getPlayer1()) && self.getPlayer2().equals(team.getPlayer2()))
      || (self.getPlayer1().equals(team.getPlayer2()) && self.getPlayer2().equals(team.getPlayer1()));
  };
}