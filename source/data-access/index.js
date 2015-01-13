/*
 * Data access components' index module.
 */
'use strict';

var DaoBase = require('./dao-base.js');
var daoBuilder = require('./dao-builder.js');
var DaoError = require('./dao-error.js');

/**
 * List of data access components.
 *
 * @namespace bo/data-access
 */
var index = {
  /**
   * Creator function for data access objects.
   * @memberof bo/data-access
   * @see {@link module:data-access/dao-builder} for further information.
   */
  daoBuilder: daoBuilder,
  /**
   * Base object for data access objects.
   * @memberof bo/data-access
   * @see {@link module:data-access/dao-base} for further information.
   */
  DaoBase: DaoBase,
  /**
   * Error object for data access objects.
   * @memberof bo/data-access
   * @see {@link module:data-access/dao-error} for further information.
   */
  DaoError: DaoError
};

// Immutable object.
Object.freeze(index);

module.exports = index;
