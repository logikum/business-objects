'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('ModelError');

/**
 * Creates a model error object.
 *
 * @memberof bo.shared
 * @constructor
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 *
 * @classdesc Represents a model error.
 * @extends {Error}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error} for further information.
 */
function ModelError(message) {
  ModelError.super_.call(this);

  /**
   * The name of the error type.
   * @type {string}
   * @default
   */
  this.name = 'ModelError';

  /**
   * Human-readable description of the error.
   * @type {string}
   */
  this.message = t.apply(this, message ? arguments : ['default']);
}
util.inherits(ModelError, Error);

module.exports = ModelError;
