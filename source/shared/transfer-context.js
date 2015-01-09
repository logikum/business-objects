'use strict';

var ensureArgument = require('./ensure-argument.js');
var ModelError = require('./model-error.js');
var PropertyInfo = require('./property-info.js');

function TransferContext(properties, getValue, setValue) {
  var self = this;

  this.properties = ensureArgument.isOptionalArray(properties, PropertyInfo,
      'c_optArray', 'TransferContext', 'properties');
  getValue = ensureArgument.isMandatoryFunction(getValue,
      'c_manFunction', 'TransferContext', 'getValue');
  setValue = ensureArgument.isMandatoryFunction(setValue,
      'c_manFunction', 'TransferContext', 'setValue');

  function getByName (name) {
    for (var i = 0; i < self.properties.length; i++) {
      if (self.properties[i].name === name)
        return self.properties[i];
    }
    throw new ModelError('noProperty', properties.name, name);
  }

  this.getValue = function (propertyName) {
    propertyName = ensureArgument.isMandatoryString(propertyName,
        'm_manString', 'TransferContext', 'getValue', 'propertyName');
    return getValue(getByName(propertyName));
  };

  this.setValue = function (propertyName, value) {
    propertyName = ensureArgument.isMandatoryString(propertyName,
        'm_manString', 'TransferContext', 'setValue', 'propertyName');
    if (value !== undefined) {
      setValue(getByName(propertyName), value);
    }
  };

  // Immutable object.
  Object.freeze(this);
}

module.exports = TransferContext;
