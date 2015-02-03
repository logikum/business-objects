'use strict';

var PropertyInfo = require('./property-info.js');
var PropertyManager = require('./property-manager.js');
var PropertyContext = require('./property-context.js');
var DataStore = require('./data-store.js');
//var ExtensionManagerBase = require('./extension-manager-base.js');
var ExtensionManager = require('./extension-manager.js');
var ExtensionManagerSync = require('./extension-manager-sync.js');

//var ModelState = require('./model-state.js');
var UserInfo = require('./user-info.js');
var DataPortalAction = require('./data-portal-action.js');
var DataPortalContext = require('./data-portal-context.js');
var DataPortalEvent = require('./data-portal-event.js');
var DataPortalEventArgs = require('./data-portal-event-args.js');
var TransferContext = require('./transfer-context.js');

var configuration = require('./configuration-reader.js');
var EnsureArgument = require('./ensure-argument.js');
var Enumeration = require('./enumeration.js');
var PropertyFlag = require('./property-flag.js');

var ArgumentError = require('./argument-error.js');
var ConfigurationError = require('./configuration-error.js');
var DataPortalError = require('./data-portal-error.js');
var ModelError = require('./model-error.js');

/**
 * Contains components used by models, collections and other components.
 *
 * @namespace bo.shared
 *
 * @property {function} PropertyInfo - {@link bo.shared.PropertyInfo Property definition}
 *      constructor to create new property definition.
 * @property {function} PropertyManager - {@link bo.shared.PropertyManager Property manager}
 *      constructor to create a new property manager.
 * @property {function} PropertyContext - {@link bo.shared.PropertyContext Property context}
 *      constructor to create new context object for custom property functions.
 * @property {function} DataStore - {@link bo.shared.DataStore DataStore}
 *      constructor to create new data store.
 * @property {function} ExtensionManager - {@link bo.shared.ExtensionManager Extension manager}
 *      constructor to create new a new extension manager object for an asynchronous model.
 * @property {function} ExtensionManagerSync - {@link bo.shared.ExtensionManagerSync Extension manager}
 *      constructor to create new a new extension manager object for a synchronous model.
 *
 * @property {function} UserInfo - {@link bo.shared.UserInfo User data}
 *      constructor to create new base object for user information.
 * @property {function} DataPortalAction - {@link bo.shared.DataPortalAction Data portal action}
 *      enumeration specifies the model operations to execute on data access objects.
 * @property {function} DataPortalContext - {@link bo.shared.DataPortalContext Data portal context}
 *      constructor to create new context object for custom data portal functions.
 * @property {function} DataPortalEvent - {@link bo.shared.DataPortalEvent Data portal event}
 *      enumeration specifies the events of data portal operations.
 * @property {function} DataPortalEventArgs - {@link bo.shared.DataPortalEventArgs Data portal event arguments}
 *      constructor to create new context object for data portal events.
 * @property {function} TransferContext - {@link bo.shared.TransferContext Transfer context}
 *      constructor to create new context object for custom client and data transfer functions.
 *
 * @property {object} EnsureArgument - {@link bo.shared.EnsureArgument Argument verification}
 *      namespace provides methods to check arguments.
 * @property {function} Enumeration - {@link bo.shared.Enumeration Enumeration}
 *      constructor to create new enumeration.
 * @property {function} PropertyFlag - {@link bo.shared.PropertyFlag Property flag}
 *      constructor to create new flag set for a property definition.
 *
 * @property {function} ArgumentError - {@link bo.shared.ArgumentError Argument error}
 *      constructor to create a new error related to an argument.
 * @property {function} ConfigurationError - {@link bo.shared.ConfigurationError Configuration error}
 *      constructor to create a new error related to configuration.
 * @property {function} DataPortalError - {@link bo.shared.DataPortalError Data portal error}
 *      constructor to create a new error related to data portal actions.
 * @property {function} ModelError - {@link bo.shared.ModelError Model error}
 *      constructor to create a new error related to a model.
 */
var index = {
  PropertyInfo: PropertyInfo,
  PropertyManager: PropertyManager,
  PropertyContext: PropertyContext,
  DataStore: DataStore,
  //ExtensionManagerBase: ExtensionManagerBase,
  ExtensionManager: ExtensionManager,
  ExtensionManagerSync: ExtensionManagerSync,

  //ModelState: ModelState,
  UserInfo: UserInfo,
  DataPortalAction: DataPortalAction,
  DataPortalContext: DataPortalContext,
  DataPortalEvent: DataPortalEvent,
  DataPortalEventArgs: DataPortalEventArgs,
  TransferContext: TransferContext,

  /**
   * Returns the configuration of business objects.
   * @function bo.shared.getConfiguration
   * @returns {bo.configuration} The configuration of business objects.
   */
  getConfiguration: function () { return configuration; },
  EnsureArgument: EnsureArgument,
  Enumeration: Enumeration,
  PropertyFlag: PropertyFlag,

  ArgumentError: ArgumentError,
  ConfigurationError: ConfigurationError,
  DataPortalError: DataPortalError,
  ModelError: ModelError
};

// Immutable object.
Object.freeze(index);

module.exports = index;
