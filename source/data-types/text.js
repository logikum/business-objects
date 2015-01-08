'use strict';

var util = require('util');
var DataType = require('./data-type.js');
var DataTypeError = require('./data-type-error.js');

function Text() {
  Text.super_.call(this, 'Text');

  // Immutable object.
  Object.freeze(this);
}
util.inherits(Text, DataType);

Text.prototype.check = function (value) {
  if (value !== null && typeof value !== 'string'  && !(value instanceof String))
    throw new DataTypeError('text');
};

Text.prototype.hasValue = function (value) {
  this.check(value);
  return value !== null && value.length > 0;
};

module.exports = Text;
