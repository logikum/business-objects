'use strict';

var util = require('util');
var DataType = require('./data-type.js');

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
  // Immutable object.
  DataType.call(this);
}
util.inherits(Decimal, DataType);

/**
 * Checks if value is a Decimal data.
 *
 * @function bo.dataTypes.Decimal#parse
 * @param {*} [value] - The value to check.
 * @returns {*} The Decimal value or null when the input value is valid, otherwise undefined.
 */
Decimal.prototype.parse = function (value) {

  if (value === null || typeof value === 'number')
    return value;
  if (value === undefined)
    return null;

  var number = value instanceof Number ? value.valueOf() : new Number(value).valueOf();
  return isNaN(number) ? undefined : number;
};

/**
 * Checks if value is a Decimal data and is not null.
 *
 * @function bo.dataTypes.Decimal#hasValue
 * @param {data} value - The value to check.
 * @returns {boolean} True if the value is Decimal and not null, otherwise false.
 */
Decimal.prototype.hasValue = function (value) {

  var parsed = this.parse(value);
  return parsed !== undefined && parsed !== null;
};

module.exports = Decimal;
