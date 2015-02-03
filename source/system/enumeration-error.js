'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('EnumerationError');

/**
 * @classdesc Represents an enumeration error.
 * @description Creates an enumeration error object.
 *
 * @memberof bo.system
 * @constructor
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 *
 * @extends {Error}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error} for further information.
 */
function EnumerationError() {
  Error.call(this);

  /**
   * The name of the error type.
   * @type {string}
   * @default EnumerationError
   */
  this.name = this.constructor.name;

  /**
   * Human-readable description of the error.
   * @type {string}
   */
  this.message = t.apply(this, arguments);
}
util.inherits(EnumerationError, Error);

module.exports = EnumerationError;
