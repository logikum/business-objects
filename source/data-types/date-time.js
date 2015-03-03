'use strict';

var util = require('util');
var DataType = require('./data-type.js');

/**
 * @classdesc Provide methods to work with DateTime data.
 * @description Creates DateTime data type definition.
 *
 * @memberof bo.dataTypes
 * @constructor
 *
 * @extends bo.dataTypes.DataType
 */
function DateTime () {
  // Immutable object.
  DataType.call(this);
}
util.inherits(DateTime, DataType);

/**
 * Checks if value is a DateTime data.
 *
 * @function bo.dataTypes.DateTime#parse
 * @param {*} [value] - The value to check.
 * @returns {*} The DateTime value or null when the input value is valid, otherwise undefined.
 */
DateTime.prototype.parse = function (value) {

  if (value === null)
    return value;
  if (value === undefined)
    return null;

  var datetime = value instanceof Date ? value : new Date(value);
  return isNaN(datetime.valueOf()) ? undefined : datetime;
};

/**
 * Checks if value is a DateTime data and is not null.
 *
 * @function bo.dataTypes.DateTime#hasValue
 * @param {data} value - The value to check.
 * @returns {boolean} True if the value is DateTime and not null, otherwise false.
 */
DateTime.prototype.hasValue = function (value) {

  var parsed = this.parse(value);
  return parsed !== undefined && parsed !== null;
};

module.exports = DateTime;
