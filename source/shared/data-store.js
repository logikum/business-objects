/**
 * Data store module.
 * @module shared/data-store
 */
'use strict';

var ensureArgument = require('./ensure-argument.js');
var PropertyInfo = require('./property-info.js');
var CollectionBase = require('../collection-base.js');
var ModelBase = require('../model-base.js');

function DataStore() {

  var data = {};

  this.initValue = function (property, value) {

    property = ensureArgument.isMandatoryType(property, PropertyInfo,
        'm_manType', 'DataStore', 'initValue', 'property');
    value = ensureArgument.isOptionalType(value, [ CollectionBase, ModelBase ],
        'm_optType', 'DataStore', 'initValue', 'value');

    data[property.name] = value;
  };

  this.getValue = function (property) {

    property = ensureArgument.isMandatoryType(property, PropertyInfo,
        'm_manType', 'DataStore', 'getValue', 'property');

    return data[property.name];
  };

  this.setValue = function (property, value) {

    property = ensureArgument.isMandatoryType(property, PropertyInfo,
        'm_manType', 'DataStore', 'setValue', 'property');
    value = ensureArgument.isDefined(value,
        'm_defined', 'DataStore', 'setValue', 'value');

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
