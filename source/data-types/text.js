'use strict';

var util = require('util');
var DataType = require('./data-type.js');
var DataTypeError = require('./data-type-error.js');

/**
 * @classdesc Provide methods to work with Text data.
 * @description Creates Text data type definition.
 *
 * @memberof bo.dataTypes
 * @constructor
 *
 * @extends bo.dataTypes.DataType
 */
function Text() {
  Text.super_.call(this, 'Text');

  // Immutable object.
  Object.freeze(this);
}
util.inherits(Text, DataType);

/**
 * Checks if value is a Text data.
 *
 * @function bo.dataTypes.Text#check
 * @param {?data} value - The value to check.
 *
 * @throws {@link bo.dataTypes.DataTypeError Data type error}: The passed value is not Text.
 */
Text.prototype.check = function (value) {
  if (value !== null && typeof value !== 'string'  && !(value instanceof String))
    throw new DataTypeError('text');
};

/**
 * Checks if value is a Text data and is not null.
 *
 * @function bo.dataTypes.Text#hasValue
 * @param {!data} value - The value to check.
 * @returns {boolean} True if the value is Text and not null, otherwise false.
 *
 * @throws {@link bo.dataTypes.DataTypeError Data type error}: The passed value is not Text.
 */
Text.prototype.hasValue = function (value) {
  this.check(value);
  return value !== null && value.length > 0;
};

module.exports = Text;
