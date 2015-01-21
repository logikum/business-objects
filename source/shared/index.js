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
var DataContext = require('./data-context.js');
var TransferContext = require('./transfer-context.js');

//var configHelper = require('./config-helper.js');
var configuration = require('./config-reader.js');
var ensureArgument = require('./ensure-argument.js');
var Enumeration = require('./enumeration.js');
var PropertyFlag = require('./property-flag.js');

var ArgumentError = require('./argument-error.js');
var ConfigurationError = require('./configuration-error.js');
var DataPortalError = require('./data-portal-error.js');
var EnumerationError = require('./enumeration-error.js');
var ModelError = require('./model-error.js');
var NotImplementedError = require('./not-implemented-error.js');

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
 * @property {function} DataContext - {@link bo.shared.DataContext Data context}
 *      constructor to create new context object for custom data portal functions.
 * @property {function} TransferContext - {@link bo.shared.TransferContext Transfer context}
 *      constructor to create new context object for custom client and data transfer functions.
 *
 * @property {object} configuration - {@link bo.shared.configuration Configuration}
 *      namespace provides configuration of business objects.
 * @property {object} ensureArgument - {@link bo.shared.ensureArgument Argument verification}
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
 * @property {function} EnumerationError - {@link bo.shared.EnumerationError Enumeration error}
 *      constructor to create a new error related to an enumeration.
 * @property {function} ModelError - {@link bo.shared.ModelError Model error}
 *      constructor to create a new error related to a model.
 * @property {function} NotImplementedError - {@link bo.shared.NotImplementedError Not implemented error}
 *      constructor to create a new error related to a not implemented function.
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
  DataContext: DataContext,
  TransferContext: TransferContext,

  //configHelper: configHelper,
  configuration: configuration,
  ensureArgument: ensureArgument,
  Enumeration: Enumeration,
  PropertyFlag: PropertyFlag,

  ArgumentError: ArgumentError,
  ConfigurationError: ConfigurationError,
  DataPortalError: DataPortalError,
  EnumerationError: EnumerationError,
  ModelError: ModelError,
  NotImplementedError: NotImplementedError
};

// Immutable object.
Object.freeze(index);

module.exports = index;
