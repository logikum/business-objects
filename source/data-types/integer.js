'use strict';

var util = require('util');
var DataType = require('./data-type.js');
var DataTypeError = require('./data-type-error.js');

/**
 * @classdesc Provide methods to work with Integer data.
 * @description Creates Integer data type definition.
 *
 * @memberof bo.dataTypes
 * @constructor
 *
 * @extends bo.dataTypes.DataType
 */
function Integer () {
  // Immutable object.
  DataType.call(this);
}
util.inherits(Integer, DataType);

/**
 * Checks if value is an Integer data.
 *
 * @function bo.dataTypes.Integer#check
 * @param {*} [value] - The value to check.
 *
 * @throws {@link bo.dataTypes.DataTypeError Data type error}: The passed value is not Integer.
 */
Integer.prototype.check = function (value) {
  if (value !== null &&
      (typeof value !== 'number' || value % 1 !== 0) &&
      (!(value instanceof Number) || value % 1 !== 0))
    throw new DataTypeError('integer');
};

/**
 * Checks if value is an Integer data and is not null.
 *
 * @function bo.dataTypes.Integer#hasValue
 * @param {data} value - The value to check.
 * @returns {boolean} True if the value is Integer and not null, otherwise false.
 *
 * @throws {@link bo.dataTypes.DataTypeError Data type error}: The passed value is not Integer.
 */
Integer.prototype.hasValue = function (value) {
  this.check(value);
  return value != undefined && value != null;
};

module.exports = Integer;
