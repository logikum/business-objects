'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var daoAddressCtor = require('./address.dao.js');
var daoOrderItemCtor = require('./blanket-order-item.dao.js');
var daoOrderScheduleCtor = require('./blanket-order-schedule.dao.js');

var daoAddress = new daoAddressCtor();
var daoOrderItem = new daoOrderItemCtor();
var daoOrderSchedule = new daoOrderScheduleCtor();

var BlanketOrderChildDao = function() {
  BlanketOrderChildDao.super_.call(this, 'BlanketOrderChildDao');
};
util.inherits(BlanketOrderChildDao, DaoBase);

BlanketOrderChildDao.prototype.create = function(connection) {
  console.log('--- Blanket order child DAO.create');
  return {};
};

BlanketOrderChildDao.prototype.fetch = function(connection, filter) {
  console.log('--- Blanket order child DAO.fetch');

  var key = filter;
  if (!global.orders[key])
    throw new Error('Blanket order child not found.');

  var order = global.orders[key];
  order.address = daoAddress.fetchForOrder(connection, order.orderKey);
  order.items = daoOrderItem.fetchForOrder(connection, order.orderKey);
  for (var i = 0; i < order.items.length; i++) {
    var item = order.items[i];
    item.schedules = daoOrderSchedule.fetchForItem(connection, item.orderItemKey);
  }

  return order;
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
