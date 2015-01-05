'use strict';

var ensureArgument = require('./ensure-argument.js');
var EnumerationError = require('./enumeration-error.js');

function Enumeration () {
}

Enumeration.prototype.count = function () {
  var count = 0;
  for (var propertyName in this) {
    if (this.hasOwnProperty(propertyName) && typeof this[propertyName] === 'number') {
      count++;
    }
  }
  return count;
};

Enumeration.prototype.getName = function (value) {
  value = ensureArgument.isMandatoryNumber(value,
      'The value argument of Enumeration.getName method must be a number value.');

  for (var propertyName in this) {
    if (this.hasOwnProperty(propertyName) && typeof this[propertyName] === 'number') {
      if (this[propertyName] === value)
        return propertyName;
    }
  }
  throw new EnumerationError('The passed value (' + value + ') is not an enumeration item.');
};

Enumeration.prototype.getValue = function (name) {
  name = ensureArgument.isMandatoryString(name,
      'The name argument of Enumeration.getValue method must be a non-empty string.');

  for (var propertyName in this) {
    if (this.hasOwnProperty(propertyName) && typeof this[propertyName] === 'number') {
      if (propertyName === name)
        return this[propertyName];
    }
  }
  throw new EnumerationError('The passed name (' + name + ') is not an enumeration item.');
};

Enumeration.prototype.check = function (value, message) {
  for (var propertyName in this) {
    if (this.hasOwnProperty(propertyName) && typeof this[propertyName] === 'number') {
      if (this[propertyName] === value)
        return;
    }
  }
  throw new EnumerationError(message || 'The passed value (' + value + ') is not an enumeration item.');
};

module.exports = Enumeration;
