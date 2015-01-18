'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var daoAddressCtor = require('./address.js');
var daoOrderItemCtor = require('./blanket-order-item.js');
var daoOrderScheduleCtor = require('./blanket-order-schedule.js');

var daoAddress = new daoAddressCtor();
var daoOrderItem = new daoOrderItemCtor();
var daoOrderSchedule = new daoOrderScheduleCtor();

var BlanketOrderDao = function() {
  BlanketOrderDao.super_.call(this, 'BlanketOrderDao');
};
util.inherits(BlanketOrderDao, DaoBase);

BlanketOrderDao.prototype.create = function(connection, callback) {
  console.log('--- Blanket order DAO.create');

  callback(null, {
    vendorName:   '',
    contractDate: new Date(1980, 1, 1),
    totalPrice:   0.0,
    schedules:    0,
    enabled:      true
  });
};

BlanketOrderDao.prototype.fetch = function(connection, filter, callback) {
  console.log('--- Blanket order DAO.fetch');

  var key = filter;
  if (!global.orders[key]) {
    callback(new Error('Blanket order not found.'));
    return;
  }

  var order = global.orders[key];
  daoAddress.fetch(connection, order.orderKey, function (err, address) {
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
            callback(null, order);
          }
        });
      }
    });
  });
};

BlanketOrderDao.prototype.fetchByName = function(connection, filter, callback) {
  console.log('--- Blanket order DAO.fetchByName');

  var found = false;
  for (var key in global.orders) {
    if (global.orders.hasOwnProperty(key)) {
      var order = global.orders[key];
      if (order.vendorName === filter) {
        found = true;

        daoAddress.fetch(connection, order.orderKey, function (err, address) {
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
                  callback(null, order);
                }
              });
            }
          });
        });
        return;
      }
    }
  }
  if (!found)
    callback(new Error('Blanket order not found.'));
};

BlanketOrderDao.prototype.insert = function(connection, data, callback) {
  console.log('--- Blanket order DAO.insert');

  data.orderKey = ++global.orderKey;
  data.createdDate = new Date();
  var key = data.orderKey;
  global.orders[key] = data;
  callback(null, data);
};

BlanketOrderDao.prototype.update = function(connection, data, callback) {
  console.log('--- Blanket order DAO.update');

  var key = data.orderKey;
  if (!global.orders[key])
    callback(new Error('Blanket order not found.'));
  else {
    data.modifiedDate = new Date();
    global.orders[key] = data;
    callback(null, data);
  }
};

BlanketOrderDao.prototype.remove = function(connection, filter, callback) {
  console.log('--- Blanket order DAO.remove');

  var key = filter;
  if (global.orders[key])
    delete global.orders[key];
  callback(null);
};

module.exports = BlanketOrderDao;
