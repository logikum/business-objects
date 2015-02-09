'use strict';

var ArgumentError = require('./argument-error.js');

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
 * @classdesc Provides helper methods to check arguments.
 * @description Creates a new argument checking object.
 *
 * @memberof bo.system
 * @constructor
 */
var EnsureArgument = function () {};

//region Generic

/**
 * Checks if value is not undefined.
 *
 * @function bo.system.EnsureArgument.isDefined
 * @param {*} value - The value to check.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {*} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: TThe argument must be supplied.
 */
EnsureArgument.isDefined = function (value, message) {
  if (value === undefined)
    failed(arguments, 2, message || 'defined');
  return value;
};

/**
 * Checks if value is not undefined and is not null.
 *
 * @function bo.system.EnsureArgument.hasValue
 * @param {*} value - The value to check.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {*} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument is required.
 */
EnsureArgument.hasValue = function (value, message) {
  if (value === null || value === undefined)
    failed(arguments, 2, message || 'required');
  return value;
};

//endregion

//region String

/**
 * Checks if value is a string.
 *
 * @function bo.system.EnsureArgument.isString
 * @param {string} [value] - The value to check.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {string} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a string value.
 */
EnsureArgument.isString = function (value, message) {
  if (typeof value !== 'string' && !(value instanceof String))
    failed(arguments, 2, message || 'string');
  return value;
};

/**
 * Checks if value is a string or null.
 *
 * @function bo.system.EnsureArgument.isOptionalString
 * @param {(string|null)} [value=null] - The value to check.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {(string|null)} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a string value or null.
 */
EnsureArgument.isOptionalString = function (value, message) {
  if (value === undefined)
    value = null;
  if (value !== null && typeof value !== 'string' && !(value instanceof String))
    failed(arguments, 2, message || 'optString');
  return value;
};

/**
 * Checks if value is a non-empty string.
 *
 * @function bo.system.EnsureArgument.isMandatoryString
 * @param {string} [value] - The value to check.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {string} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a non-empty string.
 */
EnsureArgument.isMandatoryString = function (value, message) {
  if (typeof value !== 'string' && !(value instanceof String) || value.trim().length === 0)
    failed(arguments, 2, message || 'manString');
  return value;
};

//endregion

//region Number

/**
 * Checks if value is a number or null.
 *
 * @function bo.system.EnsureArgument.isOptionalNumber
 * @param {(number|null)} [value=null] - The value to check.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {(number|null)} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a number value or null.
 */
EnsureArgument.isOptionalNumber = function (value, message) {
  if (value === undefined)
    value = null;
  if (value !== null && typeof value !== 'number' && !(value instanceof Number))
    failed(arguments, 2, message || 'optNumber');
  return value;
};

/**
 * Checks if value is a number.
 *
 * @function bo.system.EnsureArgument.isMandatoryNumber
 * @param {number} [value] - The value to check.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {number} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a number value.
 */
EnsureArgument.isMandatoryNumber = function (value, message) {
  if (typeof value !== 'number' && !(value instanceof Number))
    failed(arguments, 2, message || 'manNumber');
  return value;
};

//endregion

//region Integer

/**
 * Checks if value is an integer or null.
 *
 * @function bo.system.EnsureArgument.isOptionalInteger
 * @param {(number|null)} [value=null] - The value to check.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {(number|null)} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be an integer value or null.
 */
EnsureArgument.isOptionalInteger = function (value, message) {
  if (value === undefined)
    value = null;
  if (value !== null && (typeof value !== 'number' && !(value instanceof Number) || value % 1 !== 0))
    failed(arguments, 2, message || 'optInteger');
  return value;
};

/**
 * Checks if value is an integer.
 *
 * @function bo.system.EnsureArgument.isMandatoryInteger
 * @param {number} [value] - The value to check.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {number} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be an integer value.
 */
EnsureArgument.isMandatoryInteger = function (value, message) {
  if (typeof value !== 'number' && !(value instanceof Number) || value % 1 !== 0)
    failed(arguments, 2, message || 'manInteger');
  return value;
};

//endregion

//region Boolean

/**
 * Checks if value is a Boolean or null.
 *
 * @function bo.system.EnsureArgument.isOptionalBoolean
 * @param {(boolean|null)} [value=null] - The value to check.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {(boolean|null)} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a Boolean value or null.
 */
EnsureArgument.isOptionalBoolean = function (value, message) {
  if (value === undefined)
    value = null;
  if (value !== null && typeof value !== 'boolean' && !(value instanceof Boolean))
    failed(arguments, 2, message || 'optBoolean');
  return value;
};

/**
 * Checks if value is a Boolean.
 *
 * @function bo.system.EnsureArgument.isMandatoryBoolean
 * @param {boolean} [value] - The value to check.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {boolean} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a Boolean value.
 */
EnsureArgument.isMandatoryBoolean = function (value, message) {
  if (typeof value !== 'boolean' && !(value instanceof Boolean))
    failed(arguments, 2, message || 'manBoolean');
  return value;
};

//endregion

//region Object

/**
 * Checks if value is an object or null.
 *
 * @function bo.system.EnsureArgument.isOptionalObject
 * @param {(object|null)} [value=null] - The value to check.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {(object|null)} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be an object or null.
 */
EnsureArgument.isOptionalObject = function (value, message) {
  if (value === undefined)
    value = null;
  if (typeof value !== 'object')
    failed(arguments, 2, message || 'optObject');
  return value;
};

/**
 * Checks if value is an object.
 *
 * @function bo.system.EnsureArgument.isMandatoryObject
 * @param {object} [value] - The value to check.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {object} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be an object.
 */
EnsureArgument.isMandatoryObject = function (value, message) {
  if (typeof value !== 'object' || value === null)
    failed(arguments, 2, message || 'manObject');
  return value;
};

//endregion

//region Function

/**
 * Checks if value is a function or null.
 *
 * @function bo.system.EnsureArgument.isOptionalFunction
 * @param {(function|null)} [value=null] - The value to check.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {(function|null)} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a function or null.
 */
EnsureArgument.isOptionalFunction = function (value, message) {
  if (value === undefined)
    value = null;
  if (value !== null && typeof value !== 'function')
    failed(arguments, 2, message || 'optFunction');
  return value;
};

/**
 * Checks if value is a function.
 *
 * @function bo.system.EnsureArgument.isMandatoryFunction
 * @param {function} [value] - The value to check.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {function} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a function.
 */
EnsureArgument.isMandatoryFunction = function (value, message) {
  if (typeof value !== 'function')
    failed(arguments, 2, message || 'manFunction');
  return value;
};

//endregion

//region Type

/**
 * Checks if value is a given type or null.
 *
 * @function bo.system.EnsureArgument.isOptionalType
 * @param {(object|null)} [value=null] - The value to check.
 * @param {(constructor|Array.<constructor>)} type - The type that value must inherit.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {(object|null)} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a TYPE object or null.
 */
EnsureArgument.isOptionalType = function (value, type, message) {
  if (value === undefined)
    value = null;
  var types = type instanceof Array ? type : [ type ];
  if (value !== null && !(types.some(function (option) {
      return value && (value instanceof option || value.super_ === option);
    })))
    failed(arguments, 3, message || 'optType', typeNames(types));
  return value;
};

/**
 * Checks if value is a given type.
 *
 * @function bo.system.EnsureArgument.isMandatoryType
 * @param {object} [value] - The value to check.
 * @param {(constructor|Array.<constructor>)} type - The type that value must inherit.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {object} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a TYPE object.
 */
EnsureArgument.isMandatoryType = function (value, type, message) {
  var types = type instanceof Array ? type : [ type ];
  if (!(types.some(function (option) {
      return value && (value instanceof option || value.super_ === option);
    })))
    failed(arguments, 3, message || 'manType', typeNames(types));
  return value;
};

//endregion

//region Model

/**
 * Checks if value is an instance of a given model type.
 *
 * @function bo.system.EnsureArgument.isModelType
 * @param {(object|null)} [value=null] - The value to check.
 * @param {(constructor|Array.<constructor>)} model - The model type that value must be an instance of.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {(object|null)} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be a model type.
 */
EnsureArgument.isModelType = function (value, model, message) {
  var models = model instanceof Array ? model : [ model ];
  if (!(models.some(function (modelType) {
        return value && value.constructor && value.constructor.modelType === modelType;
      })))
    failed(arguments, 3, message || 'modelType', models.join(' | '));
  return value;
};

//endregion

//region Enumeration

/**
 * Checks if value is member of a given enumeration.
 *
 * @function bo.system.EnsureArgument.isEnumMember
 * @param {number} [value] - The value to check.
 * @param {constructor} type - The type of the enumeration.
 * @param {number} [defaultValue] - The type of the enumeration.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {number} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: Type is not an enumeration type.
 * @throws {@link bo.system.ArgumentError Argument error}: The argument must be an enumeration type item.
 */
EnsureArgument.isEnumMember = function (value, type, defaultValue, message) {
  if (!(type && type.hasMember && type.constructor &&
      type.constructor.super_ && type.constructor.super_.name === 'Enumeration'))
    failed(arguments, 4, 'enumType', type);
  if ((value === null || value === undefined) && typeof defaultValue === 'number')
    value = defaultValue;
  if (!type.hasMember(value))
    failed(arguments, 4, message || 'enumMember', type);
  return value;
};

//endregion

//region Array

/**
 * Checks if value is an array of a given type or null.
 *
 * @function bo.system.EnsureArgument.isOptionalArray
 * @param {(Array.<type>|null)} [value=Array.<type>] - The value to check.
 * @param {*} type - The type of the array items - a primitive type or a constructor.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {(Array.<type>|null)} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}:
 *      The argument must be an array of TYPE values, or a single TYPE values or null.
 * @throws {@link bo.system.ArgumentError Argument error}:
 *      The argument must be an array of TYPE objects, or a single TYPE object or null.
 */
EnsureArgument.isOptionalArray = function (value, type, message) {
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
};

/**
 * Checks if value is an array of a given type.
 *
 * @function bo.system.EnsureArgument.isMandatoryArray
 * @param {Array.<type>} [value] - The value to check.
 * @param {*} type - The type of the array items - a primitive type or a constructor.
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 * @returns {Array.<type>} The checked value.
 *
 * @throws {@link bo.system.ArgumentError Argument error}:
 *      The argument must be an array of TYPE values, or a single TYPE values or null.
 * @throws {@link bo.system.ArgumentError Argument error}:
 *      The argument must be an array of TYPE objects, or a single TYPE object or null.
 */
EnsureArgument.isMandatoryArray = function (value, type, message) {
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
};

//endregion

Object.freeze(EnsureArgument);

module.exports = EnsureArgument;
