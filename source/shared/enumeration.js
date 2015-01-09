'use strict';

var ensureArgument = require('./ensure-argument.js');
var EnumerationError = require('./enumeration-error.js');

function Enumeration (name) {
  this.$name = ensureArgument.isMandatoryString(name,
      'c_manString', 'Enumeration', 'name')
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
      'm_manNumber', 'Enumeration', 'getName', 'value');

  for (var propertyName in this) {
    if (this.hasOwnProperty(propertyName) && typeof this[propertyName] === 'number') {
      if (this[propertyName] === value)
        return propertyName;
    }
  }
  throw new EnumerationError('enumValue', this.$name, value);
};

Enumeration.prototype.getValue = function (name) {
  name = ensureArgument.isMandatoryString(name,
      'm_manString', 'Enumeration', 'getValue', 'name');

  for (var propertyName in this) {
    if (this.hasOwnProperty(propertyName) && typeof this[propertyName] === 'number') {
      if (propertyName === name)
        return this[propertyName];
    }
  }
  throw new EnumerationError('enumName', this.$name, name);
};

Enumeration.prototype.check = function (value, message) {
  for (var propertyName in this) {
    if (this.hasOwnProperty(propertyName) && typeof this[propertyName] === 'number') {
      if (this[propertyName] === value)
        return;
    }
  }
  throw new EnumerationError(message || 'enumValue', this.$name, value);
};

module.exports = Enumeration;
