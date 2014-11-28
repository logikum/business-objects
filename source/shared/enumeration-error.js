'use strict';

var util = require('util');

function EnumerationError(message) {
  EnumerationError.super_.call(this);

  this.name = 'EnumerationError';

  this.message = message || 'An enumeration error occurred.';
}
util.inherits(EnumerationError, Error);

module.exports = EnumerationError;
