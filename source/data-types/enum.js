'use strict';

var CLASS_NAME = 'Enum';

var util = require('util');
var DataType = require('./data-type.js');
var DataTypeError = require('./data-type-error.js');
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
 * Checks if value is the defined enumeration or null.
 *
 * @function bo.dataTypes.Enum#check
 * @param {*} value - The value to check.
 *
 * @throws {@link bo.dataTypes.DataTypeError Data type error}: The passed value is not enumeration type.
 */
Enum.prototype.check = function (value) {

  if (value !== null && !this.type.hasMember(value))
    throw new DataTypeError('enum', this.type.$name);
};

/**
 * Checks if value is the defined enumeration and is not null.
 *
 * @function bo.dataTypes.Enum#hasValue
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is the defined enumeration and not null, otherwise false.
 *
 * @throws {@link bo.dataTypes.DataTypeError Data type error}: The passed value is not enumeration type.
 */
Enum.prototype.hasValue = function (value) {

  this.check(value);
  return value != undefined && value != null;
};

module.exports = Enum;
