(function () {
  'use strict';

  Array.prototype.shuffle = function () {
    var i, j, temp;
    i = this.length;
    if (i === 0) return this;
    while (--i) {
      j = Math.floor(Math.random() * (i + 1));
      temp = this[i];
      this[i] = this[j];
      this[j] = temp;
    }
    return this;
  };



  angular.module('app').
  service('TeamDrawer', function () {
    var _self = this,
      _teams = [];

    // player values
    _self.GOALIE = 1;
    _self.STRIKER = 2;
    _self.BOTH = 4;
    _self.AMATEUR = 8;
    _self.PRO = 16;


    // calculate value of two players
    var teamValue = function (player1, player2) {
      return player1.type + player2.type + player1.position + player2.position;
    };

    // best value for two player
    var bestValue = function (player1, player2) {
      var value1 = _self.GOALIE + _self.STRIKER + _self.AMATEUR + _self.PRO;
      var value2 = _self.GOALIE + _self.BOTH + _self.AMATEUR + _self.PRO;
      var value3 = _self.STRIKER + _self.BOTH + _self.AMATEUR + _self.PRO;

      var team = teamValue(player1, player2);
      return team === value1 || team === value2 || team === value3;
    };

    // fair value for two players
    var fairValue = function (player1, player2) {
      var value = _self.BOTH + _self.BOTH + _self.AMATEUR + _self.PRO;
      return teamValue(player1, player2) === value;
    };

    // bad value for two players
    var badValue = function (player1, player2) {
      return player1.name !== player2.name;
    };

    // compaire players
    var compaire = function (playerList, matchValue, danger) {
      var playerListCopy = playerList.shuffle();
      var noMatches = [];
      while (playerListCopy.length > 0) {
        var player = playerListCopy.pop();
        var match = false;

        for (var i = 0; i < playerList.length; i++) {
          if (matchValue(player, playerList[i])) {
            _teams.push({
              name: player.name + ' / ' + playerList[i].name,
              points: 0,
              danger: danger,
              out: false,
              matches: 0
            });
            playerList.splice(i, 1);
            match = true;
            break;
          }
        }
        if (!match) {
          noMatches.push(player);
        }
      }
      return noMatches;
    };

    /**
     *
     * @param playerList
     * @returns {Array}
     */
    _self.draw = function (playerList, joker) {
      playerList = angular.copy(playerList);
      if (joker === true) {
        playerList.push({
          name: 'JOKER',
          type: _self.PRO,
          position: _self.BOTH
        });
      }
      if (!_self.canDraw(playerList)) {
        return [];
      }
      _teams = [];
      playerList = angular.copy(playerList);
      playerList = compaire(playerList, bestValue, false);
      if (playerList.length > 0) {
        playerList = compaire(playerList, fairValue, false);
      }
      if (playerList.length > 0) {
        playerList = compaire(playerList, badValue, true);
      }

      return _teams;
    };

    _self.canDraw = function (playerList) {
      var l;

      l = playerList.length;
      return l % 2 === 0 && l > 3;
    };
  });
})();
