'use strict';

var util = require('util');

function ArgumentError(message) {
  ArgumentError.super_.call(this);

  this.name = 'ArgumentError';

  this.message = message || 'The passed value is invalid.';
}
util.inherits(ArgumentError, Error);

module.exports = ArgumentError;
