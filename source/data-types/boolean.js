'use strict';

var util = require('util');
var DataType = require('./data-type.js');
var DataTypeError = require('./data-type-error.js');

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
  Boolean.super_.call(this, 'Boolean');

  // Immutable object.
  Object.freeze(this);
}
util.inherits(Boolean, DataType);

/**
 * Checks if value is a Boolean data.
 *
 * @function bo.dataTypes.Boolean#check
 * @param {?data} value - The value to check.
 *
 * @throws {@link bo.dataTypes.DataTypeError DataTypeError}: The passed value is not Boolean.
 */
Boolean.prototype.check = function (value) {

  if (value !== null && typeof value !== 'boolean' && !(value instanceof Boolean))
    throw new DataTypeError('boolean');
};

/**
 * Checks if value is a Boolean data and is not null.
 *
 * @function bo.dataTypes.Boolean#hasValue
 * @param {!data} value - The value to check.
 * @returns {boolean} True if the value is Boolean and not null, otherwise false.
 *
 * @throws {@link bo.dataTypes.DataTypeError DataTypeError}: The passed value is not Boolean.
 */
Boolean.prototype.hasValue = function (value) {

  this.check(value);
  return value != undefined && value != null;
};

module.exports = Boolean;
