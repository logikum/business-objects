'use strict';

var util = require('util');

function DataTypeError(message) {
  DataTypeError.super_.call(this);

  this.name = 'DataTypeError';

  this.message = message || 'The data type of the passed value is invalid.';
}
util.inherits(DataTypeError, Error);

module.exports = DataTypeError;
