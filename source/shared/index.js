/*
 * Shared components' index module.
 */
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
 * List of shared components.
 *
 * @namespace bo/shared
 */
var index = {
  /**
   * Property definition for models.
   * @memberof bo/shared
   * @see {@link module:shared/property-info} for further information.
   */
  PropertyInfo: PropertyInfo,
  /**
   * Collection of property definitions of a model.
   * @memberof bo/shared
   * @see {@link module:shared/property-manager} for further information.
   */
  PropertyManager: PropertyManager,
  /**
   * Collection of property values of a model.
   * @memberof bo/shared
   * @see {@link module:shared/property-manager} for further information.
   */
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
  /**
   * Base object for user information.
   * @memberof bo/shared
   * @see {@link module:shared/user-info} for further information.
   */
  UserInfo: UserInfo,
  /**
   * Context information for data transfer objects.
   * @memberof bo/shared
   * @see {@link module:shared/data-context} for further information.
   */
  DataContext: DataContext,
  /**
   * Context information for client transfer objects.
   * @memberof bo/shared
   * @see {@link module:shared/transfer-context} for further information.
   */
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
  /**
   * Base object for enumerations.
   * @memberof bo/shared
   * @see {@link module:shared/enumeration} for further information.
   */
  Enumeration: Enumeration,
  /**
   * Flag set for property definitions.
   * @memberof bo/shared
   * @see {@link module:shared/property-flag} for further information.
   */
  PropertyFlag: PropertyFlag,


  /**
   * Error object for argument checks.
   * @memberof bo/shared
   * @see {@link module:shared/argument-error} for further information.
   */
  ArgumentError: ArgumentError,
  /**
   * Error object for configuration.
   * @memberof bo/shared
   * @see {@link module:shared/configuration-error} for further information.
   */
  ConfigurationError: ConfigurationError,
  /**
   * Error object for enumerations.
   * @memberof bo/shared
   * @see {@link module:shared/enumeration-error} for further information.
   */
  EnumerationError: EnumerationError,
  /**
   * Error object for models.
   * @memberof bo/shared
   * @see {@link module:shared/model-error} for further information.
   */
  ModelError: ModelError,
  /**
   * Error object for not implemented functions.
   * @memberof bo/shared
   * @see {@link module:shared/not-implemented-error} for further information.
   */
  NotImplementedError: NotImplementedError
};

// Immutable object.
Object.freeze(index);

module.exports = index;
