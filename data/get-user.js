'use strict';

const User = require( './user.js' );

const userReader = function () {
  return new User(
    'ada-lovelace',
    'Ada Lovelace',
    'ada.lovelace@computer.net',
    [ 'administrators', 'developers', 'designers' ]
  );
};

module.exports = userReader;
