function Participant() {
  'use strict';

  var self = this,
      _ghost = false,
      _out = null,
      _playing = false,
      _points = 0;


  /**
   * [[Description]]
   * @param {Boolean} ghost
   */
  self.setGhost = function (ghost) {
    _ghost = ghost;
  };


  /**
   * [[Description]]
   * @returns {Boolean}
   */
  self.isGhost = function () {
    return _ghost;
  };


  /**
   * [[Description]]
   * @param {Number} out
   */
  self.setOut = function (out) {
    _out = out;
  };


  /**
   * [[Description]]
   * @returns {Boolean}
   */
  self.isOut = function () {
    return _out != null && _out < 0;
  };


  /**
   * [[Description]]
   * @returns {Number} [[Description]]
   */
  self.getOut = function () {
    return _out;
  };


  /**
   * [[Description]]
   * @param {Boolean} playing [[Description]]
   */
  self.setPlaying = function (playing) {
    _playing = playing;
  };


  /**
   * [[Description]]
   * @returns {Boolean}
   */
  self.isPlaying = function () {
    return _playing;
  };


  /**
   * [[Description]]
   * @param {Number} points [[Description]]
   */
  self.addPoints = function (points) {
    _points += points;
  };


  /**
   * [[Description]]
   * @param {Number} points [[Description]]
   */
  self.removePoints = function (points) {
    _points -= points;
  };


  /**
   * [[Description]]
   * @returns {Number}
   */
  self.getPoints = function () {
    return _points;
  };


  /**
   * [[Description]]
   * @param {Player} player [[Description]]
   */
  self.equals = function (player) {
    return self.getName().split(' ').join('').toLowerCase()
      == player.getName().split(' ').join('').toLowerCase();
  };
}
Participant.prototype.getName = function () {
  throw new Error('abstract method');
};
