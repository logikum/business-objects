'use strict';

var ensureArgument = require('./ensure-argument.js');

function TransferContext(properties, getValue, setValue) {
  var self = this;

  this.properties = ensureArgument.isMandatoryType(properties, Array,
    'The properties argument of TransferContext constructor must be an array of PropertyInfo objects.');
  getValue = ensureArgument.isMandatoryFunction(getValue,
    'The getValue argument of TransferContext constructor must be a function.');
  setValue = ensureArgument.isMandatoryFunction(setValue,
    'The setValue argument of TransferContext constructor must be a function.');

  function getByName (name) {
    for (var i = 0; i < self.properties.length; i++) {
      if (self.properties[i].name === name)
        return self.properties[i];
    }
    throw new Error('There is no property named ' + name + '.');
  }

  this.getValue = function (propertyName) {
    propertyName = ensureArgument.isMandatoryString(propertyName,
      'The propertyName argument of TransferContext.getValue method must be a  non-empty string.');
    return getValue(getByName(propertyName));
  };

  this.setValue = function (propertyName, value) {
    propertyName = ensureArgument.isMandatoryString(propertyName,
      'The propertyName argument of TransferContext.setValue method must be a  non-empty string.');
    if (value !== undefined) {
      setValue(getByName(propertyName), value);
    }
  };

  // Immutable object.
  Object.freeze(this);
}

module.exports = TransferContext;
