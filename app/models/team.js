function Team(player1, player2) {
  'use strict';

  var self = this,
      _player1 = player1,
      _player2 = player2;

  Participant.apply(self, null);


  /**
   * [[Description]]
   * @returns {String} [[Description]]
   */
  self.getName = function () {
    return _player1.getName() + ' / ' + _player2.getName();
  };


  /**
   * [[Description]]
   * @returns {Player}
   */
  self.getPlayer1 = function () {
    return _player1;
  };


  /**
   * [[Description]]
   * @returns {Player} [[Description]]
   */
  self.getPlayer2 = function () {
    return _player2;
  };


  /**
   * [[Description]]
   * @param   {Object}  team [[Description]]
   * @returns {Boolean}
   */
  self.equals = function (team) {
    return (self.getPlayer1().equals(team.getPlayer1()) && self.getPlayer2().equals(team.getPlayer2()))
      || (self.getPlayer1().equals(team.getPlayer2()) && self.getPlayer2().equals(team.getPlayer1()));
  };
}
Team.prototype.getName = this.getName;
Team.prototype.equals = this.equals;
