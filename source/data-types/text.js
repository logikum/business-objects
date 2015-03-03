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
function Text () {
  // Immutable object.
  DataType.call(this);
}
util.inherits(Text, DataType);

/**
 * Checks if value is a Text data.
 *
 * @function bo.dataTypes.Text#parse
 * @param {*} [value] - The value to check.
 * @returns {*} The Text value or null when the input value is valid, otherwise undefined.
 */
Text.prototype.parse = function (value) {

  if (value === null || typeof value === 'string')
    return value;
  if (value === undefined)
    return null;
  if (value instanceof String)
    return value.valueOf();

  return new String(value).valueOf();
};

/**
 * Checks if value is a Text data and is not null.
 *
 * @function bo.dataTypes.Text#hasValue
 * @param {data} value - The value to check.
 * @returns {boolean} True if the value is Text and not null, otherwise false.
 */
Text.prototype.hasValue = function (value) {

  var parsed = this.parse(value);
  return parsed !== undefined && parsed !== null && parsed.length > 0;
};

module.exports = Text;
