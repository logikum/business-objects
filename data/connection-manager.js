'use strict';

var util = require('util');
var ConnectionManagerBase = require('../source/data-access/connection-manager-base.js');

var connectionId = 0;
var transactionId = 0;

// Connection constructor.
var Connection = function (dataSource) {
  this.dataSource = dataSource;
  this.connectionId = ++connectionId;
  this.transactionId = null;

  this.close = function () {
    this.connectionId = null;
  };
  this.begin = function () {
    this.transactionId = ++transactionId;
  };
  this.commit = function () {
    this.transactionId = null;
  };
  this.rollback = function () {
    this.transactionId = null;
  };
};

// Connection manager constructor.
var ConnectionManager = function() {
  ConnectionManager.super_.call(this);
};
util.inherits(ConnectionManager, ConnectionManagerBase);

ConnectionManager.prototype.openConnection = function (dataSource, callback) {
  var connection = new Connection(dataSource);
  if (callback)
    callback(null, connection);
  else
    return connection;
};

ConnectionManager.prototype.closeConnection = function (dataSource, connection, callback) {
  connection.close();
  if (callback)
    callback(null, null);
  else
    return null;
};

ConnectionManager.prototype.beginTransaction = function (dataSource, callback) {
  var connection = new Connection(dataSource);
  connection.begin();
  if (callback)
    callback(null, connection);
  else
    return connection;
};

ConnectionManager.prototype.commitTransaction = function (dataSource, connection, callback) {
  connection.commit();
  connection.close();
  if (callback)
    callback(null, null);
  else
    return null;
};

ConnectionManager.prototype.rollbackTransaction = function (dataSource, connection, callback) {
  connection.rollback();
  connection.close();
  if (callback)
    callback(null, null);
  else
    return null;
};

module.exports = ConnectionManager;
