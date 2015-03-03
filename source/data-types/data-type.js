'use strict';

var CLASS_NAME = 'DataType';

var NotImplementedError = require('../system/not-implemented-error.js');

/**
 * @classdesc
 *      Serves as the base class for data type definitions.
 * @description
 *      Creates a new data type definition.
 *      The data type instances should be frozen.
 *
 * @memberof bo.dataTypes
 * @constructor
 */
function DataType (name) {

  /**
   * The name of the data type. The default value is the name of the constructor.
   * @type {string}
   * @readonly
   */
  this.name = name || this.constructor.name;

  // Immutable object.
  Object.freeze(this);
}

/**
 * Abstract method to check if the value conforms to the data type definition.
 * Returns the value when it has the required data type. If not, but it can be
 * converted into the required data type, then returns the converted value.
 * Otherwise returns *undefined* to mark the value as invalid.
 *
 * @abstract
 * @function bo.dataTypes.DataType#isValid
 * @param {*} [value] - The value to check.
 * @returns {*} The value in the defined data type or null when the value is valid, otherwise undefined.
 *
 * @throws {@link bo.system.NotImplementedError Not implemented error}: The DataType.check method is not implemented.
 */
DataType.prototype.parse = function (value) {
  throw new NotImplementedError('method', CLASS_NAME, 'parse');
};

/**
 * Abstract method to check if the data type of the value conforms to the data type definition
 * and it is not null.
 *
 * @abstract
 * @function bo.dataTypes.DataType#hasValue
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is the defined data type and not null, otherwise false.
 *
 * @throws {@link bo.system.NotImplementedError Not implemented error}: The DataType.hasValue method is not implemented.
 */
DataType.prototype.hasValue = function (value) {
  throw new NotImplementedError('method', CLASS_NAME, 'hasValue');
};

module.exports = DataType;
