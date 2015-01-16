'use strict';

var PropertyInfo = require('./property-info.js');
var PropertyManager = require('./property-manager.js');
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
var EnumerationError = require('./enumeration-error.js');
var ModelError = require('./model-error.js');
var NotImplementedError = require('./not-implemented-error.js');

/**
 * Contains components used by models, collections and other components.
 *
 * @namespace bo.shared
 *
 * @property {function} PropertyInfo - {@link bo.shared.PropertyInfo PropertyInfo} constructor
 *      to create new property definition.
 * @property {function} PropertyManager - {@link bo.shared.PropertyManager PropertyManager} constructor
 *      to create a new property manager.
 * @property {function} DataStore - {@link bo.shared.DataStore DataStore} constructor
 *      to create new data store.
 *
 * @property {function} UserInfo - {@link bo.shared.UserInfo UserInfo} constructor
 *      to create new base object for user information.
 * @property {function} DataContext - {@link bo.shared.DataContext DataContext} constructor
 *      to create new context object for custom data transfer objects.
 * @property {function} TransferContext - {@link bo.shared.TransferContext TransferContext} constructor
 *      to create new context object for custom client transfer objects.
 *
 * @property {function} Enumeration - {@link bo.shared.Enumeration Enumeration} constructor
 *      to create new enumeration.
 * @property {function} PropertyFlag - {@link bo.shared.PropertyFlag PropertyFlag} constructor
 *      to create new flag set for a property definition.
 *
 * @property {function} ArgumentError - {@link bo.shared.ArgumentError Argument error} constructor
 *      to create a new error related to an argument.
 * @property {function} ConfigurationError - {@link bo.shared.ConfigurationError Configuration error} constructor
 *      to create a new error related to configuration.
 * @property {function} EnumerationError - {@link bo.shared.EnumerationError Enumeration error} constructor
 *      to create a new error related to an enumeration.
 * @property {function} ModelError - {@link bo.shared.ModelError Model error} constructor
 *      to create a new error related to a model.
 * @property {function} NotImplementedError - {@link bo.shared.NotImplementedError Not implemented error} constructor
 *      to create a new error related to a not implemented function.
 */
var index = {
  PropertyInfo: PropertyInfo,
  PropertyManager: PropertyManager,
  DataStore: DataStore,
  //ExtensionManagerBase: ExtensionManagerBase,
  /**
   * Extensions of an asynchronous model.
   * @memberof bo/shared
   * @see {@link module:shared/extension-manager} for further information.
   */
  ExtensionManager: ExtensionManager,
  /**
   * Extensions of a synchronous model.
   * @memberof bo/shared
   * @see {@link module:shared/extension-manager-sync} for further information.
   */
  ExtensionManagerSync: ExtensionManagerSync,

  //ModelState: ModelState,
  UserInfo: UserInfo,
  DataContext: DataContext,
  TransferContext: TransferContext,

  //configHelper: configHelper,
  /**
   * Default configuration of business objects.
   * @memberof bo/shared
   * @see {@link module:shared/config-reader} for further information.
   */
  configuration: configuration,
  /**
   * Argument checker utility.
   * @memberof bo/shared
   * @see {@link module:shared/ensure-argument} for further information.
   */
  ensureArgument: ensureArgument,
  Enumeration: Enumeration,
  PropertyFlag: PropertyFlag,

  ArgumentError: ArgumentError,
  ConfigurationError: ConfigurationError,
  EnumerationError: EnumerationError,
  ModelError: ModelError,
  NotImplementedError: NotImplementedError
};

// Immutable object.
Object.freeze(index);

module.exports = index;
