function Player(newName, newPosition, newType) {
  'use strict';

  var self = this,
    name = newName,
    position = newPosition,
    type = newType,
    ghost = false,
    playing = false,
    out = null,
    points = 0;



  self.setPosition = function (newPosition) {
    position = newPosition;
  };

  self.setPlaying = function (newPlaying) {
    playing = newPlaying;
  };

  self.isPlaying = function () {
    return playing;
  };

  self.setType = function (newType) {
    type = newType;
  };


  self.setGhost = function (newGhost) {
    ghost = newGhost;
  };


  self.isGhost = function () {
    return ghost;
  };

  self.addPoints = function (addPoints) {
    points += addPoints;
  };


  self.removePoints = function (removePoints) {
    points -= removePoints;
  };


  self.getName = function () {
    return name;
  };


  self.getPosition = function () {
    return position;
  };


  self.getType = function () {
    return type;
  };


  self.getInfo = function () {
    var playerType = '';
    switch (type) {
      case PRO:
        playerType = 'gesetzt';
        break;
      case AMATEUR:
        playerType = 'gelost';
        break;
    }
    var playerPosition = '';
    switch (position) {
      case STRIKER:
        playerPosition = 'Stürmer';
        break;
      case GOALIE:
        playerPosition = 'Torwart';
        break;
      case BOTH:
        playerPosition = 'Tortwart/Stürmer';
        break;
    }
    return playerPosition + ' ' + playerType;
  };


  self.getPoints = function () {
    return points;
  };

  self.setOut = function (newOut) {
    out = newOut;
  };

  self.getOut = function () {
    return out;
  };

  self.isOut = function () {
    return out != null;
  };


  self.equals = function (player) {
    return self.getName().split(' ').join('').toLowerCase()
      === player.getName().split(' ').join('').toLowerCase();
  };

}
Player.ghost = function () {
  var p = new Player('Freilos');
  p.setGhost(true);
  return p;
};
