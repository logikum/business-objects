'use strict';

//region Imports

const ExtensionManager = require( './extension-manager.js' );
const EventHandlerList = require( './event-handler-list.js' );
const DataStore = require( './data-store.js' );
const ModelState = require( './model-state.js' );
const ModelError = require( './model-error.js' );

const PropertyInfo = require( './property-info.js' );
const PropertyFlag = require( './property-flag.js' );
const PropertyManager = require( './property-manager.js' );
const PropertyContext = require( './property-context.js' );
const ClientTransferContext = require( './client-transfer-context.js' );
const DataTransferContext = require( './data-transfer-context.js' );

const DataPortalAction = require( './data-portal-action.js' );
const DataPortalContext = require( './data-portal-context.js' );
const DataPortalEvent = require( './data-portal-event.js' );
const DataPortalEventArgs = require( './data-portal-event-args.js' );
const DataPortalError = require( './data-portal-error.js' );

//endregion

/**
 * Contains components used by models, collections and other components.
 *
 * @namespace bo.common
 *
 * @property {function} ExtensionManager - {@link bo.common.ExtensionManager Extension manager}
 *      constructor to create new a new extension manager object.
 * @property {function} EventHandlerList - {@link bo.common.EventHandlerList Event handler list}
 *      constructor to create a new event handler collection.
 * @property {function} DataStore - {@link bo.common.DataStore DataStore}
 *      constructor to create new data store.
 * @property {object} ModelState - {@link bo.rules.ModelState Model state}
 *      object specifies the possible states of the editable models.
 * @property {function} ModelError - {@link bo.common.ModelError Model error}
 *      constructor to create a new error related to a model.
 *
 * @property {function} PropertyInfo - {@link bo.common.PropertyInfo Property definition}
 *      constructor to create new property definition.
 * @property {function} PropertyFlag - {@link bo.common.PropertyFlag Property flag}
 *      constructor to create new flag set for a property definition.
 * @property {function} PropertyManager - {@link bo.common.PropertyManager Property manager}
 *      constructor to create a new property manager.
 * @property {function} PropertyContext - {@link bo.common.PropertyContext Property context}
 *      constructor to create new context object for custom property functions.
 * @property {function} ClientTransferContext - {@link bo.common.ClientTransferContext Client transfer context}
 *      constructor to create new context object for custom client transfer functions.
 * @property {function} DataTransferContext - {@link bo.common.DataTransferContext Data transfer context}
 *      constructor to create new context object for custom data transfer functions.
 *
 * @property {function} DataPortalAction - {@link bo.common.DataPortalAction Data portal action}
 *      enumeration specifies the model operations to execute on data access objects.
 * @property {function} DataPortalContext - {@link bo.common.DataPortalContext Data portal context}
 *      constructor to create new context object for custom data portal functions.
 * @property {function} DataPortalEvent - {@link bo.common.DataPortalEvent Data portal event}
 *      enumeration specifies the events of data portal operations.
 * @property {function} DataPortalEventArgs - {@link bo.common.DataPortalEventArgs Data portal event arguments}
 *      constructor to create new context object for data portal events.
 * @property {function} DataPortalError - {@link bo.common.DataPortalError Data portal error}
 *      constructor to create a new error related to data portal actions.
 *
 *
 */
const index = {
  ExtensionManager: ExtensionManager,
  EventHandlerList: EventHandlerList,
  DataStore: DataStore,
  ModelState: ModelState,
  ModelError: ModelError,

  PropertyInfo: PropertyInfo,
  PropertyFlag: PropertyFlag,
  PropertyManager: PropertyManager,
  PropertyContext: PropertyContext,
  ClientTransferContext: ClientTransferContext,
  DataTransferContext: DataTransferContext,

  DataPortalAction: DataPortalAction,
  DataPortalContext: DataPortalContext,
  DataPortalEvent: DataPortalEvent,
  DataPortalEventArgs: DataPortalEventArgs,
  DataPortalError: DataPortalError
};

// Immutable object.
Object.freeze( index );

module.exports = index;
