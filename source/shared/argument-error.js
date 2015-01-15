'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('ArgumentError');

/**
 * Creates an argument error object.
 *
 * @memberof bo.shared
 * @constructor
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 *
 * @classdesc Represents an argument error.
 * @extends {Error}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error} for further information.
 */
function ArgumentError() {
  ArgumentError.super_.call(this);

  /**
   * The name of the error type.
   * @type {string}
   * @default
   */
  this.name = 'ArgumentError';

  /**
   * Human-readable description of the error.
   * @type {string}
   */
  this.message = t.apply(this, arguments);
}
util.inherits(ArgumentError, Error);

module.exports = ArgumentError;
