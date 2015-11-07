'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var daoAddressCtor = require('./address.dao.js');
var daoOrderItemCtor = require('./blanket-order-item.dao.js');
var daoOrderScheduleCtor = require('./blanket-order-schedule.dao.js');

var daoAddress = new daoAddressCtor();
var daoOrderItem = new daoOrderItemCtor();
var daoOrderSchedule = new daoOrderScheduleCtor();

var BlanketOrdersDao = function() {
  BlanketOrdersDao.super_.call(this, 'BlanketOrdersDao');
};
util.inherits(BlanketOrdersDao, DaoBase);

BlanketOrdersDao.prototype.fetch = function(connection) {
  console.log('--- Blanket orders DAO.fetch');

  var orders = [];
  for (var key in global.orders) {
    if (global.orders.hasOwnProperty(key)) {
      orders.push(global.orders[key]);
    }
  }
  return orders;
};

BlanketOrdersDao.prototype.fetchFromTo = function(connection, filter) {
  console.log('--- Blanket orders DAO.fetchFromTo');

  var orders = [];
  for (var key in global.orders) {
    if (global.orders.hasOwnProperty(key)) {
      var order = global.orders[key];
      if (filter.from <= order.orderKey && order.orderKey <= filter.to) {

        order.address = daoAddress.fetchForOrder(connection, order.orderKey);
        order.items = daoOrderItem.fetchForOrder(connection, order.orderKey);
        for (var i = 0; i < order.items.length; i++) {
          var item = order.items[i];
          item.schedules = daoOrderSchedule.fetchForItem(connection, item.orderItemKey);
        }

        orders.push(order);
      }
    }
  }
  return orders;
};

module.exports = BlanketOrdersDao;
