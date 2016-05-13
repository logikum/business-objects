'use strict';

const t = require( '../locales/i18n-bo.js' )( 'ModelError' );

/**
 * Represents a model error.
 *
 * @memberof bo.shared
 * @extends {Error}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error Error} for further information.
 */
class ModelError extends Error {

  /**
   * Creates a model error object.
   *
   * @param {string} [message] - Human-readable description of the error.
   * @param {...*} [params] - Optional interpolation parameters of the message.
   */
  constructor( message, ...params ) {
    super();

    /**
     * The name of the error type.
     * @member {string} bo.shared.ModelError#name
     * @default ModelError
     */
    this.name = this.constructor.name;

    /**
     * Human-readable description of the error.
     * @member {string} bo.shared.ModelError#message
     */
    this.message = t( ...arguments );
  }
}

module.exports = ModelError;
