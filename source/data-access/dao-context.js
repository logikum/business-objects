'use strict';

var Argument = require('../system/argument-check.js');

var CLASS_NAME = 'DaoContext';

/**
 * @classdesc
 *    Provides the context for the methods of data access objects.
 * @description
 *    Creates a new context object for a data access object.
 *      </br></br>
 *    <i><b>Warning:</b> Data access context objects are created in models internally.
 *    They are intended only to make publicly available the context
 *    for data access actions.</i>
 *
 * @memberof bo.dataAccess
 * @constructor
 * @param {function} fulfill - The success handler of the promise executor.
 * @param {function} reject - The failure handler of the promise executor.
 * @param {object} connection - The connection to the data source.
 */
function DaoContext( fulfill, reject, connection ) {
  var check = Argument.inConstructor( CLASS_NAME );

  /**
   * The success handler of the promise executor.
   * @type {function}
   * @readonly
   */
  this.fulfill = check( fulfill ).forMandatory( 'fulfill' ).asFunction();

  /**
   * The failure handler of the promise executor.
   * @type {function}
   * @readonly
   */
  this.reject = check( reject ).forMandatory( 'reject' ).asFunction();

  /**
   * The connection to the data source.
   * @type {object}
   * @readonly
   */
  this.connection = check( connection ).forOptional( 'connection' ).asObject();

  // Immutable object.
  Object.freeze(this);
}

module.exports = DaoContext;
