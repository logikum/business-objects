'use strict';

var util = require('util');
//var t = require('./i18n-bo.js')('ArgumentError');

function ArgumentError(message) {
  ArgumentError.super_.call(this);

  this.name = 'ArgumentError';

  //this.message = t.apply(this, arguments) || 'The passed value is invalid.';
  this.message = message || 'The passed value is invalid.';
}
util.inherits(ArgumentError, Error);

module.exports = ArgumentError;
