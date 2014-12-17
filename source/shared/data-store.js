'use strict';

var ensureArgument = require('./ensure-argument.js');
var PropertyInfo = require('./property-info.js');
var CollectionBase = require('../collection-base.js');
var ModelBase = require('../model-base.js');

function DataStore() {

  var data = {};

  this.initValue = function (property, value) {
    property = ensureArgument.isMandatoryType(property, PropertyInfo,
        'The property argument of PropertyManager.initValue method must be a PropertyInfo object.');
    value = ensureArgument.isOptionalType(value, [ CollectionBase, ModelBase ],
        'The value argument of PropertyManager.initValue method must be null or a model.');

    data[property.name] = value;
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

  // Immutable object.
  Object.freeze(this);
}

module.exports = DataStore;
