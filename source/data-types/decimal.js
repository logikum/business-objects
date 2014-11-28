'use strict';

var util = require('util');
var DataType = require('./data-type.js');
var DataTypeError = require('./data-type-error.js');

function Decimal() {
  Decimal.super_.call(this, 'Decimal');

  Object.freeze(this);
}
util.inherits(Decimal, DataType);

Decimal.prototype.check = function (value) {
  if (value !== null && typeof value !== 'number')
    throw new DataTypeError('The passed value is not Decimal.');
};

Decimal.prototype.hasValue = function (value) {
  this.check(value);
  return value != undefined && value != null;
};

module.exports = Decimal;
