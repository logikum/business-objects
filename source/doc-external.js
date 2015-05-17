/**
 * External is a virtual namespace to describe types to implement
 * in external objects to be used by business objects.
 *
 * @namespace external
 */
var external = {

  //region Configuration

  /**
   * The configuration file of business objects. It can be a JSON file (.json) or
   * a JavaScript file (.js) that returns an object with the following properties:
   *
   * @typedef external.configurationFile
   * @type {object}
   * @property {string} connectionManager -
   *    The relative path of the connection manager constructor.
   *    The created object must inherit {@link bo.dataAccess.ConnectionManagerBase}.
   * @property {string} [daoBuilder] -
   *    The relative path of the factory {@link external.daoBuilder method} to create data access objects.
   *    The default builder method is {@link bo.dataAccess.daoBuilder}.
   * @property {string} [getUser] -
   *    The relative path of the {@link external.getUser method} that returns the current user.
   * @property {string} [getLocale] -
   *    The relative path of the {@link external.getLocale method} that returns the current locale.
   * @property {string} [pathOfLocales] -
   *    The relative path of the directory containing project locales.
   * @property {(number|string)} [noAccessBehavior] -
   *    The default behavior for unauthorized operations. Valid values are:
   *
   *    * 0 or 'throwError', the default value
   *    * 1 or 'showError'
   *    * 2 or 'showWarning'
   *    * 3 or 'showInformation'
   */

  /**
   * Returns the current user.
   *
   * @typedef external.getUser
   * @type {function}
   * @returns {bo.system.UserInfo} The current user or null.
   */

  /**
   * Returns the current locale.
   *
   * @typedef external.getLocale
   * @type {function}
   * @returns {string} The current locale or an empty string.
   */

  /**
   * Factory method to create the data access object for a model instance.
   *
   * @typedef external.daoBuilder
   * @type {function}
   * @param {string} dataSource - The name of the data source.
   * @param {string} modelPath - The model definition path of the business
   *      object model instance that the data access object belongs to.
   * @param {string} modelName - The name of the business object model.
   * @returns {bo.dataAccess.DaoBase} The data access object.
   */

  //endregion

  //region Property functions

  /**
   * Gets the value of a model property.
   *
   * @typedef external.propertyGetter
   * @type {function}
   * @param {bo.shared.PropertyContext} context - The context for custom property functions.
   * @returns {*} The current value of the property.
   */

  /**
   * Sets the value of a model property.
   *
   * @typedef external.propertySetter
   * @type {function}
   * @param {bo.shared.PropertyContext} context - The context for custom property functions.
   * @param {*} value - The new value of the property.
   * @returns {boolean} True if the value of the property has been changed, otherwise false.
   */

  //endregion

  //region Transfer object methods

  /**
   * Transforms the business object instance to a plain object to send to the data access object.
   *
   * @typedef external.toDto
   * @type {function}
   * @this ModelBase
   * @param {bo.shared.TransferContext} context - The context for custom transfer object conversions.
   * @returns {object} The data transfer object.
   */

  /**
   * Rebuilds the business object from a plain object sent by the data access object.
   *
   * @typedef external.fromDto
   * @type {function}
   * @this ModelBase
   * @param {bo.shared.TransferContext} context - The context for custom transfer object conversions.
   * @param {object} dto - The data transfer object.
   */

  /**
   * Transforms the business object instance to a plain object to send to the client.
   *
   * @typedef external.toCto
   * @type {function}
   * @this ModelBase
   * @param {bo.shared.TransferContext} context - The context for custom transfer object conversions.
   * @returns {object} The client transfer object.
   */

  /**
   * Rebuilds the business object from a plain object sent by the client.
   *
   * @typedef external.fromCto
   * @type {function}
   * @this ModelBase
   * @param {bo.shared.TransferContext} context - The context for custom transfer object conversions.
   * @param {object} cto - The client transfer object.
   */

  //endregion

  //region Data portal methods

  /**
   * Initializes the property values of a new business object instance from the data source.
   *
   * @typedef external.dataCreate
   * @type {function}
   * @this ModelBase
   * @param {bo.shared.DataPortalContext} context - The context for custom data portal conversions.
   * @param {function} callback - Callback function to return error (in asynchronous models).
   */

  /**
   * Sets the property values of an existing business object instance from the data source.
   *
   * @typedef external.dataFetch
   * @type {function}
   * @this ModelBase
   * @param {bo.shared.DataPortalContext} context - The context for custom data portal conversions.
   * @param {*} filter - The criteria of the selection.
   * @param {string} method - The name of the selection method, defaults to 'fetch'.
   * @param {function} callback - Callback function to return child values or error (in asynchronous models).
   * @returns {object} Plain object holding child values (in synchronous models).
   */

  /**
   * Saves the property values of a new business object instance into the data source.
   *
   * @typedef external.dataInsert
   * @type {function}
   * @this ModelBase
   * @param {bo.shared.DataPortalContext} context - The context for custom data portal conversions.
   * @param {function} callback - Callback function to return error (in asynchronous models).
   */

  /**
   * Saves the property values of an existing business object instance into the data source.
   *
   * @typedef external.dataUpdate
   * @type {function}
   * @this ModelBase
   * @param {bo.shared.DataPortalContext} context - The context for custom data portal conversions.
   * @param {function} callback - Callback function to return error (in asynchronous models).
   */

  /**
   * Deletes the property values of an existing business object instance from the data source.
   *
   * @typedef external.dataRemove
   * @type {function}
   * @this ModelBase
   * @param {bo.shared.DataPortalContext} context - The context for custom data portal conversions.
   * @param {function} callback - Callback function to return error (in asynchronous models).
   */

  /**
   * Executes a command on the data source.
   *
   * @typedef external.dataExecute
   * @type {function}
   * @this ModelBase
   * @param {bo.shared.DataPortalContext} context - The context for custom data portal conversions.
   * @param {string} method - The name of the execution method, defaults to 'execute'.
   * @param {function} callback - Callback function to return child values or error (in asynchronous models).
   * @returns {object} Plain object holding child values (in synchronous models).
   */

  //endregion

  //region Callback methods

  /**
   * The callback to be called when the execution of a model method has finished.
   *
   * @callback external.cbModel
   * @param {error} err - The error that occurred in the model.
   */

  /**
   * The callback to be called when the execution of a connection manager method has finished.
   *
   * @callback external.cbConnectionManager
   * @param {error} err - The error that occurred in the connection manager.
   * @param {object} connection - The connection for the data source.
   */

  /**
   * The callback to be called when the execution of a method has finished
   * that calls an asynchronous data portal action.
   *
   * @callback external.cbDataPortal
   * @param {(bo.shared.DataPortalError|bo.rules.AuthorizationError)} err - The error that occurred in the data portal action.
   * @param {object} result - The business object instance with the new state.
   */

  /**
   * The callback to be called in collection methods.
   *
   * @callback external.cbCollectionItem
   * @param {{}} currentValue - The current item being processed in the collection.
   * @param {number} index - The index of the current item being processed in the collection.
   * @param {Array.<object>} collection - The collection method was called upon.
   */

  /**
   * The callback to be called to define the sort order in a collection.
   *
   * @callback external.cbCompare
   * @param {object} a - First object to compare.
   * @param {object} b - Second object to compare.
   * @returns {number} Returns
   *
   *    * < 0, when a comes first
   *    * = 0, when a and b are left unchanged
   *    * \> 0, when b comes first
   */

  //endregion
};
