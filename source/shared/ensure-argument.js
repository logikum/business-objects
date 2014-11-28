'use strict';

var ArgumentError = require('./argument-error.js');

var ensureArgument = {

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
};

module.exports = ensureArgument;
