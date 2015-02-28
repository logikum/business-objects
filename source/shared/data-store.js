'use strict';

var CLASS_NAME = 'DataStore';

var EnsureArgument = require('./../system/ensure-argument.js');
var PropertyInfo = require('./property-info.js');
var CollectionBase = require('../collection-base.js');
var ModelBase = require('../model-base.js');

/**
 * @classdesc Provides methods to manage the values of business object model's properties.
 * @description Creates a new data store object.
 *
 * @memberof bo.shared
 * @constructor
 */
function DataStore () {

  var data = {};

  /**
   * Initializes the value of a property in the store.
   *
   * @param {bo.shared.PropertyInfo} property - The definition of the model property.
   * @param {*} value - The default value of the property (null or a child model).
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The property must be a PropertyInfo object.
   * @throws {@link bo.system.ArgumentError Argument error}: The value must be null, a model or a collection.
   */
  this.initValue = function (property, value) {

    property = EnsureArgument.isMandatoryType(property, PropertyInfo,
        'm_manType', CLASS_NAME, 'initValue', 'property');
    value = EnsureArgument.isOptionalType(value, [ CollectionBase, ModelBase ],
        'm_optType', CLASS_NAME, 'initValue', 'value');

    data[property.name] = value;
  };

  /**
   * Gets the value of a model property.
   *
   * @param {bo.shared.PropertyInfo} property - The definition of the model property.
   * @returns {*} The current value of the property.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The property must be a PropertyInfo object.
   */
  this.getValue = function (property) {

    property = EnsureArgument.isMandatoryType(property, PropertyInfo,
        'm_manType', CLASS_NAME, 'getValue', 'property');

    return data[property.name];
  };

  /**
   * Sets the value of a model property.
   *
   * @param {bo.shared.PropertyInfo} property - The definition of the model property.
   * @param {*} value - The new value of the property.
   * @returns {boolean} True if the value of the property has been changed, otherwise false.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The property must be a PropertyInfo object.
   * @throws {@link bo.system.ArgumentError Argument error}: The value must be defined.
   */
  this.setValue = function (property, value) {

    property = EnsureArgument.isMandatoryType(property, PropertyInfo,
        'm_manType', CLASS_NAME, 'setValue', 'property');
    value = EnsureArgument.isDefined(value,
        'm_defined', CLASS_NAME, 'setValue', 'value');

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
