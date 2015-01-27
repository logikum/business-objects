'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('NotImplementedError');

/**
 * @classdesc Represents an error of not implemented function.
 * @description Creates a not implemented error object.
 *
 * @memberof bo.shared
 * @constructor
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 *
 * @extends {Error}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error} for further information.
 */
function NotImplementedError() {
  Error.call(this);

  /**
   * The name of the error type.
   * @type {string}
   * @default NotImplementedError
   */
  this.name = this.constructor.name;

  /**
   * Human-readable description of the error.
   * @type {string}
   */
  this.message = t.apply(this, arguments);
}
util.inherits(NotImplementedError, Error);

module.exports = NotImplementedError;
