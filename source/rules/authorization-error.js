'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('AuthorizationError');

/**
 * @classdesc Represents an authorization error.
 * @description Creates an authorization error object.
 *
 * @memberof bo.rules
 * @constructor
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 *
 * @extends {Error}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error} for further information.
 */
function AuthorizationError() {
  AuthorizationError.super_.call(this);

  /**
   * The name of the error type.
   * @type {string}
   * @default
   */
  this.name = 'AuthorizationError';

  /**
   * Human-readable description of the error.
   * @type {string}
   */
  this.message = t.apply(this, arguments);
}
util.inherits(AuthorizationError, Error);

module.exports = AuthorizationError;
