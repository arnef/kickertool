function Player(name, position, type) {
  'use strict';
  var self = this,
      _name = name,
      _position = position,
      _type = type;

  Participant.apply(self, null);


  /**
   * [[Description]]
   * @returns {String}
   */
  self.getName = function () {
    return _name;
  };


  /**
   * [[Description]]
   * @param {Number} position [[Description]]
   */
  self.setPosition = function (position) {
    _position = position;
  };


  /**
   * [[Description]]
   * @returns {Number} [[Description]]
   */
  self.getPosition = function () {
    return _position;
  };


  /**
   * [[Description]]
   * @param   {Number}   type
   */
  self.setType = function (type) {
    _type = type;
  };


  /**
   * [[Description]]
   * @returns {Number} [[Description]]
   */
  self.getType = function () {
    return _type;
  };

  self.getInfo = function () {
    return _type + ' ' + _position;
  };
};
Player.prototype = new Participant();
Player.prototype.getName  = this.getName;
Player.ghost = function () {
  var p = new Player('Freilos');
  p.setGhost(true);
  return p;
};
