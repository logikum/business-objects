'use strict';

var ensureArgument = require('../shared/ensure-argument.js');
var NotImplementedError = require('../shared/not-implemented-error.js');

/**
 * Creates a new data type definition.
 *
 * @memberof bo.dataTypes
 * @constructor
 * @param {!string} name - The name of the data type.
 *
 * @classdesc Serves as the base class for data type definitions.
 */
function DataType (name) {

  /**
   * The name of the data type.
   * @type {string}
   * @readonly
   */
  this.name = ensureArgument.isMandatoryString(name, 'c_manString', 'DataType', 'name');

  // Immutable object.
  Object.freeze(this);
}

/**
 * Abstract method to check if the data type of the value conforms to the data type definition.
 * @function bo.dataTypes.DataType#check
 * @param {?*} value - The value to check.
 */
DataType.prototype.check = function (value) {
  throw new NotImplementedError('method', 'DataType', 'check');
};

/**
 * Abstract method to check if the data type of the value conforms to the data type definition
 * and it is not null.
 * @function bo.dataTypes.DataType#hasValue
 * @param {!*} value - The value to check.
 * @returns {boolean} True if the value is the defined data type and not null, otherwise false.
 */
DataType.prototype.hasValue = function (value) {
  throw new NotImplementedError('method', 'DataType', 'hasValue');
};

module.exports = DataType;
