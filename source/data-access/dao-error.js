/**
 * Data access error module.
 * @module data-access/dao-error
 */
'use strict';

var util = require('util');
var t = require('../locales/i18n-bo.js')('DaoError');

/**
 * Creates a data access error object.
 *
 * @memberof bo.dataAccess
 * @constructor
 * @param {string} [message] - Human-readable description of the error.
 * @param {...*} [messageParams] - Optional interpolation parameters of the message.
 *
 * @classdesc Represents a data access error.
 * @extends {Error}
 */
function DaoError() {
  DaoError.super_.call(this);

  /**
   * The name of the error type.
   * @type {string}
   */
  this.name = 'DaoError';

  /**
   * Human-readable description of the error.
   * @type {string}
   */
  this.message = t.apply(this, arguments);
}
util.inherits(DaoError, Error);

module.exports = DaoError;
