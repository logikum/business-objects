'use strict';

var CLASS_NAME = 'DataPortalEventArgs';

var config = require('./configuration-reader.js');
var Argument = require('../system/argument-check.js');
var DataPortalAction = require('./data-portal-action.js');
var DataPortalEvent = require('./data-portal-event.js');
var DataPortalError = require('./data-portal-error.js');

/**
 * @classdesc
 *    Provides the context for data portal events.
 * @description
 *    Creates new data portal event arguments.
 *      </br></br>
 *    <i><b>Warning:</b> Data portal event arguments are created in models internally.
 *    They are intended only to make publicly available the context for data portal events.</i>
 *
 * @memberof bo.shared
 * @constructor
 * @param {bo.shared.DataPortalEvent} event - The data portal event.
 * @param {string} modelName - The name of the business object model.
 * @param {bo.shared.DataPortalAction} [action] - The type of the data portal operation.
 * @param {string} [methodName] - The name of the data access object method called.
 * @param {bo.shared.DataPortalError} [error] - The eventual error occurred in data portal action.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The event must be a DataPortalEvent item.
 * @throws {@link bo.system.ArgumentError Argument error}: The model name must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The action must be a DataPortalAction item.
 * @throws {@link bo.system.ArgumentError Argument error}: The method name must be a string value.
 * @throws {@link bo.system.ArgumentError Argument error}: The error must be a DataPortalError object.
 */
function DataPortalEventArgs (event, modelName, action, methodName, error) {
  var check = Argument.inConstructor(CLASS_NAME);

  event = check(event).for('event').asEnumMember(DataPortalEvent, null);

  /**
   * The name of the data portal event.
   * @type {string}
   * @readonly
   */
  this.eventName = DataPortalEvent.getName(event);
  /**
   * The name of the business object model.
   * @type {string}
   * @readonly
   */
  this.modelName = check(modelName).forMandatory('modelName').asString();
  /**
   * The type of the data portal operation.
   * @type {bo.shared.DataPortalAction}
   * @readonly
   */
  this.action = check(action).for('action').asEnumMember(DataPortalAction, eventToAction(event));
  /**
   * The name of the data access object method called.
   * @type {string}
   * @readonly
   */
  this.methodName = methodName || DataPortalAction.getName(this.action);
  /**
   * The error occurred in data portal action, otherwise null.
   * @type {bo.shared.DataPortalError}
   * @readonly
   */
  this.error = check(error).forOptional('error').asType(DataPortalError);

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

  function eventToAction (event) {
    switch (event) {
      case DataPortalEvent.preFetch:
      case DataPortalEvent.postFetch:
        return DataPortalAction.fetch;
      case DataPortalEvent.preCreate:
      case DataPortalEvent.postCreate:
        return DataPortalAction.create;
      case DataPortalEvent.preInsert:
      case DataPortalEvent.postInsert:
        return DataPortalAction.insert;
      case DataPortalEvent.preUpdate:
      case DataPortalEvent.postUpdate:
        return DataPortalAction.update;
      case DataPortalEvent.preRemove:
      case DataPortalEvent.postRemove:
        return DataPortalAction.remove;
      case DataPortalEvent.preExecute:
      case DataPortalEvent.postExecute:
        return DataPortalAction.execute;
      case DataPortalEvent.preSave:
      case DataPortalEvent.postSave:
      default:
        return null;
    }
  }

  // Immutable object.
  Object.freeze(this);
}

module.exports = DataPortalEventArgs;
