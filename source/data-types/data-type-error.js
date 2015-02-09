'use strict';

var CLASS_NAME = 'DataTypeError';

var util = require('util');
var t = require('../locales/i18n-bo.js')(CLASS_NAME);

/**
 * @classdesc Represents a data type error.
 * @description Creates a data type error object.
 *
 * @memberof bo.dataTypes
 * @constructor
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 *
 * @extends {Error}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error} for further information.
 */
function DataTypeError () {
  Error.call(this);

  /**
   * The name of the error type.
   * @type {string}
   * @default DataTypeError
   */
  this.name = this.constructor.name;

  /**
   * Human-readable description of the error.
   * @type {string}
   */
  this.message = t.apply(this, arguments);
}
util.inherits(DataTypeError, Error);

module.exports = DataTypeError;
