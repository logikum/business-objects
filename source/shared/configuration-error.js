'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('ConfigurationError');

/**
 * @classdesc Represents a configuration error.
 * @description Creates a configuration error object.
 *
 * @memberof bo.shared
 * @constructor
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 *
 * @extends {Error}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error} for further information.
 */
function ConfigurationError() {
  ConfigurationError.super_.call(this);

  /**
   * The name of the error type.
   * @type {string}
   * @default
   */
  this.name = 'ConfigurationError';

  /**
   * Human-readable description of the error.
   * @type {string}
   */
  this.message = t.apply(this, arguments);
}
util.inherits(ConfigurationError, Error);

module.exports = ConfigurationError;
