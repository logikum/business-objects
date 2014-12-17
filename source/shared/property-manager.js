'use strict';

var ensureArgument = require('./ensure-argument.js');
var PropertyInfo = require('./property-info.js');
var DataType = require('../data-types/data-type.js');

function PropertyManager() {

  var items = [];
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

  this.create = function (name, type, flags) {
    var property = new PropertyInfo(name, type, flags);
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

  this.toArray = function () {
    return items.filter(function (item) {
      return item.type instanceof DataType;
    });
  };

  //endregion

  //region Public array methods

  this.forEach = function (callback) {
    items.forEach(callback);
  };

  this.filter = function (callback) {
    return items.filter(callback);
  };

  this.map = function (callback) {
    return items.map(callback);
  };

  //endregion

  // Immutable object.
  Object.freeze(this);
}

module.exports = PropertyManager;
