'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var BlanketOrderChildDao = function() {
  BlanketOrderChildDao.super_.call(this, 'BlanketOrderChildDao');
};
util.inherits(BlanketOrderChildDao, DaoBase);

BlanketOrderChildDao.prototype.create = function(connection) {
  console.log('--- Blanket order child DAO.create');
  return {};
};

BlanketOrderChildDao.prototype.insert = function(connection, data) {
  console.log('--- Blanket order child DAO.insert');

  data.orderKey = ++global.orderKey;
  data.createdDate = new Date();
  var key = data.orderKey;
  global.orders[key] = data;
  return data;
};

BlanketOrderChildDao.prototype.update = function(connection, data) {
  console.log('--- Blanket order child DAO.update');

  var key = data.orderKey;
  if (!global.orders[key])
    throw new Error('Blanket order child not found.');
  data.modifiedDate = new Date();
  global.orders[key] = data;
  return data;
};

BlanketOrderChildDao.prototype.remove = function(connection, filter) {
  console.log('--- Blanket order child DAO.remove');

  var key = filter;
  if (global.orders[key])
    delete global.orders[key];
};

module.exports = BlanketOrderChildDao;
