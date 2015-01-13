/**
 * Date-time data type module.
 * @module data-types/date-time
 */
'use strict';

var util = require('util');
var DataType = require('./data-type.js');
var DataTypeError = require('./data-type-error.js');

function DateTime() {
  DateTime.super_.call(this, 'DateTime');

  // Immutable object.
  Object.freeze(this);
}
util.inherits(DateTime, DataType);

DateTime.prototype.check = function (value) {

  if (value !== null && !(value instanceof Date))
    throw new DataTypeError('date');
};

DateTime.prototype.hasValue = function (value) {

  this.check(value);
  return value != undefined && value != null;
};

module.exports = DateTime;
