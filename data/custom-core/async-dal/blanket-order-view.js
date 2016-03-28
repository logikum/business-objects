'use strict';

var util = require('util');
var DaoBase = require('../../../source/data-access/dao-base.js');

//region Helper methods

function fetchAddress (connection, filter, callback) {
  console.log('--- Blanket order address view DAO.fetch');

  for (var key in global.addresses) {
    if (global.addresses.hasOwnProperty(key)) {
      var data = global.addresses[key];
      if (data.orderKey === filter){
        callback(null, data);
        return;
      }
    }
  }
  callback(null, {});
}

function fetchItemsOfOrder (connection, filter, callback) {
  console.log('--- Blanket order item view DAO.fetchForOrder');

  var items = [];
  for (var key in global.items) {
    if (global.items.hasOwnProperty(key)) {
      var item = global.items[key];
      if (item.orderKey === filter)
        items.push(item);
    }
  }
  callback(null, items);
}

function fetchSchedulesOfItem (connection, filter, callback) {
  console.log('--- Blanket order schedule view DAO.fetchForItem');

  var schedules = [];
  for (var key in global.schedules) {
    if (global.schedules.hasOwnProperty(key)) {
      var schedule = global.schedules[key];
      if (schedule.orderItemKey === filter)
        schedules.push(schedule);
    }
  }
  callback(null, schedules);
}

//endregion

var BlanketOrderViewDao = function() {
  BlanketOrderViewDao.super_.call(this, 'BlanketOrderViewDao');
};
util.inherits(BlanketOrderViewDao, DaoBase);

BlanketOrderViewDao.prototype.fetch = function(connection, filter, callback) {
  console.log('--- Blanket order view DAO.fetch');

  var key = filter;
  if (!global.orders[key]) {
    callback(new Error('Blanket order not found.'));
    return;
  }

  var order = global.orders[key];
  fetchAddress(connection, order.orderKey, function (err, address) {
    if (err) {
      callback(err);
      return;
    }
    order.address = address;

    fetchItemsOfOrder(connection, order.orderKey, function (err, items) {
      if (err) {
        callback(err);
        return;
      }
      order.items = items;

      var count = 0;
      for (var i = 0; i < order.items.length; i++) {
        var item = order.items[i];
        fetchSchedulesOfItem(connection, item.orderItemKey, function (err, schedules) {
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

BlanketOrderViewDao.prototype.fetchByName = function(connection, filter, callback) {
  console.log('--- Blanket order view DAO.fetchByName');

  var found = false;
  for (var key in global.orders) {
    if (global.orders.hasOwnProperty(key)) {
      var order = global.orders[key];
      if (order.vendorName === filter) {
        found = true;

        fetchAddress(connection, order.orderKey, function (err, address) {
          if (err) {
            callback(err);
            return;
          }
          order.address = address;

          fetchItemsOfOrder(connection, order.orderKey, function (err, items) {
            if (err) {
              callback(err);
              return;
            }
            order.items = items;

            var count = 0;
            for (var i = 0; i < order.items.length; i++) {
              var item = order.items[i];
              fetchSchedulesOfItem(connection, item.orderItemKey, function (err, schedules) {
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

module.exports = BlanketOrderViewDao;
