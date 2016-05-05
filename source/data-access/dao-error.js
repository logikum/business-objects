'use strict';

var CLASS_NAME = 'DaoError';

var t = require( '../locales/i18n-bo.js' )( CLASS_NAME );

/**
 * Represents a data access error.
 *
 * @memberof bo.dataAccess
 * @extends {Error}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error} for further information.
 */
class DaoError extends Error {
  /**
   * Creates a data access error object.
   *
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [params] - Optional interpolation parameters of the message.
   */
  constructor( message, ...params ) {
    super( message );

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
    this.message = t.apply( this, arguments );
  }
}

module.exports = DaoError;
