function Player(newName) {
  'use strict';
  
  var self = this,
    name = newName,
    position = null,
    type = null,
    points = 0;
  
  
  self.setPosition = function (newPosition) {
    position = newPosition;
  };
  
  
  self.setType = function (newType) {
    type = newType;
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
  
  
  self.equals = function (player) {
    return self.getName().split(' ').join('').toLowerCase()
      === player.getName().split(' ').join('').toLowerCase();
  };
  
}
Player.dyp = function (name, position, type) {
  'use strict';
  
  var p = new Player(name);
  p.setPosition(position);
  p.setType(type);
  
  return p;
};