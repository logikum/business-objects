'use strict';

var ensureArgument = require('./ensure-argument.js');
var PropertyInfo = require('./property-info.js');

function PropertyManager() {

  var items = [];
  var data = {};
  var args = Array.prototype.slice.call(arguments);

  var name = args.shift() || '';
  this.name = ensureArgument.isMandatoryString(name,
      'The name argument of PropertyManager constructor must be a  non-empty string.');

  args.forEach(function (arg) {
    items.push(ensureArgument.isMandatoryType(arg, PropertyInfo,
        'All arguments of PropertyManager constructor but the first must be a PropertyInfo object.'));
  });

  //region Item management

  this.add = function (property) {
    items.push(ensureArgument.isMandatoryType(property, PropertyInfo,
        'The property argument of PropertyManager.push method must be a PropertyInfo object.'));
  };

  this.create = function (name, type, writable) {
    var property = new PropertyInfo(name, type, writable);
    items.push(property);
    return property;
  };

  this.contains = function (property) {
    property = ensureArgument.isMandatoryType(property, PropertyInfo,
        'The property argument of PropertyManager.contains method must be a PropertyInfo object.');

    return items.some(function (item) {
      return item.name === property.name;
    });
  };

  this.getByName = function (name, message) {
    name = ensureArgument.isMandatoryString(name,
        'The name argument of PropertyManager.getByName method must be a  non-empty string.');

    for (var i = 0; i < items.length; i++) {
      if (items[i].name === name)
        return items[i];
    }
    throw new Error(message || 'The PropertyManager has no element named ' + name + '.');
  };

  this.forEach = function (callback) {
    items.forEach(callback);
  };

  //endregion

  //region Value handling

  this.initValue = function (property, value) {
    property = ensureArgument.isMandatoryType(property, PropertyInfo,
        'The property argument of PropertyManager.initValue method must be a PropertyInfo object.');
    if (value !== null && typeof value !== 'object')
      throw new Error('The value argument of PropertyManager.initValue method must be null or a model.');

    data[property.name] = value || null;
  };

  this.getValue = function (property) {
    property = ensureArgument.isMandatoryType(property, PropertyInfo,
        'The property argument of PropertyManager.getValue method must be a PropertyInfo object.');

    return data[property.name];
  };

  this.setValue = function (property, value) {
    property = ensureArgument.isMandatoryType(property, PropertyInfo,
        'The property argument of PropertyManager.setValue method must be a PropertyInfo object.');
    if (value === undefined)
      throw new Error('The value argument of PropertyManager.setValue method must be supplied.');

    property.type.check(value);
    if (value !== data[property.name]) {
      data[property.name] = value;
      return true;
    }
    return false;
  };

  //endregion

  // Immutable object.
  Object.freeze(this);
}

module.exports = PropertyManager;
