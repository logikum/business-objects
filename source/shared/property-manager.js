/**
 * Property manager module.
 * @module shared/property-manager
 */
'use strict';

var ensureArgument = require('./ensure-argument.js');
var ArgumentError = require('./argument-error.js');
var PropertyInfo = require('./property-info.js');
var DataType = require('../data-types/data-type.js');

function PropertyManager(name /*, property1, property2 [, ...] */) {

  var items = [];
  var changed_c = false;  // for children
  var changed_k = false;  // for key
  var children = [];
  var key;

  this.name = ensureArgument.isMandatoryString(name,
      'c_manString', 'PropertyManager', 'name');

  Array.prototype.slice.call(arguments, 1)
      .forEach(function (arg) {
        items.push(ensureArgument.isMandatoryType(arg, PropertyInfo, 'propManCtor'));
        changed_c = true;
        changed_k = true;
      });

  //region Item management

  this.add = function (property) {
    items.push(ensureArgument.isMandatoryType(property, PropertyInfo,
        'm_manType', 'PropertyManager', 'add', 'property'));
    changed_c = true;
    changed_k = true;
  };

  this.create = function (name, type, flags) {
    var property = new PropertyInfo(name, type, flags);
    items.push(property);
    changed_c = true;
    changed_k = true;
    return property;
  };

  this.contains = function (property) {
    property = ensureArgument.isMandatoryType(property, PropertyInfo,
        'm_manType', 'PropertyManager', 'contains', 'property');

    return items.some(function (item) {
      return item.name === property.name;
    });
  };

  this.getByName = function (name, message) {
    name = ensureArgument.isMandatoryString(name,
        'm_manString', 'PropertyManager', 'getByName', 'name');

    for (var i = 0; i < items.length; i++) {
      if (items[i].name === name)
        return items[i];
    }
    throw new ArgumentError(message || 'propManItem', name);
  };

  this.toArray = function () {
    var array = items.filter(function (item) {
      return item.type instanceof DataType;
    });
    array.name = this.name;
    return array;
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

  //region Children

  function checkChildren () {
    if (changed_c) {
      children = items.filter(function (item) {
        return !(item.type instanceof DataType);
      });
      changed_c = false;
    }
  }

  this.children = function () {
    checkChildren();
    return children;
  };

  this.childCount = function () {
    checkChildren();
    return children.length;
  };

  //endregion

  //region Keys

  function checkKeys (getPropertyValue) {
    if (changed_k) {
      // Get key properties.
      var keys = items.filter(function (item) {
        return item.isKey;
      });
      // Evaluate result.
      switch (keys.length) {
        case 0:
          // No keys: dto will be used.
          key = {};
          items.forEach(function (item) {
            if (item.isOnDto)
              key[item.name] = getPropertyValue(item);
          });
          break;
        case 1:
          // One key: key value will be used.
          key = getPropertyValue(keys[0]);
          break;
        default:
          // More keys: key object will be used.
          key = {};
          keys.forEach(function (item) {
            key[item.name] = getPropertyValue(item);
          });
      }
      // Done.
      changed_k = false;
    }
  }

  this.getKey = function (getPropertyValue) {
    checkKeys(getPropertyValue);
    return key;
  };

  this.keyEquals = function (data, getPropertyValue) {
    // Get key properties.
    var keys = items.filter(function (item) {
      return item.isKey;
    });
    // Get key values.
    var values = {};
    if (keys.length) {
      keys.forEach(function (item) {
        values[item.name] = getPropertyValue(item);
      });
    } else {
      items.forEach(function (item) {
        if (item.isOnCto)
          values[item.name] = getPropertyValue(item);
      });
    }
    // Compare key values to data.
    for (var propertyName in values) {
      if (values.hasOwnProperty(propertyName)) {
        if (data[propertyName] === undefined || data[propertyName] !== values[propertyName])
          return false;
      }
    }
    return true;
  };

  //endregion

  // Immutable object.
  Object.freeze(this);
}

module.exports = PropertyManager;
