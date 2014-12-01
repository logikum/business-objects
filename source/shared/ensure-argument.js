'use strict';

var ArgumentError = require('./argument-error.js');

var ensureArgument = {

  //region String

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
    if (value !== null && typeof value !== 'object')
      throw new ArgumentError(message || 'The argument must be an object or null.');
    return value;
  },

  isMandatoryObject: function (value, message) {
    if (typeof value !== 'object')
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
    if (value !== null && !(value instanceof type))
      throw new ArgumentError(message || 'The argument must be a ' + type + ' object or null.');
    return value;
  },

  isMandatoryType: function (value, type, message) {
    if (!(value instanceof type))
      throw new ArgumentError(message || 'The argument must be a ' + type + ' object.');
    return value;
  }

  //endregion
};

module.exports = ensureArgument;
