'use strict';

var util = require('util');
var DataType = require('./data-type.js');

/**
 * @classdesc Provide methods to work with Boolean data.
 * @description Creates Boolean data type definition.
 *
 * @memberof bo.dataTypes
 * @constructor
 *
 * @extends bo.dataTypes.DataType
 */
function Boolean () {
  // Immutable object.
  DataType.call(this);
}
util.inherits(Boolean, DataType);

/**
 * Checks if value is a Boolean data.
 *
 * @function bo.dataTypes.Boolean#parse
 * @param {*} [value] - The value to check.
 * @returns {*} The Boolean value or null when the input value is valid, otherwise undefined.
 */
Boolean.prototype.parse = function (value) {

  if (value === null || typeof value === 'boolean')
    return value;
  if (value === undefined)
    return null;
  if (value instanceof Boolean)
    return value.valueOf();
  if (value.toString().trim().toLowerCase() === 'false')
    return false;

  return global.Boolean(value).valueOf();
};

/**
 * Checks if value is a Boolean data and is not null.
 *
 * @function bo.dataTypes.Boolean#hasValue
 * @param {data} value - The value to check.
 * @returns {boolean} True if the value is Boolean and not null, otherwise false.
 */
Boolean.prototype.hasValue = function (value) {

  var parsed = this.parse(value);
  return parsed !== undefined && parsed !== null;
};

module.exports = Boolean;
