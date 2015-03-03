'use strict';

var CLASS_NAME = 'Enum';

var util = require('util');
var DataType = require('./data-type.js');
var Enumeration = require('../system/enumeration.js');
var EnsureArgument = require('../system/ensure-argument.js');

/**
 * @classdesc Provide methods to work with enumeration data.
 * @description Creates enumeration data type definition.
 *
 * @memberof bo.dataTypes
 * @param {bo.system.Enumeration} enumType - The type of the enumeration.
 * @constructor
 *
 * @extends bo.dataTypes.DataType
 */
function Enum (enumType) {
  /**
   * Gets the type of the enumeration.
   *
   * @type {bo.system.Enumeration}
   * @readonly
   */
  this.type = EnsureArgument.isMandatoryType(enumType, Enumeration,
      'c_manType', CLASS_NAME, 'enumType');

  // Immutable object with overwritten name.
  DataType.call(this, enumType.$name);

  /**
   * The name of the {@link bo.system.Enumeration enumeration} type.
   *
   * @name bo.dataTypes.Enum#name
   * @type {string}
   * @readonly
   */
}
util.inherits(Enum, DataType);

/**
 * Checks if value is a Enum data.
 * Its value must be one of the defined enumeration values or null.
 *
 * @function bo.dataTypes.Enum#parse
 * @param {*} value - The value to check.
 * @returns {*} The Enum value or null when the input value is valid, otherwise undefined.
 */
Enum.prototype.parse = function (value) {

  if (value === null)
    return value;
  if (value === undefined)
    return null;

  return this.type.hasMember(value) ? value : undefined;
};

/**
 * Checks if value is the defined enumeration and is not null.
 *
 * @function bo.dataTypes.Enum#hasValue
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is the defined enumeration and not null, otherwise false.
 */
Enum.prototype.hasValue = function (value) {

  var parsed = this.parse(value);
  return parsed !== undefined && parsed !== null;
};

module.exports = Enum;
