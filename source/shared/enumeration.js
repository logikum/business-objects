'use strict';

var ensureArgument = require('./ensure-argument.js');
var EnumerationError = require('./enumeration-error.js');

var Enumeration = function (items) {

  var self = this;
  var count;

  for (count = 0; count < arguments.length; count++) {
    var item = ensureArgument.isMandatoryString(arguments[count],
        'All arguments of Enumeration constructor must be a non-empty string.');
    this[item] = count;
  }
  if (count === 0)
    throw new Error('Enumeration constructor requires at least one item.');

  function getName(value, throwError) {
    for (var property in self) {
      if (self.hasOwnProperty(property)) {
        if (self[property] === value)
          return property;
      }
    }
    if (throwError)
      throw new EnumerationError('The passed value is not an enumeration item.');
    else
      return null;
  }

  this.count = function() {
    return count;
  };

  this.getName = function(value) {
    return getName(value, true);
  };

  this.getValue = function(name) {
    for (var property in this) {
      if (this.hasOwnProperty(property)) {
        if (property === name)
          return this[name];
      }
    }
    throw new EnumerationError('The passed name is not an enumeration item.')
  };

  this.check = function(value, message) {
    if (typeof value !== 'number' || getName(value, false) === null)
      throw new EnumerationError(message || 'The passed value is not an enumeration item.')
  };

  Object.freeze(this);
};

module.exports = Enumeration;
