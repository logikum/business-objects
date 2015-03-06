'use strict';


//var ExtensionManagerBase = require('./extension-manager-base.js');
var ExtensionManager = require('./extension-manager.js');
var ExtensionManagerSync = require('./extension-manager-sync.js');
var EventHandlerList = require('./event-handler-list.js');
var DataStore = require('./data-store.js');
var ModelState = require('./model-state.js');
var ModelError = require('./model-error.js');
var ConfigurationError = require('./configuration-error.js');
//var configuration = require('./configuration-reader.js');

var PropertyInfo = require('./property-info.js');
var PropertyFlag = require('./property-flag.js');
var PropertyManager = require('./property-manager.js');
var PropertyContext = require('./property-context.js');
var TransferContext = require('./transfer-context.js');

var DataPortalAction = require('./data-portal-action.js');
var DataPortalContext = require('./data-portal-context.js');
var DataPortalEvent = require('./data-portal-event.js');
var DataPortalEventArgs = require('./data-portal-event-args.js');
var DataPortalError = require('./data-portal-error.js');

/**
 * Contains components used by models, collections and other components.
 *
 * @namespace bo.shared
 *
 * @property {function} ExtensionManager - {@link bo.shared.ExtensionManager Extension manager}
 *      constructor to create new a new extension manager object for an asynchronous model.
 * @property {function} ExtensionManagerSync - {@link bo.shared.ExtensionManagerSync Extension manager}
 *      constructor to create new a new extension manager object for a synchronous model.
 * @property {function} EventHandlerList - {@link bo.shared.EventHandlerList Event handler list}
 *      constructor to create a new event handler collection.
 * @property {function} DataStore - {@link bo.shared.DataStore DataStore}
 *      constructor to create new data store.
 * @property {object} ModelState - {@link bo.rules.ModelState Model state}
 *      object specifies the possible states of the editable models.
 * @property {function} ModelError - {@link bo.shared.ModelError Model error}
 *      constructor to create a new error related to a model.
 * @property {function} ConfigurationError - {@link bo.shared.ConfigurationError Configuration error}
 *      constructor to create a new error related to configuration.
 *
 * @property {function} PropertyInfo - {@link bo.shared.PropertyInfo Property definition}
 *      constructor to create new property definition.
 * @property {function} PropertyFlag - {@link bo.shared.PropertyFlag Property flag}
 *      constructor to create new flag set for a property definition.
 * @property {function} PropertyManager - {@link bo.shared.PropertyManager Property manager}
 *      constructor to create a new property manager.
 * @property {function} PropertyContext - {@link bo.shared.PropertyContext Property context}
 *      constructor to create new context object for custom property functions.
 * @property {function} TransferContext - {@link bo.shared.TransferContext Transfer context}
 *      constructor to create new context object for custom client and data transfer functions.
 *
 * @property {function} DataPortalAction - {@link bo.shared.DataPortalAction Data portal action}
 *      enumeration specifies the model operations to execute on data access objects.
 * @property {function} DataPortalContext - {@link bo.shared.DataPortalContext Data portal context}
 *      constructor to create new context object for custom data portal functions.
 * @property {function} DataPortalEvent - {@link bo.shared.DataPortalEvent Data portal event}
 *      enumeration specifies the events of data portal operations.
 * @property {function} DataPortalEventArgs - {@link bo.shared.DataPortalEventArgs Data portal event arguments}
 *      constructor to create new context object for data portal events.
 * @property {function} DataPortalError - {@link bo.shared.DataPortalError Data portal error}
 *      constructor to create a new error related to data portal actions.
 *
 *
 */
var index = {
  //ExtensionManagerBase: ExtensionManagerBase,
  ExtensionManager: ExtensionManager,
  ExtensionManagerSync: ExtensionManagerSync,
  EventHandlerList: EventHandlerList,
  DataStore: DataStore,
  ModelState: ModelState,
  ModelError: ModelError,
  ConfigurationError: ConfigurationError,
  //configuration: configuration,

  PropertyInfo: PropertyInfo,
  PropertyFlag: PropertyFlag,
  PropertyManager: PropertyManager,
  PropertyContext: PropertyContext,
  TransferContext: TransferContext,

  DataPortalAction: DataPortalAction,
  DataPortalContext: DataPortalContext,
  DataPortalEvent: DataPortalEvent,
  DataPortalEventArgs: DataPortalEventArgs,
  DataPortalError: DataPortalError
};

// Immutable object.
Object.freeze(index);

module.exports = index;
