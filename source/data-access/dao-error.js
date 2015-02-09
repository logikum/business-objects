'use strict';

var CLASS_NAME = 'DaoError';

var util = require('util');
var t = require('../locales/i18n-bo.js')(CLASS_NAME);

/**
 * @classdesc Represents a data access error.
 * @description Creates a data access error object.
 *
 * @memberof bo.dataAccess
 * @constructor
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 *
 * @extends {Error}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error} for further information.
 */
function DaoError () {
  Error.call(this);

  /**
   * The name of the error type.
   * @type {string}
   * @default DaoError
   */
  this.name = this.constructor.name;

  /**
   * Human-readable description of the error.
   * @type {string}
   */
  this.message = t.apply(this, arguments);
}
util.inherits(DaoError, Error);

module.exports = DaoError;
