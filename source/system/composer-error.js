'use strict';

var CLASS_NAME = 'ComposerError';

var util = require('util');
var t = require('../locales/i18n-bo.js')(CLASS_NAME);

/**
 * @classdesc Represents an argument error.
 * @description Creates an argument error object.
 *
 * @memberof bo.system
 * @constructor
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 *
 * @extends {Error}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error} for further information.
 */
function ComposerError () {
  Error.call(this);

  /**
   * The name of the error type.
   * @type {string}
   * @default ComposerError
   */
  this.name = this.constructor.name;

  /**
   * Human-readable description of the error.
   * @type {string}
   */
  this.message = t.apply(this, arguments);

  /**
   * The name of the model that contains the definition error.
   * @type {string}
   */
  this.model = '';

  /**
   * The name of the model type of the model that contains the definition error.
   * @type {string}
   */
  this.modelType = '';

  /**
   * The name of the method of the model composer that found the definition error.
   * @type {string}
   */
  this.method = '';
}
util.inherits(ComposerError, Error);

module.exports = ComposerError;
