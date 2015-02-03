'use strict';

var EnsureArgument = require('./ensure-argument.js');
var EnumerationError = require('./../system/enumeration-error.js');

/**
 * @classdesc
 *      Serves as the base class for enumerations.
 * @description
 *      Creates a new enumeration.
 *      The enumeration instances should be frozen.
 *
 * @memberof bo.shared
 * @constructor
 */
function Enumeration () {
  /**
   * The name of the enumeration. The default value is the name of the constructor.
   * @type {string}
   * @readonly
   */
  this.$name = this.constructor.name;
}

/**
 * Returns the count of the items in enumeration.
 *
 * @function bo.shared.Enumeration#count
 * @returns {number} The count of the enumeration items.
 */
Enumeration.prototype.count = function () {
  var count = 0;
  for (var propertyName in this) {
    if (this.hasOwnProperty(propertyName) && typeof this[propertyName] === 'number') {
      count++;
    }
  }
  return count;
};

/**
 * Returns the name of an enumeration item.
 *
 * @function bo.shared.Enumeration#getName
 * @param {number} value - The enumeration item that name to be returned of.
 * @returns {string} The name of the enumeration item.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The value must be a number.
 * @throws {@link bo.system.EnumerationError Enumeration error}: The passed value is not an enumeration item.
 */
Enumeration.prototype.getName = function (value) {
  value = EnsureArgument.isMandatoryNumber(value,
      'm_manNumber', 'Enumeration', 'getName', 'value');

  for (var propertyName in this) {
    if (this.hasOwnProperty(propertyName) && typeof this[propertyName] === 'number') {
      if (this[propertyName] === value)
        return propertyName;
    }
  }
  throw new EnumerationError('enumValue', this.$name, value);
};

/**
 * Returns the value of an enumeration item.
 *
 * @function bo.shared.Enumeration#getValue
 * @param {string} name - The enumeration item that value to be returned of.
 * @returns {number} The value of the enumeration item.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The name must be a non-empty string.
 * @throws {@link bo.system.EnumerationError Enumeration error}: The passed name is not an enumeration item.
 */
Enumeration.prototype.getValue = function (name) {
  name = EnsureArgument.isMandatoryString(name,
      'm_manString', 'Enumeration', 'getValue', 'name');

  for (var propertyName in this) {
    if (this.hasOwnProperty(propertyName) && typeof this[propertyName] === 'number') {
      if (propertyName === name)
        return this[propertyName];
    }
  }
  throw new EnumerationError('enumName', this.$name, name);
};

/**
 * Checks whether the enumeration has an item with the given value.
 * If not, throws an error.
 *
 * @function bo.shared.Enumeration#check
 * @param {number} value - The value to check.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 *
 * @throws {@link bo.system.EnumerationError Enumeration error}: The passed value is not an enumeration item.
 */
Enumeration.prototype.check = function (value, message) {
  for (var propertyName in this) {
    if (this.hasOwnProperty(propertyName) && typeof this[propertyName] === 'number') {
      if (this[propertyName] === value)
        return;
    }
  }
  throw new EnumerationError(message || 'enumValue', this.$name, value);
};

/**
 * Determines if the enumeration has an item with the given value.
 *
 * @function bo.shared.Enumeration#hasMember
 * @param {number} value - The value to check.
 * @returns {boolean} True if the value is an enumeration item, otherwise false.
 */
Enumeration.prototype.hasMember = function (value) {
  for (var propertyName in this) {
    if (this.hasOwnProperty(propertyName) && typeof this[propertyName] === 'number') {
      if (this[propertyName] === value)
        return true;
    }
  }
  return false;
};

module.exports = Enumeration;
