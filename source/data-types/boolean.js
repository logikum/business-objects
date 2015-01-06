'use strict';

var util = require('util');
var DataType = require('./data-type.js');
var DataTypeError = require('./data-type-error.js');

function Boolean () {
  Boolean.super_.call(this, 'Boolean');

  Object.freeze(this);
}
util.inherits(Boolean, DataType);

Boolean.prototype.check = function (value) {
  if (value !== null && typeof value !== 'boolean')
    throw new DataTypeError('boolean');
};

Boolean.prototype.hasValue = function (value) {
  this.check(value);
  return value != undefined && value != null;
};

module.exports = Boolean;
