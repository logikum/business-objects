'use strict';

var util = require('util');
var ensureArgument = require('./ensure-argument.js');
var t = require('../locales/i18n-bo.js')('DataPortalError');

/**
 * @classdesc Represents a data portal error error.
 * @description Creates a data portal error object.
 *
 * @memberof bo.shared
 * @constructor
 * @param {string} modeltype - The type of the model the error occurred in.
 * @param {string} modelName - The name of the model the error occurred in.
 * @param {string} action - The name of the action the error occurred in.
 * @param {error} interceptedError - The error to be wrapped.
 *
 * @extends {Error}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error} for further information.
 */
function DataPortalError(modeltype, modelName, action, interceptedError) {
  DataPortalError.super_.call(this);

  /**
   * The name of the error type.
   * @type {string}
   * @default
   */
  this.name = 'DataPortalError';

  /**
   * The type of the model the intercepted error occurred in.
   * @type {string}
   */
  this.modelType = ensureArgument.isMandatoryString(modeltype,
      'c_manString', 'DataPortalError', 'modeltype');

  /**
   * The name of the model the intercepted error occurred in.
   * @type {string}
   */
  this.modelName = ensureArgument.isMandatoryString(modelName,
      'c_manString', 'DataPortalError', 'modelName');

  /**
   * The name of the action executing that the intercepted error occurred in.
   * @type {string}
   */
  this.action = ensureArgument.isMandatoryString(action,
      'c_manString', 'DataPortalError', 'action');

  /**
   * The intercepted error of the data portal action.
   * @type {error}
   */
  this.innerError = interceptedError;

  /**
   * Human-readable description of the error.
   * @type {string}
   */
  this.message = t.call(this, action, modelName);
}
util.inherits(DataPortalError, Error);

module.exports = DataPortalError;
