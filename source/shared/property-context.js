'use strict';

var ensureArgument = require('./ensure-argument.js');
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
 * @throws {@link bo.shared.ArgumentError ArgumentError}: The properties must be an array
 *    of PropertyInfo objects, or a single PropertyInfo object or null.
 * @throws {@link bo.shared.ArgumentError ArgumentError}: The getValue argument must be a function.
 * @throws {@link bo.shared.ArgumentError ArgumentError}: The setValue argument must be a function.
 */
function PropertyContext (properties, getValue, setValue) {
  var self = this;
  var primaryProperty = null;

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
  this.properties = ensureArgument.isOptionalArray(properties, PropertyInfo,
      'c_optArray', 'PropertyContext', 'properties');
  getValue = ensureArgument.isOptionalFunction(getValue,
      'c_optFunction', 'PropertyContext', 'getValue');
  setValue = ensureArgument.isOptionalFunction(setValue,
      'c_optFunction', 'PropertyContext', 'setValue');

  /**
   * Sets the primary property of the custom function.
   *
   * @param {bo.shared.PropertyInfo} property - The primary property of the custom function.
   * @returns {bo.shared.PropertyContext} The property context object itself.
   */
  this.with = function (property) {
    primaryProperty = ensureArgument.isMandatoryType(property, PropertyInfo,
        'm_manType', 'PropertyContext', 'with', 'property');
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
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The name must be a non-empty string.
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The model has no property with the given name.
   * @throws {@link bo.shared.ModelError ModelError}: The property cannot be read.
   */
  this.getValue = function (propertyName) {
    propertyName = ensureArgument.isMandatoryString(propertyName,
        'm_manString', 'PropertyContext', 'getValue', 'propertyName');
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
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The name must be a non-empty string.
   * @throws {@link bo.shared.ArgumentError ArgumentError}: The model has no property with the given name.
   * @throws {@link bo.dataTypes.DataTypeError DataTypeError}: The passed value has wrong data type.
   * @throws {@link bo.shared.ModelError ModelError}: The property cannot be written.
   */
  this.setValue = function (propertyName, value) {
    propertyName = ensureArgument.isMandatoryString(propertyName,
        'm_manString', 'PropertyContext', 'setValue', 'propertyName');
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
