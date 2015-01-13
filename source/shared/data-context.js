/**
 * Data context module.
 * @module shared/data-context
 */
'use strict';

var ensureArgument = require('./ensure-argument.js');
var ModelError = require('./model-error.js');
var PropertyInfo = require('./property-info.js');
var UserInfo = require('./user-info.js');

function DataContext(dao, user, isSelfDirty, properties, getValue, setValue) {
  var self = this;

  this.dao = ensureArgument.isMandatoryObject(dao || {},
      'c_manObject', 'DataContext', 'dao');
  this.user = ensureArgument.isOptionalType(user, UserInfo,
      'c_optType', 'DataContext', 'user');
  var isDirty = ensureArgument.isMandatoryBoolean(isSelfDirty || false,
      'c_manBoolean', 'DataContext', 'isSelfDirty');
  this.properties = ensureArgument.isOptionalArray(properties, PropertyInfo,
      'c_optArray', 'DataContext', 'properties');
  getValue = ensureArgument.isOptionalFunction(getValue,
      'c_optFunction', 'DataContext', 'getValue');
  setValue = ensureArgument.isOptionalFunction(setValue,
      'c_optFunction', 'DataContext', 'setValue');

  Object.defineProperty(self, 'isSelfDirty', {
    get: function () {
      return isDirty;
    },
    enumerable: true
  });

  this.setSelfDirty = function (isSelfDirty) {
    isDirty = isSelfDirty === true;
    return this;
  };

  function getByName (name) {
    for (var i = 0; i < self.properties.length; i++) {
      if (self.properties[i].name === name)
        return self.properties[i];
    }
    throw new ModelError('noProperty', properties.name, name);
  }

  this.getValue = function (propertyName) {
    propertyName = ensureArgument.isMandatoryString(propertyName,
        'm_manString', 'DataContext', 'getValue', 'propertyName');
    if (getValue)
      return getValue(getByName(propertyName));
    else
      throw new ModelError('readCollection', properties.name, propertyName);
  };

  this.setValue = function (propertyName, value) {
    propertyName = ensureArgument.isMandatoryString(propertyName,
        'm_manString', 'DataContext', 'setValue', 'propertyName');
    if (setValue) {
      if (value !== undefined) {
        setValue(getByName(propertyName), value);
      }
    } else
      throw new ModelError('writeCollection', properties.name, propertyName);
  };

  // Immutable object.
  Object.freeze(this);
}

module.exports = DataContext;
