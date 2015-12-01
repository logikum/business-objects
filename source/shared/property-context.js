'use strict';

var CLASS_NAME = 'PropertyContext';

var Argument = require('../system/argument-check.js');
var ModelError = require('./model-error.js');
var PropertyInfo = require('./property-info.js');

/**
 * @classdesc
 *    Provides the context for custom property functions.
 * @description
 *    Creates a new property context object.
 *      </br></br>
 *    <i><b>Warning:</b> Property context objects are created in models internally.
 *    They are intended only to make publicly available the context
 *    for custom property functions.</i>
 *
 * @memberof bo.shared
 * @constructor
 * @param {Array.<bo.shared.PropertyInfo>} properties - An array of property definitions.
 * @param {internal~getValue} [getValue] - A function that returns the current value of a property.
 * @param {internal~setValue} [setValue] - A function that changes the current value of a property.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The properties must be an array
 *    of PropertyInfo objects, or a single PropertyInfo object or null.
 * @throws {@link bo.system.ArgumentError Argument error}: The getValue argument must be a function.
 * @throws {@link bo.system.ArgumentError Argument error}: The setValue argument must be a function.
 */
function PropertyContext (properties, getValue, setValue) {
  var self = this;
  var primaryProperty = null;
  var check = Argument.inConstructor(CLASS_NAME);

  /**
   * The primary property of the custom function.
   * @name bo.shared.PropertyContext#primaryProperty
   * @type {bo.shared.PropertyInfo}
   * @readonly
   */
  Object.defineProperty(self, 'primaryProperty', {
    get: function () {
      return primaryProperty;
    },
    enumerable: true
  });

  /**
   * Array of property definitions that may used by the custom function.
   * @type {Array.<bo.shared.PropertyInfo>}
   * @readonly
   */
  this.properties = check(properties).forOptional('properties').asArray(PropertyInfo);
  getValue = check(getValue).forOptional('getValue').asFunction();
  setValue = check(setValue).forOptional('setValue').asFunction();

  /**
   * Sets the primary property of the custom function.
   *
   * @param {bo.shared.PropertyInfo} property - The primary property of the custom function.
   * @returns {bo.shared.PropertyContext} The property context object itself.
   */
  this.with = function (property) {
    primaryProperty = Argument.inMethod(CLASS_NAME, 'with')
        .check(property).forMandatory('property').asType(PropertyInfo);
    return this;
  };

  function getByName (name) {
    for (var i = 0; i < self.properties.length; i++) {
      if (self.properties[i].name === name)
        return self.properties[i];
    }
    throw new ModelError('noProperty', properties.name, name);
  }

  /**
   * Gets the current value of a model property.
   *
   * @param {string} propertyName - The name of the property.
   * @returns {*} The value of the model property.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The model has no property with the given name.
   * @throws {@link bo.shared.ModelError Model error}: The property cannot be read.
   */
  this.getValue = function (propertyName) {
    propertyName = Argument.inMethod(CLASS_NAME, 'getValue')
        .check(propertyName).forMandatory('propertyName').asString();
    if (getValue)
      return getValue(getByName(propertyName));
    else
      throw new ModelError('readProperty', properties.name, propertyName);
  };

  /**
   * Sets the current value of a model property.
   *
   * @param {string} propertyName - The name of the property.
   * @param {*} value - The new value of the property.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The model has no property with the given name.
   * @throws {@link bo.shared.ModelError Model error}: The property cannot be written.
   */
  this.setValue = function (propertyName, value) {
    propertyName = Argument.inMethod(CLASS_NAME, 'setValue')
        .check(propertyName).forMandatory('propertyName').asString();
    if (setValue) {
      if (value !== undefined) {
        setValue(getByName(propertyName), value);
      }
    } else
      throw new ModelError('writeProperty', properties.name, propertyName);
  };

  // Immutable object.
  Object.freeze(this);
}

module.exports = PropertyContext;
