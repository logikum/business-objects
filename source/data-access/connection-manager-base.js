'use strict';

var CLASS_NAME = 'ConnectionManager';

var NotImplementedError = require('../system/not-implemented-error.js');

/**
 * @classdesc Serves as the base class to manage connections of several data sources.
 * @description Creates a new connection manager object.
 *
 * @memberof bo.dataAccess
 * @constructor
 */
var ConnectionManagerBase = function () {
};

/**
 * Returns a new connection of the named data source.
 *
 * @abstract
 * @function bo.dataAccess.ConnectionManagerBase#openConnection
 * @param {string} dataSource - The name of the data source.
 * @returns {promise<object>} A promise to the new connection.
 */
ConnectionManagerBase.prototype.openConnection = function (dataSource) {
  throw new NotImplementedError('method', CLASS_NAME, 'openConnection');
};

/**
 * Closes the given connection of the data source.
 *
 * @abstract
 * @function bo.dataAccess.ConnectionManagerBase#openConnection
 * @param {string} dataSource - The name of the data source.
 * @param {object} connection - The connection to be closed.
 * @returns {promise<object>} A promise to the closed connection.
 */
ConnectionManagerBase.prototype.closeConnection = function (dataSource, connection) {
  throw new NotImplementedError('method', CLASS_NAME, 'closeConnection');
};

/**
 * Returns a new connection of the named data source after having started a new transaction.
 * If the data source does not support transactions, returns a new connection only.
 *
 * @abstract
 * @function bo.dataAccess.ConnectionManagerBase#beginTransaction
 * @param {string} dataSource - The name of the data source.
 * @returns {promise<object>} A promise to the new connection with initiated transaction.
 */
ConnectionManagerBase.prototype.beginTransaction = function (dataSource) {
  return this.openConnection(dataSource);
};

/**
 * Finalizes the current transaction and closes the connection of the data source.
 * If the data source does not support transactions, closes the given connection only.
 *
 * @abstract
 * @function bo.dataAccess.ConnectionManagerBase#commitTransaction
 * @param {string} dataSource - The name of the data source.
 * @param {object} connection - The connection to be closed.
 * @returns {promise<object>} A promise to the closed connection.
 */
ConnectionManagerBase.prototype.commitTransaction = function (dataSource, connection) {
  return this.closeConnection(dataSource, connection);
};

/**
 * Cancels the current transaction and closes the connection of the data source.
 * If the data source does not support transactions, closes the given connection only.
 *
 * @abstract
 * @function bo.dataAccess.ConnectionManagerBase#rollbackTransaction
 * @param {string} dataSource - The name of the data source.
 * @param {object} connection - The connection to be closed.
 * @returns {promise<object>} A promise to the closed connection.
 */
ConnectionManagerBase.prototype.rollbackTransaction = function (dataSource, connection) {
  return this.closeConnection(dataSource, connection);
};

module.exports = ConnectionManagerBase;
