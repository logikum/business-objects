'use strict';

var util = require('util');
var EnsureArgument = require('./../system/ensure-argument.js');
var DataPortalAction = require('./data-portal-action.js');
var t = require('../locales/i18n-bo.js')('DataPortalError');

/**
 * @classdesc Represents a data portal error error.
 * @description Creates a data portal error object.
 *
 * @memberof bo.shared
 * @constructor
 * @param {string} modeltype - The type of the model the error occurred in.
 * @param {string} modelName - The name of the model the error occurred in.
 * @param {bo.shared.DataPortalAction} action - The data portal action the error occurred in.
 * @param {error} interceptedError - The error to be wrapped.
 *
 * @extends {Error}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error} for further information.
 *
 * @throws {@link bo.system.ArgumentError Argument error}: The model type must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The model name must be a non-empty string.
 * @throws {@link bo.system.ArgumentError Argument error}: The action must be a DataPortalAction object.
 */
function DataPortalError(modeltype, modelName, action, interceptedError) {
  Error.call(this);

  /**
   * The name of the error type.
   * @type {string}
   * @default DataPortalError
   */
  this.name = this.constructor.name;

  /**
   * The type of the model the intercepted error occurred in.
   * @type {string}
   */
  this.modelType = EnsureArgument.isMandatoryString(modeltype,
      'c_manString', 'DataPortalError', 'modeltype');

  /**
   * The name of the model the intercepted error occurred in.
   * @type {string}
   */
  this.modelName = EnsureArgument.isMandatoryString(modelName,
      'c_manString', 'DataPortalError', 'modelName');

  /**
   * The name of the action executing that the intercepted error occurred in.
   * @type {string}
   */
  this.action = DataPortalAction.getName(
      EnsureArgument.isEnumMember(action, DataPortalAction, null,
        'c_enumMember', 'DataPortalError', 'action')
  );

  /**
   * The intercepted error of the data portal action.
   * @type {error}
   */
  this.innerError = interceptedError;

  /**
   * Human-readable description of the error.
   * @type {string}
   */
  this.message = t.call(this, this.action, modelName);
}
util.inherits(DataPortalError, Error);

module.exports = DataPortalError;
