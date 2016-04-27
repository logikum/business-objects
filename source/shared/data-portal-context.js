'use strict';

var CLASS_NAME = 'DataPortalContext';

var config = require('./configuration-reader.js');
var Argument = require('../system/argument-check.js');
var ModelError = require('./model-error.js');
var PropertyInfo = require('./property-info.js');
var UserInfo = require('../system/user-info.js');

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

  //region Variables

  var self = this;
  var isDirty = false;
  var daConnection = null;
  var fnFulfill = null;
  var fnReject = null;
  var check = Argument.inConstructor(CLASS_NAME);

  //endregion

  //region Properties

  /**
   * The data access object of the current model.
   * @type {object}
   * @readonly
   */

  this.dao = check(dao || {}).forMandatory('dao').asObject();
  /**
   * Array of property definitions that may appear on the data transfer object.
   * @type {Array.<bo.shared.PropertyInfo>}
   * @readonly
   */
  this.properties = check(properties).forOptional('properties').asArray(PropertyInfo);

  getValue = check(getValue).forOptional('getValue').asFunction();
  setValue = check(setValue).forOptional('setValue').asFunction();

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
   * The connection object for the data source.
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
   * The fulfilling function of the promise when extension manager
   * calls a custom data portal method.
   * @name bo.shared.DataPortalContext#fulfill
   * @type {function}
   * @readonly
   */
  Object.defineProperty(self, 'fulfill', {
    get: function () {
      return fnFulfill;
    },
    enumerable: true
  });

  /**
   * The rejecting function of the promise when extension manager
   * calls a custom data portal method.
   * @name bo.shared.DataPortalContext#reject
   * @type {function}
   * @readonly
   */
  Object.defineProperty(self, 'reject', {
    get: function () {
      return fnReject;
    },
    enumerable: true
  });

  //endregion

  //region Methods

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

  /**
   * Sets the state setting functions of the promise when
   * extension manager calls a custom data portal method.
   *
   * @param {function} fulfill - The fulfill argument of the promise factory.
   * @param {function} reject - The reject argument of the promise factory.
   */
  this.setPromise = function( fulfill, reject ) {
    fnFulfill = typeof fulfill === 'function' ? fulfill : null;
    fnReject = typeof reject === 'function' ? reject : null;
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
    propertyName = Argument.inMethod(CLASS_NAME, 'getValue')
        .check(propertyName).forMandatory('propertyName').asString();
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
   * @throws {@link bo.shared.ModelError Model error}: Cannot write the properties of a collection.
   */
  this.setValue = function (propertyName, value) {
    propertyName = Argument.inMethod(CLASS_NAME, 'setValue')
        .check(propertyName).forMandatory('propertyName').asString();
    if (setValue) {
      if (value !== undefined) {
        setValue(getByName(propertyName), value);
      }
    } else
      throw new ModelError('writeCollection', properties.name, propertyName);
  };

  //endregion

  // Immutable object.
  Object.freeze(this);
}

module.exports = DataPortalContext;
