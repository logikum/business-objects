'use strict';

var util = require('util');
var DataType = require('./data-type.js');
var DataTypeError = require('./data-type-error.js');

function Integer() {
  Integer.super_.call(this, 'Integer');

  Object.freeze(this);
}
util.inherits(Integer, DataType);

Integer.prototype.check = function (value) {
  if (value !== null && (typeof value !== 'number' || value % 1 !== 0))
    throw new DataTypeError('The passed value is not Integer.');
};

Integer.prototype.hasValue = function (value) {
  this.check(value);
  return value != undefined && value != null;
};

module.exports = Integer;
