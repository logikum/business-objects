'use strict';

var util = require('util');

function NotImplementedError(message) {
  NotImplementedError.super_.call(this);

  this.name = 'NotImplementedError';

  this.message = message || 'The method is not implemented.';
}
util.inherits(NotImplementedError, Error);

module.exports = NotImplementedError;
