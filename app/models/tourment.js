function Tourment() {
  'use strict';
  
  var self = this,
    tables = new Array(2),
    player = [],
    ranking = null,
    modus = null;
  
  self.setModus = function (newModus) {
    modus = newModus;
  };
  
  self.addPlayer = function(newPlayer) {
    var playerInList = false;
    for (var i = 0; i < player.length; i++) {
      if (player[i].equals(newPlayer)) {
          playerInList = true;
      }
    }
    if (!playerInList) {
      player.push(newPlayer);
    }
    return !playerInList;
  }
}