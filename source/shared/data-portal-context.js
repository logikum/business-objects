'use strict';

var CLASS_NAME = 'DataPortalContext';

var config = require('./configuration-reader.js');
var EnsureArgument = require('./../system/ensure-argument.js');
var ModelError = require('./model-error.js');
var PropertyInfo = require('./property-info.js');
var UserInfo = require('./../system/user-info.js');

/**
 * @classdesc
 *    Provides the context for custom data portal actions.
 * @description
 *    Creates a new data context object.
 *      </br></br>
 *    <i><b>Warning:</b> Data context objects are created in models internally.
 *    They are intended only to make publicly available the context
 *    for custom data portal actions.</i>
 *
 * @memberof bo.shared
 * @constructor
 * @param {object} dao - The data access object of the current model.
 * @param {Array.<bo.shared.PropertyInfo>} properties - An array of property definitions.
 * @param {internal~getValue} [getValue] - A function that returns the current value of a property.
 * @param {internal~setValue} [setValue] - A function that changes the current value of a property.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The dao argument must be an object.
 * @throws {@link bo.system.ArgumentError Argument error}: The properties must be an array
 *    of PropertyInfo objects, or a single PropertyInfo object or null.
 * @throws {@link bo.system.ArgumentError Argument error}: The getValue argument must be a function.
 * @throws {@link bo.system.ArgumentError Argument error}: The setValue argument must be a function.
 */
function DataPortalContext (dao, properties, getValue, setValue) {
  var self = this;
  var isDirty = false;
  var daConnection = null;

  /**
   * The data access object of the current model.
   * @type {object}
   * @readonly
   */
  this.dao = EnsureArgument.isMandatoryObject(dao || {},
      'c_manObject', CLASS_NAME, 'dao');
  /**
   * Array of property definitions that may appear on the data transfer object.
   * @type {Array.<bo.shared.PropertyInfo>}
   * @readonly
   */
  this.properties = EnsureArgument.isOptionalArray(properties, PropertyInfo,
      'c_optArray', CLASS_NAME, 'properties');

  getValue = EnsureArgument.isOptionalFunction(getValue,
      'c_optFunction', CLASS_NAME, 'getValue');
  setValue = EnsureArgument.isOptionalFunction(setValue,
      'c_optFunction', CLASS_NAME, 'setValue');

  /**
   * The current user.
   * @type {bo.system.UserInfo}
   * @readonly
   */
  this.user = config.getUser();
  /**
   * The current locale.
   * @type {string}
   * @readonly
   */
  this.locale = config.getLocale();

  /**
   * Indicates whether the current model itself has been changed.
   * @name bo.shared.DataPortalContext#connection
   * @type {object}
   * @readonly
   */
  Object.defineProperty(self, 'connection', {
    get: function () {
      return daConnection;
    },
    enumerable: true
  });

  /**
   * Indicates whether the current model itself has been changed.
   * @name bo.shared.DataPortalContext#isSelfDirty
   * @type {boolean}
   * @readonly
   */
  Object.defineProperty(self, 'isSelfDirty', {
    get: function () {
      return isDirty;
    },
    enumerable: true
  });

  /**
   * Sets the current state of the model.
   *
   * @param {object} [connection] - The current connection for the data store.
   * @param {boolean} [isSelfDirty] - Indicates whether the current model itself has been changed.
   * @returns {bo.shared.DataPortalContext} The data context object itself.
   */
  this.setState = function (connection, isSelfDirty) {
    daConnection = connection || null;
    isDirty = isSelfDirty === true;
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
   * @throws {@link bo.shared.ModelError Model error}: Cannot read the properties of a collection.
   */
  this.getValue = function (propertyName) {
    propertyName = EnsureArgument.isMandatoryString(propertyName,
        'm_manString', CLASS_NAME, 'getValue', 'propertyName');
    if (getValue)
      return getValue(getByName(propertyName));
    else
      throw new ModelError('readCollection', properties.name, propertyName);
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
   * @throws {@link bo.shared.ModelError Model error}: Cannot write the properties of a collection.
   */
  this.setValue = function (propertyName, value) {
    propertyName = EnsureArgument.isMandatoryString(propertyName,
        'm_manString', CLASS_NAME, 'setValue', 'propertyName');
    if (setValue) {
      if (value !== undefined) {
        setValue(getByName(propertyName), value);
      }
    } else
      throw new ModelError('writeCollection', properties.name, propertyName);
  };

  // Immutable object.
  Object.freeze(this);
}

module.exports = DataPortalContext;