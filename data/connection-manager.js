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

ConnectionManager.prototype.openConnection = function (dataSource) {
  var connection = new Connection(dataSource);
  return Promise.resolve(connection);
};

ConnectionManager.prototype.closeConnection = function (dataSource, connection) {
  connection.close();
  return Promise.resolve(null);
};

ConnectionManager.prototype.beginTransaction = function (dataSource) {
  var connection = new Connection(dataSource);
  connection.begin();
  return Promise.resolve(connection);
};

ConnectionManager.prototype.commitTransaction = function (dataSource, connection) {
  connection.commit();
  connection.close();
  return Promise.resolve(null);
};

ConnectionManager.prototype.rollbackTransaction = function (dataSource, connection) {
  connection.rollback();
  connection.close();
  return Promise.resolve(null);
};

module.exports = ConnectionManager;
