'use strict';

var ArgumentError = require('./argument-error.js');
var t = require('../locales/i18n-bo.js')('ArgumentError');

//region Helper methods

function failed (argArray, skip, message, other) {
  var args = [null, message].concat(Array.prototype.slice.call(argArray, skip));
  if (other) args.push(other);
  var constructor = ArgumentError.bind.apply(ArgumentError, args);
  throw new constructor();
}

function typeNames (types) {
  var list = '<< no types >>';
  if (types.length) {
    list = types.map(function (type) {
      return type.name ? type.name : '-unknown-'
    }).join(' | ');
  }
  return list;
}

//endregion

/**
 * Provides helper methods to check arguments.
 *
 * @namespace bo.shared.ensureArgument
 *
 * @property {function} isDefined - {@link bo.shared.ensureArgument#isDefined isDefined}
 *      function checks if value is not undefined.
 * @property {function} hasValue - {@link bo.shared.ensureArgument#hasValue hasValue}
 *      function checks if value is not undefined and is not null.
 *
 * @property {function} isString - {@link bo.shared.ensureArgument#isString isString}
 *      function checks if value is a string.
 * @property {function} isOptionalString - {@link bo.shared.ensureArgument#isOptionalString isOptionalString}
 *      function checks if value is a string or null.
 * @property {function} isMandatoryString - {@link bo.shared.ensureArgument#isMandatoryString isMandatoryString}
 *      function checks if value is a non-empty string.
 *
 * @property {function} isOptionalNumber - {@link bo.shared.ensureArgument#isOptionalNumber isOptionalNumber}
 *      function checks if value is a number or null.
 * @property {function} isMandatoryNumber - {@link bo.shared.ensureArgument#isMandatoryNumber isMandatoryNumber}
 *      function checks if value is a number.
 *
 * @property {function} isOptionalInteger - {@link bo.shared.ensureArgument#isOptionalInteger isOptionalInteger}
 *      function checks if value is an integer or null.
 * @property {function} isMandatoryInteger - {@link bo.shared.ensureArgument#isMandatoryInteger isMandatoryInteger}
 *      function checks if value is an integer.
 *
 * @property {function} isOptionalBoolean - {@link bo.shared.ensureArgument#isOptionalBoolean isOptionalBoolean}
 *      function checks if value is a Boolean or null.
 * @property {function} isMandatoryBoolean - {@link bo.shared.ensureArgument#isMandatoryBoolean isMandatoryBoolean}
 *      function checks if value is a Boolean.
 *
 * @property {function} isOptionalObject - {@link bo.shared.ensureArgument#isOptionalObject isOptionalObject}
 *      function checks if value is an object or null.
 * @property {function} isMandatoryObject - {@link bo.shared.ensureArgument#isMandatoryObject isMandatoryObject}
 *      function checks if value is an object.
 *
 * @property {function} isOptionalFunction - {@link bo.shared.ensureArgument#isOptionalFunction isOptionalFunction}
 *      function checks if value is a function or null.
 * @property {function} isMandatoryFunction - {@link bo.shared.ensureArgument#isMandatoryFunction isMandatoryFunction}
 *      function checks if value is a function.
 *
 * @property {function} isOptionalType - {@link bo.shared.ensureArgument#isOptionalType isOptionalType}
 *      function checks if value is a given type or null.
 * @property {function} isMandatoryType - {@link bo.shared.ensureArgument#isMandatoryType isMandatoryType}
 *      function checks if value is a given type.
 *
 * @property {function} isEnumMember - {@link bo.shared.ensureArgument#isEnumMember isEnumMember}
 *      function checks if value is member of a given enumeration.
 *
 * @property {function} isOptionalArray - {@link bo.shared.ensureArgument#isOptionalArray isOptionalArray}
 *      function checks if value is an array of a given type or null.
 * @property {function} isMandatoryArray - {@link bo.shared.ensureArgument#isMandatoryArray isMandatoryArray}
 *      function checks if value is an array of a given type.
 */
var ensureArgument = {

  //region Generic

  /**
   * Checks if value is not undefined.
   *
   * @function bo.shared.ensureArgument#isDefined
   * @param {*} value - The value to check.
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {*} The checked value.
   *
   * @throws {@link bo.shared.ArgumentError ArgumentError}: TThe argument must be supplied.
   */
  isDefined: function (value, message) {
    if (value === undefined)
      failed(arguments, 2, message || 'defined');
    return value;
  },

  /**
   * Checks if value is not undefined and is not null.
   *
   * @function bo.shared.ensureArgument#hasValue
   * @param {*} value - The value to check.
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {*} The checked value.
   *
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The argument is required.
   */
  hasValue: function (value, message) {
    if (value === null || value === undefined)
      failed(arguments, 2, message || 'required');
    return value;
  },

  //endregion

  //region String

  /**
   * Checks if value is a string.
   *
   * @function bo.shared.ensureArgument#isString
   * @param {string} [value] - The value to check.
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {string} The checked value.
   *
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The argument must be a string value.
   */
  isString: function (value, message) {
    if (typeof value !== 'string' && !(value instanceof String))
      failed(arguments, 2, message || 'string');
    return value;
  },

  /**
   * Checks if value is a string or null.
   *
   * @function bo.shared.ensureArgument#isOptionalString
   * @param {(string|null)} [value=null] - The value to check.
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {(string|null)} The checked value.
   *
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The argument must be a string value or null.
   */
  isOptionalString: function (value, message) {
    if (value === undefined)
      value = null;
    if (value !== null && typeof value !== 'string' && !(value instanceof String))
      failed(arguments, 2, message || 'optString');
    return value;
  },

  /**
   * Checks if value is a non-empty string.
   *
   * @function bo.shared.ensureArgument#isMandatoryString
   * @param {string} [value] - The value to check.
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {string} The checked value.
   *
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The argument must be a non-empty string.
   */
  isMandatoryString: function (value, message) {
    if (typeof value !== 'string' && !(value instanceof String) || value.trim().length === 0)
      failed(arguments, 2, message || 'manString');
    return value;
  },

  //endregion

  //region Number

  /**
   * Checks if value is a number or null.
   *
   * @function bo.shared.ensureArgument#isOptionalNumber
   * @param {(number|null)} [value=null] - The value to check.
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {(number|null)} The checked value.
   *
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The argument must be a number value or null.
   */
  isOptionalNumber: function (value, message) {
    if (value === undefined)
      value = null;
    if (value !== null && typeof value !== 'number' && !(value instanceof Number))
      failed(arguments, 2, message || 'optNumber');
    return value;
  },

  /**
   * Checks if value is a number.
   *
   * @function bo.shared.ensureArgument#isMandatoryNumber
   * @param {number} [value] - The value to check.
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {number} The checked value.
   *
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The argument must be a number value.
   */
  isMandatoryNumber: function (value, message) {
    if (typeof value !== 'number' && !(value instanceof Number))
      failed(arguments, 2, message || 'manNumber');
    return value;
  },

  //endregion

  //region Integer

  /**
   * Checks if value is an integer or null.
   *
   * @function bo.shared.ensureArgument#isOptionalInteger
   * @param {(number|null)} [value=null] - The value to check.
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {(number|null)} The checked value.
   *
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The argument must be an integer value or null.
   */
  isOptionalInteger: function (value, message) {
    if (value === undefined)
      value = null;
    if (value !== null && (typeof value !== 'number' && !(value instanceof Number) || value % 1 !== 0))
      failed(arguments, 2, message || 'optInteger');
    return value;
  },

  /**
   * Checks if value is an integer.
   *
   * @function bo.shared.ensureArgument#isMandatoryInteger
   * @param {number} [value] - The value to check.
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {number} The checked value.
   *
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The argument must be an integer value.
   */
  isMandatoryInteger: function (value, message) {
    if (typeof value !== 'number' && !(value instanceof Number) || value % 1 !== 0)
      failed(arguments, 2, message || 'manInteger');
    return value;
  },

  //endregion

  //region Boolean

  /**
   * Checks if value is a Boolean or null.
   *
   * @function bo.shared.ensureArgument#isOptionalBoolean
   * @param {(boolean|null)} [value=null] - The value to check.
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {(boolean|null)} The checked value.
   *
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The argument must be a Boolean value or null.
   */
  isOptionalBoolean: function (value, message) {
    if (value === undefined)
      value = null;
    if (value !== null && typeof value !== 'boolean' && !(value instanceof Boolean))
      failed(arguments, 2, message || 'optBoolean');
    return value;
  },

  /**
   * Checks if value is a Boolean.
   *
   * @function bo.shared.ensureArgument#isMandatoryBoolean
   * @param {boolean} [value] - The value to check.
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {boolean} The checked value.
   *
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The argument must be a Boolean value.
   */
  isMandatoryBoolean: function (value, message) {
    if (typeof value !== 'boolean' && !(value instanceof Boolean))
      failed(arguments, 2, message || 'manBoolean');
    return value;
  },

  //endregion

  //region Object

  /**
   * Checks if value is an object or null.
   *
   * @function bo.shared.ensureArgument#isOptionalObject
   * @param {(object|null)} [value=null] - The value to check.
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {(object|null)} The checked value.
   *
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The argument must be an object or null.
   */
  isOptionalObject: function (value, message) {
    if (value === undefined)
      value = null;
    if (typeof value !== 'object')
      failed(arguments, 2, message || 'optObject');
    return value;
  },

  /**
   * Checks if value is an object.
   *
   * @function bo.shared.ensureArgument#isMandatoryObject
   * @param {object} [value] - The value to check.
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {object} The checked value.
   *
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The argument must be an object.
   */
  isMandatoryObject: function (value, message) {
    if (typeof value !== 'object' || value === null)
      failed(arguments, 2, message || 'manObject');
    return value;
  },

  //endregion

  //region Function

  /**
   * Checks if value is a function or null.
   *
   * @function bo.shared.ensureArgument#isOptionalFunction
   * @param {(function|null)} [value=null] - The value to check.
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {(function|null)} The checked value.
   *
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The argument must be a function or null.
   */
  isOptionalFunction: function (value, message) {
    if (value === undefined)
      value = null;
    if (value !== null && typeof value !== 'function')
      failed(arguments, 2, message || 'optFunction');
    return value;
  },

  /**
   * Checks if value is a function.
   *
   * @function bo.shared.ensureArgument#isMandatoryFunction
   * @param {function} [value] - The value to check.
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {function} The checked value.
   *
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The argument must be a function.
   */
  isMandatoryFunction: function (value, message) {
    if (typeof value !== 'function')
      failed(arguments, 2, message || 'manFunction');
    return value;
  },

  //endregion

  //region Type

  /**
   * Checks if value is a given type or null.
   *
   * @function bo.shared.ensureArgument#isOptionalType
   * @param {(object|null)} [value=null] - The value to check.
   * @param {constructor} type - The type that value must inherit.
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {(object|null)} The checked value.
   *
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The argument must be a TYPE object or null.
   */
  isOptionalType: function (value, type, message) {
    if (value === undefined)
      value = null;
    var types = type instanceof Array ? type : [ type ];
    if (value !== null && !(types.some(function (option) {
        return value instanceof option || value.super_ === option;
      })))
      failed(arguments, 3, message || 'optType', typeNames(types));
    return value;
  },

  /**
   * Checks if value is a given type.
   *
   * @function bo.shared.ensureArgument#isMandatoryType
   * @param {object} [value] - The value to check.
   * @param {constructor} type - The type that value must inherit.
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {object} The checked value.
   *
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The argument must be a TYPE object.
   */
  isMandatoryType: function (value, type, message) {
    var types = type instanceof Array ? type : [ type ];
    if (!(types.some(function (option) {
        return value instanceof option || value.super_ === option;
      })))
      failed(arguments, 3, message || 'manType', typeNames(types));
    return value;
  },

  //endregion

  //region EnumMember

  /**
   * Checks if value is member of a given enumeration.
   *
   * @function bo.shared.ensureArgument#isEnumMember
   * @param {number} [value] - The value to check.
   * @param {constructor} type - The type of the enumeration.
   * @param {number} [defaultValue] - The type of the enumeration.
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {number} The checked value.
   *
   * @throws {@link bo.shared.ArgumentError ArgumentError}: TYPE is not an enumeration type.
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The argument must be a TYPE item.
   */
  isEnumMember: function (value, type, defaultValue, message) {
    if (!(type && type.hasMember && type.constructor &&
        type.constructor.super_ && type.constructor.super_.name === 'Enumeration'))
      failed(arguments, 4, 'enumType', type);
    if (defaultValue && (value === null || value === undefined))
      value = defaultValue;
    if (!type.hasMember(value))
      failed(arguments, 4, message || 'enumMember', type);
    return value;
  },

  //endregion

  //region Array

  /**
   * Checks if value is an array of a given type or null.
   *
   * @function bo.shared.ensureArgument#isOptionalArray
   * @param {(Array.<type>|null)} [value=Array.<type>] - The value to check.
   * @param {*} type - The type of the array items - a primitive type or a constructor.
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {(Array.<type>|null)} The checked value.
   *
   * @throws {@link bo.shared.ArgumentError ArgumentError}:
   *      The argument must be an array of TYPE values, or a single TYPE values or null.
   * @throws {@link bo.shared.ArgumentError ArgumentError}:
   *      The argument must be an array of TYPE objects, or a single TYPE object or null.
   */
  isOptionalArray: function (value, type, message) {
    if (value === undefined || value === null)
      return [];
    var msgKey = 'optArray';
    if (type === String || type === Number || type === Boolean) {
      msgKey = 'optArrayPrim';
      var typeName = type.name.toLowerCase();
      if (typeof value === typeName || value instanceof type)
        return [value];
      if (value instanceof Array && (!value.length || value.every(function (item) {
          return typeof item === typeName || item instanceof type;
        })))
        return value;
    } else {
      if (value instanceof type)
        return [value];
      if (value instanceof Array && (!value.length || value.every(function (item) {
          return item instanceof type;
        })))
        return value;
    }
    failed(arguments, 3, message || msgKey, type);
  },

  /**
   * Checks if value is an array of a given type.
   *
   * @function bo.shared.ensureArgument#isMandatoryArray
   * @param {Array.<type>} [value] - The value to check.
   * @param {*} type - The type of the array items - a primitive type or a constructor.
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [messageParams] - Optional interpolation parameters of the message.
   * @returns {Array.<type>} The checked value.
   *
   * @throws {@link bo.shared.ArgumentError ArgumentError}:
   *      The argument must be an array of TYPE values, or a single TYPE values or null.
   * @throws {@link bo.shared.ArgumentError ArgumentError}:
   *      The argument must be an array of TYPE objects, or a single TYPE object or null.
   */
  isMandatoryArray: function (value, type, message) {
    var msgKey = 'manArray';
    if (type === String || type === Number || type === Boolean) {
      msgKey = 'manArrayPrim';
      var typeName = type.name.toLowerCase();
      if (typeof value === typeName || value instanceof type)
        return [value];
      if (value instanceof Array && value.length && value.every(function (item) {
          return typeof item === typeName || item instanceof type;
        }))
        return value;
    } else {
      if (value instanceof type)
        return [value];
      if (value instanceof Array && value.length && value.every(function (item) {
          return item instanceof type;
        }))
        return value;
    }
    failed(arguments, 3, message || msgKey, type);
  }

  //endregion
};

Object.freeze(ensureArgument);

module.exports = ensureArgument;
