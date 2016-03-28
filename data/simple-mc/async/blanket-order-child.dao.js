'use strict';

var util = require('util');
var DaoBase = require('../../../source/data-access/dao-base.js');

var BlanketOrderChildDao = function() {
  BlanketOrderChildDao.super_.call(this, 'BlanketOrderChildDao');
};
util.inherits(BlanketOrderChildDao, DaoBase);

BlanketOrderChildDao.prototype.create = function(connection, callback) {
  console.log('--- Blanket order child DAO.create');

  callback(null, {});
};

BlanketOrderChildDao.prototype.insert = function(connection, data, callback) {
  console.log('--- Blanket order child DAO.insert');

  data.orderKey = ++global.orderKey;
  data.createdDate = new Date();
  var key = data.orderKey;
  global.orders[key] = data;
  callback(null, data);
};

BlanketOrderChildDao.prototype.update = function(connection, data, callback) {
  console.log('--- Blanket order child DAO.update');

  var key = data.orderKey;
  if (!global.orders[key])
    callback(new Error('Blanket order child not found.'));
  else {
    data.modifiedDate = new Date();
    global.orders[key] = data;
    callback(null, data);
  }
};

BlanketOrderChildDao.prototype.remove = function(connection, filter, callback) {
  console.log('--- Blanket order child DAO.remove');

  var key = filter;
  if (global.orders[key])
    delete global.orders[key];
  callback(null);
};

module.exports = BlanketOrderChildDao;
