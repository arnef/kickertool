function FairForAllDrawer(newPlayer) {
  'use strict';
  
  var self = this,
    teams = [],
    player = newPlayer.slice();
  
  var teamValue = function (player1, player2) {
    return player1.getType() + player2.getType()
      + player1.getPosition() + player2.getPosition();
  };
  
  var niceMatch = function (player1, player2) {
    var match1 = GOALIE + STRIKER + AMATEUR + PRO;
    var match2 = GOALIE + BOTH + AMATEUR + PRO;
    var match3 = STRIKER + BOTH + AMATEUR + PRO;
    
    var team = teamValue(player1, player2);
    
    return team == match1
      || team == match2
      || team == match3;
  };
  
  var fairMatch = function (player1, player2) {
    var match = BOTH + BOTH + AMATEUR + PRO;
    var team = teamValue(player1, player2);
    
    return team == match;
  };
  
  var badMatch = function (player1, player2) {
    return !player1.equals(player2);
  };
  
  var compairePlayer = function (players, matchMethod, danger) {
    var player2 = players.shuffle();
    var noMatches = [];
    while (player2.length > 0) {
      var p1 = player2.pop(),
        match = false;
      
      for (var i = 0; i < players.length; i++) {
        var p2 = players[i];
        if (matchMethod(p1, p2)) {
          var team = new Team(p1, p2);
          team.danger = danger;
          teams.push(team);
          players.splice(i, 1);
          match = true;
          break;
        }
      }
      if (!match) {
        noMatches.push(p1);
      }
    }
    return noMatches;
  };
  
  
  self.draw = function () {
    teams = [];
    player = compairePlayer(player, niceMatch, false);
    if (player.length > 0) {
      player = compairePlayer(player, fairMatch, false);
    }
    if (player.length > 0) {
      player = compairePlayer(player, badMatch, true);
    }
    return teams;
  };
  
}