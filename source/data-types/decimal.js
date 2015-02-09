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
function Decimal () {
  DataType.call(this);

  // Immutable object.
  Object.freeze(this);
}
util.inherits(Decimal, DataType);

/**
 * Checks if value is a Decimal data.
 *
 * @function bo.dataTypes.Decimal#check
 * @param {?data} value - The value to check.
 *
 * @throws {@link bo.dataTypes.DataTypeError Data type error}: The passed value is not Decimal.
 */
Decimal.prototype.check = function (value) {

  if (value !== null && typeof value !== 'number' && !(value instanceof Number))
    throw new DataTypeError('decimal');
};

/**
 * Checks if value is a Decimal data and is not null.
 *
 * @function bo.dataTypes.Decimal#hasValue
 * @param {!data} value - The value to check.
 * @returns {boolean} True if the value is Decimal and not null, otherwise false.
 *
 * @throws {@link bo.dataTypes.DataTypeError Data type error}: The passed value is not Decimal.
 */
Decimal.prototype.hasValue = function (value) {

  this.check(value);
  return value != undefined && value != null;
};

module.exports = Decimal;
