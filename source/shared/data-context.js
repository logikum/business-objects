'use strict';

var ensureArgument = require('./ensure-argument.js');
var UserInfo = require('./user-info.js');

function DataContext(dao, user, isSelfDirty, properties, getValue, setValue) {
  var self = this;

  this.dao = ensureArgument.isMandatoryObject(dao,
    'The dao argument of DataContext constructor must be an object.');
  this.user = ensureArgument.isOptionalType(user, UserInfo,
    'The user argument of DataContext constructor must be an UserInfo object or null.');
  this.isSelfDirty = ensureArgument.isMandatoryBoolean(isSelfDirty,
    'The isSelfDirty argument of DataContext constructor must be a Boolean value.');
  this.properties = ensureArgument.isMandatoryType(properties, Array,
    'The properties argument of DataContext constructor must be an array of PropertyInfo objects.');
  getValue = ensureArgument.isMandatoryFunction(getValue,
    'The getValue argument of DataContext constructor must be a function.');
  setValue = ensureArgument.isMandatoryFunction(setValue,
    'The setValue argument of DataContext constructor must be a function.');

  function getByName (name) {
    for (var i = 0; i < self.properties.length; i++) {
      if (self.properties[i].name === name)
        return self.properties[i];
    }
    throw new Error(properties.name + ' model has no property named ' + name + '.');
  }

  this.getValue = function (propertyName) {
    propertyName = ensureArgument.isMandatoryString(propertyName,
      'The propertyName argument of DataContext.getValue method must be a  non-empty string.');
    return getValue(getByName(propertyName));
  };

  this.setValue = function (propertyName, value) {
    propertyName = ensureArgument.isMandatoryString(propertyName,
      'The propertyName argument of DataContext.setValue method must be a  non-empty string.');
    if (value !== undefined) {
      setValue(getByName(propertyName), value);
    }
  };

  // Immutable object.
  Object.freeze(this);
}

module.exports = DataContext;
