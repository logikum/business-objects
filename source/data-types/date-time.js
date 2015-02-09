'use strict';

var util = require('util');
var DataType = require('./data-type.js');
var DataTypeError = require('./data-type-error.js');

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
  DataType.call(this);

  // Immutable object.
  Object.freeze(this);
}
util.inherits(DateTime, DataType);

/**
 * Checks if value is a DateTime data.
 *
 * @function bo.dataTypes.DateTime#check
 * @param {?data} value - The value to check.
 *
 * @throws {@link bo.dataTypes.DataTypeError Data type error}: The passed value is not DateTime.
 */
DateTime.prototype.check = function (value) {

  if (value !== null && !(value instanceof Date))
    throw new DataTypeError('date');
};

/**
 * Checks if value is a DateTime data and is not null.
 *
 * @function bo.dataTypes.DateTime#hasValue
 * @param {!data} value - The value to check.
 * @returns {boolean} True if the value is DateTime and not null, otherwise false.
 *
 * @throws {@link bo.dataTypes.DataTypeError Data type error}: The passed value is not DateTime.
 */
DateTime.prototype.hasValue = function (value) {

  this.check(value);
  return value != undefined && value != null;
};

module.exports = DateTime;
