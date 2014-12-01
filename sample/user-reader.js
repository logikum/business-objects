'use strict';

var User = require('./user.js');

var userReader = function () {
  return new User('marmarosi', 'Mármarosi József', 'marmarosi@logikum.hu', ['administrators']);
};

module.exports = userReader;
