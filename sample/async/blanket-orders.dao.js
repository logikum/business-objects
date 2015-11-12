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

BlanketOrdersDao.prototype.fetch = function(connection, callback) {
  console.log('--- Blanket orders DAO.fetch');

  var orders = [];
  var countOrders = 0;
  var totalOrders = 0;

  for (var key in global.orders) {
    if (global.orders.hasOwnProperty(key)) {
      var order = global.orders[key];
      orders.push(order);
      totalOrders++;
    }
  }

  orders.forEach(function (order) {
    daoAddress.fetchForOrder(connection, order.orderKey, function (err, address) {
      if (err) {
        callback(err);
        return;
      }
      order.address = address;

      daoOrderItem.fetchForOrder(connection, order.orderKey, function (err, items) {
        if (err) {
          callback(err);
          return;
        }
        order.items = items;

        var count = 0;
        for (var i = 0; i < order.items.length; i++) {
          var item = order.items[i];
          daoOrderSchedule.fetchForItem(connection, item.orderItemKey, function (err, schedules) {
            if (err) {
              callback(err);
              return;
            }
            item.schedules = schedules;

            if (++count === order.items.length) {
              if (++countOrders === totalOrders)
                callback(null, order);
            }
          });
        }
      });
    });
  });
};

BlanketOrdersDao.prototype.fetchFromTo = function(connection, filter, callback) {
  console.log('--- Blanket orders DAO.fetchFromTo');

  var orders = [];
  var countOrders = 0;
  var totalOrders = 0;

  for (var key in global.orders) {
    if (global.orders.hasOwnProperty(key)) {
      var order = global.orders[key];
      if (filter.from <= order.orderKey && order.orderKey <= filter.to) {
        orders.push(order);
        totalOrders++;
      }
    }
  }

  orders.forEach(function (order) {
    daoAddress.fetchForOrder(connection, order.orderKey, function (err, address) {
      if (err) {
        callback(err);
        return;
      }
      order.address = address;

      daoOrderItem.fetchForOrder(connection, order.orderKey, function (err, items) {
        if (err) {
          callback(err);
          return;
        }
        order.items = items;

        var count = 0;
        for (var i = 0; i < order.items.length; i++) {
          var item = order.items[i];
          daoOrderSchedule.fetchForItem(connection, item.orderItemKey, function (err, schedules) {
            if (err) {
              callback(err);
              return;
            }
            item.schedules = schedules;

            if (++count === order.items.length) {
              if (++countOrders === totalOrders)
                callback(null, order);
            }
          });
        }
      });
    });
  });
};

module.exports = BlanketOrdersDao;
