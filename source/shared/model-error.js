'use strict';

var CLASS_NAME = 'ModelError';

var util = require('util');
var t = require('../locales/i18n-bo.js')(CLASS_NAME);

/**
 * @classdesc Represents a model error.
 * @description Creates a model error object.
 *
 * @memberof bo.shared
 * @constructor
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 *
 * @extends {Error}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error} for further information.
 */
function ModelError (message) {
  Error.call(this);

  /**
   * The name of the error type.
   * @type {string}
   * @default ModelError
   */
  this.name = this.constructor.name;

  /**
   * Human-readable description of the error.
   * @type {string}
   */
  this.message = t.apply(this, message ? arguments : ['default']);
}
util.inherits(ModelError, Error);

module.exports = ModelError;