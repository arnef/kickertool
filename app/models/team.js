function Team(newPlayer1, newPlayer2) {
  'use strict';

  var self = this,
    player1 = newPlayer1,
    player2 = newPlayer2,
    playing = false,
    out = null,
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

  self.setPlaying = function (newPlaying) {
    playing = newPlaying;
  };

  self.isPlaying = function () {
    return playing;
  };

  self.isGhost = function () {
    return false;
  };


  self.setOut = function (newOut) {
    out = newOut;
  };

  self.isOut = function () {
    return out != null;
  };

  self.getOut = function () {
    return out;
  };

  self.getPoints = function () {
    return points;
  };

  self.equals = function (team) {
    return (self.getPlayer1().equals(team.getPlayer1()) && self.getPlayer2().equals(team.getPlayer2()))
      || (self.getPlayer1().equals(team.getPlayer2()) && self.getPlayer2().equals(team.getPlayer1()));
  };
}
