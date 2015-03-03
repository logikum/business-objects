'use strict';

var util = require('util');
var DataType = require('./data-type.js');

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
 * @function bo.dataTypes.Integer#parse
 * @param {*} [value] - The value to check.
 * @returns {*} The Integer value or null when the input value is valid, otherwise undefined.
 */
Integer.prototype.parse = function (value) {

  if (value === null)
    return value;
  if (value === undefined)
    return null;

  var integer;
  if (typeof value === 'number')
    integer = value;
  else if (value instanceof Number)
    integer = value.valueOf();
  else
    integer = new Number(value).valueOf();

  return isNaN(integer) || (integer % 1 !== 0) ? undefined : integer;
};

/**
 * Checks if value is an Integer data and is not null.
 *
 * @function bo.dataTypes.Integer#hasValue
 * @param {data} value - The value to check.
 * @returns {boolean} True if the value is Integer and not null, otherwise false.
 */
Integer.prototype.hasValue = function (value) {

  var parsed = this.parse(value);
  return parsed !== undefined && parsed !== null;
};

module.exports = Integer;
