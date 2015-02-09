'use strict';

var CLASS_NAME = 'TransferContext';

var EnsureArgument = require('./../system/ensure-argument.js');
var ModelError = require('./model-error.js');
var PropertyInfo = require('./property-info.js');

/**
 * @classdesc
 *    Provides the context for custom client transfer objects.
 * @description
 *    Creates a new transfer context object.
 *      </br></br>
 *    <i><b>Warning:</b> Transfer context objects are created in models internally.
 *    They are intended only to make publicly available the values of model properties
 *    for custom client transfer objects.</i>
 *
 * @memberof bo.shared
 * @constructor
 * @param {Array.<bo.shared.PropertyInfo>} [properties] - An array of property definitions.
 * @param {internal~getValue} [getValue] - A function that returns the current value of a property.
 * @param {internal~setValue} [setValue] - A function that changes the current value of a property.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The properties must be an array
 *    of PropertyInfo objects, or a single PropertyInfo object or null.
 * @throws {@link bo.system.ArgumentError Argument error}: The getValue argument must be a function.
 * @throws {@link bo.system.ArgumentError Argument error}: The setValue argument must be a function.
 */
function TransferContext (properties, getValue, setValue) {
  var self = this;

  /**
   * Array of property definitions that may appear on the client transfer object.
   * @type {Array.<bo.shared.PropertyInfo>}
   * @readonly
   */
  this.properties = EnsureArgument.isOptionalArray(properties, PropertyInfo,
      'c_optArray', CLASS_NAME, 'properties');
  getValue = EnsureArgument.isOptionalFunction(getValue,
      'c_optFunction', CLASS_NAME, 'getValue');
  setValue = EnsureArgument.isOptionalFunction(setValue,
      'c_optFunction', CLASS_NAME, 'setValue');

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
   * @returns {*} The value of a model property.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The model has no property with the given name.
   */
  this.getValue = function (propertyName) {
    if (getValue) {
      propertyName = EnsureArgument.isMandatoryString(propertyName,
          'm_manString', CLASS_NAME, 'getValue', 'propertyName');
      return getValue(getByName(propertyName));
    } else
      throw new ModelError('getValue');
  };

  /**
   * Sets the current value of a model property.
   *
   * @param {string} propertyName - The name of the property.
   * @param {*} value - The new value of the property.
   *
   * @throws {@link bo.system.ArgumentError Argument error}: The name must be a non-empty string.
   * @throws {@link bo.system.ArgumentError Argument error}: The model has no property with the given name.
   * @throws {@link bo.dataTypes.DataTypeError Data type error}: The passed value has wrong data type.
   */
  this.setValue = function (propertyName, value) {
    if (setValue) {
      propertyName = EnsureArgument.isMandatoryString(propertyName,
          'm_manString', CLASS_NAME, 'setValue', 'propertyName');
      if (value !== undefined) {
        setValue(getByName(propertyName), value);
      }
    } else
      throw new ModelError('setValue');
  };

  // Immutable object.
  Object.freeze(this);
}

module.exports = TransferContext;
