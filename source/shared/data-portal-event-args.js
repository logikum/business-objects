'use strict';

var config = require('./configuration-reader.js');
var EnsureArgument = require('./ensure-argument.js');
var DataPortalAction = require('./data-portal-action.js');
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
 * @param {string} modelName - The name of the business object model.
 * @param {bo.shared.DataPortalAction} action - The type of the data portal operation.
 * @param {string} [methodName] - The name of the data access object method called.
 * @param {bo.shared.DataPortalError} error - The eventual error occurred in data portal action.
 *
 * @throws {@link bo.shared.ArgumentError Argument error}: The model name must be a non-empty string.
 * @throws {@link bo.shared.ArgumentError Argument error}: The action must be an DataPortalAction item.
 * @throws {@link bo.shared.ArgumentError Argument error}: The method name must be a string value.
 * @throws {@link bo.shared.ArgumentError Argument error}: The error must be a DataPortalError object.
 */
function DataPortalEventArgs (modelName, action, methodName, error) {

  /**
   * The name of the business object model.
   * @type {string}
   * @readonly
   */
  this.modelName = EnsureArgument.isMandatoryString(modelName,
      'c_manString', 'DataPortalEventArgs', 'modelName');
  /**
   * The type of the data portal operation.
   * @type {bo.shared.DataPortalAction}
   * @readonly
   */
  this.action = EnsureArgument.isEnumMember(action, DataPortalAction, null,
      'c_enumType', 'DataPortalEventArgs', 'action');
  /**
   * The name of the data access object method called.
   * @type {string}
   * @readonly
   */
  this.methodName = methodName || DataPortalAction.getName(action);
  /**
   * The error occurred in data portal action, otherwise null.
   * @type {bo.shared.DataPortalError}
   * @readonly
   */
  this.error = EnsureArgument.isOptionalType(error, DataPortalError,
      'c_optType', 'DataPortalEventArgs', 'error');

  /**
   * The current user.
   * @type {bo.shared.UserInfo}
   * @readonly
   */
  this.user = config.getUser();
  /**
   * The current locale.
   * @type {string}
   * @readonly
   */
  this.locale = config.getLocale();

  // Immutable object.
  Object.freeze(this);
}

module.exports = DataPortalEventArgs;
