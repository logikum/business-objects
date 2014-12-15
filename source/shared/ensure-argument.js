'use strict';

var ArgumentError = require('./argument-error.js');

var ensureArgument = {

  //region Generic

  hasValue: function (value, message) {
    if (value === null || value === undefined)
      throw new ArgumentError(message || 'The argument is required.');
    return value;
  },

  //endregion

  //region String

  isString: function (value, message) {
    if (typeof value !== 'string')
      throw new ArgumentError(message || 'The argument must be a string.');
    return value;
  },

  isOptionalString: function (value, message) {
    if (value === undefined)
      value = null;
    if (value !== null && typeof value !== 'string')
      throw new ArgumentError(message || 'The argument must be a string or null.');
    return value;
  },

  isMandatoryString: function (value, message) {
    if (typeof value !== 'string' || value.trim().length === 0)
      throw new ArgumentError(message || 'The argument must be a non-empty string.');
    return value;
  },

  //endregion

  //region Number

  isOptionalNumber: function (value, message) {
    if (value === undefined)
      value = null;
    if (value !== null && typeof value !== 'number')
      throw new ArgumentError(message || 'The argument must be a number value or null.');
    return value;
  },

  isMandatoryNumber: function (value, message) {
    if (typeof value !== 'number')
      throw new ArgumentError(message || 'The argument must be a number value.');
    return value;
  },

  //endregion

  //region Integer

  isOptionalInteger: function (value, message) {
    if (value === undefined)
      value = null;
    if (value !== null && (typeof value !== 'number' || value % 1 !== 0))
      throw new ArgumentError(message || 'The argument must be an integer value or null.');
    return value;
  },

  isMandatoryInteger: function (value, message) {
    if (typeof value !== 'number' || value % 1 !== 0)
      throw new ArgumentError(message || 'The argument must be an integer value.');
    return value;
  },

  //endregion

  //region Boolean

  isOptionalBoolean: function (value, message) {
    if (value === undefined)
      value = null;
    if (value !== null && typeof value !== 'boolean')
      throw new ArgumentError(message || 'The argument must be a Boolean value or null.');
    return value;
  },

  isMandatoryBoolean: function (value, message) {
    if (typeof value !== 'boolean')
      throw new ArgumentError(message || 'The argument must be a Boolean value.');
    return value;
  },

  //endregion

  //region Object

  isOptionalObject: function (value, message) {
    if (value === undefined)
      value = null;
    if (typeof value !== 'object')
      throw new ArgumentError(message || 'The argument must be an object or null.');
    return value;
  },

  isMandatoryObject: function (value, message) {
    if (typeof value !== 'object' || value === null)
      throw new ArgumentError(message || 'The argument must be an object.');
    return value;
  },

  //endregion

  //region Function

  isOptionalFunction: function (value, message) {
    if (value === undefined)
      value = null;
    if (value !== null && typeof value !== 'function')
      throw new ArgumentError(message || 'The argument must be a function or null.');
    return value;
  },

  isMandatoryFunction: function (value, message) {
    if (typeof value !== 'function')
      throw new ArgumentError(message || 'The argument must be a function.');
    return value;
  },

  //endregion

  //region Type

  isOptionalType: function (value, type, message) {
    if (value === undefined)
      value = null;
    var types = type instanceof Array ? type : [ type ];
    if (value !== null && !(types.some(function (option) {
        return value instanceof option || value.super_ === option;
      })))
      throw new ArgumentError(message || 'The argument must be a ' + types.join() + ' object or null.');
    return value;
  },

  isMandatoryType: function (value, type, message) {
    var types = type instanceof Array ? type : [ type ];
    if (!(types.some(function (option) {
        return value instanceof option || value.super_ === option;
      })))
      throw new ArgumentError(message || 'The argument must be a ' + type + ' object.');
    return value;
  },

  //endregion

  //region EnumMember

  isEnumMember: function (value, type, defaultValue, message) {
    if (!type || typeof type.check !== 'function')
      throw new ArgumentError('The ' + type + ' is not an enumeration type.');
    if (defaultValue && (value === null || value === undefined))
      value = defaultValue;
    type.check(value,
        message || 'The argument must be a member of ' + type + ' enumeration.');
    return value;
  }

  //endregion
};

module.exports = ensureArgument;
