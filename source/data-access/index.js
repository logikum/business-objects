'use strict';

var DaoBase = require('./dao-base.js');
var daoBuilder = require('./dao-builder.js');
var DaoError = require('./dao-error.js');

/**
 * Contains data access components.
 *
 * @namespace bo.dataAccess
 *
 * @property {function} daoBuilder - {@link bo.dataAccess.daoBuilder Data access object builder} function to get data access objects.
 * @property {function} DaoBase - {@link bo.dataAccess.DaoBase Data access object} constructor to create new data access objects.
 * @property {function} DaoError - {@link bo.dataAccess.DaoError Data access error} constructor to create new errors occurred in data access objects.
 */
var index = {
  daoBuilder: daoBuilder,
  DaoBase: DaoBase,
  DaoError: DaoError
};

// Immutable object.
Object.freeze(index);

module.exports = index;
