'use strict';

var CLASS_NAME = 'DataPortalError';

var util = require('util');
var Argument = require('../system/argument-check.js');
var DataPortalAction = require('./data-portal-action.js');
var t = require('../locales/i18n-bo.js')(CLASS_NAME);

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
function DataPortalError (modeltype, modelName, action, interceptedError) {
  Error.call(this);
  var check = Argument.inConstructor(CLASS_NAME);

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
  this.modelType = check(modeltype).forMandatory('modeltype').asString();

  /**
   * The name of the model the intercepted error occurred in.
   * @type {string}
   */
  this.modelName = check(modelName).forMandatory('modelName').asString();

  /**
   * The name of the action executing that the intercepted error occurred in.
   * @type {string}
   */
  this.action = DataPortalAction.getName(
      check(action).for('action').asEnumMember(DataPortalAction, null)
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
