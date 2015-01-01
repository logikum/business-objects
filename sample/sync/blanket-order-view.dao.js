'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

//region Helper methods

function fetchAddress (filter) {
  console.log('--- Blanket order address view DAO.fetch');

  for (var key in global.addresses) {
    if (global.addresses.hasOwnProperty(key)) {
      var data = global.addresses[key];
      if (data.orderKey === filter)
        return data;
    }
  }
  return {};
}

function fetchItemsOfOrder (filter) {
  console.log('--- Blanket order item view DAO.fetchForOrder');

  var items = [];
  for (var key in global.items) {
    if (global.items.hasOwnProperty(key)) {
      var item = global.items[key];
      if (item.orderKey === filter)
        items.push(item);
    }
  }
  return items;
}

function fetchSchedulesOfItem (filter) {
  console.log('--- Blanket order schedule view DAO.fetchForItem');

  var schedules = [];
  for (var key in global.schedules) {
    if (global.schedules.hasOwnProperty(key)) {
      var schedule = global.schedules[key];
      if (schedule.orderItemKey === filter)
        schedules.push(schedule);
    }
  }
  return schedules;
}

//endregion

var BlanketOrderViewDao = function () {
  BlanketOrderViewDao.super_.call(this, 'BlanketOrderViewDao');
};
util.inherits(BlanketOrderViewDao, DaoBase);

BlanketOrderViewDao.prototype.fetch = function (filter) {
  console.log('--- Blanket order view DAO.fetch');

  var key = filter;
  if (!global.orders[key])
    throw new Error('Blanket order not found.');

  var order = global.orders[key];
  order.address = fetchAddress(order.orderKey);
  order.items = fetchItemsOfOrder(order.orderKey);
  for (var i = 0; i < order.items.length; i++) {
    var item = order.items[i];
    item.schedules = fetchSchedulesOfItem(item.orderItemKey);
  }

  return order;
};

BlanketOrderViewDao.prototype.fetchByName = function (filter) {
  console.log('--- Blanket order view DAO.fetchByName');

  for (var key in global.orders) {
    if (global.orders.hasOwnProperty(key)) {
      var order = global.orders[key];
      if (order.vendorName === filter) {

        order.address = fetchAddress(order.orderKey);
        order.items = fetchItemsOfOrder(order.orderKey);
        for (var i = 0; i < order.items.length; i++) {
          var item = order.items[i];
          item.schedules = fetchSchedulesOfItem(item.orderItemKey);
        }

        return order;
      }
    }
  }
  throw new Error('Blanket order not found.');
};

module.exports = BlanketOrderViewDao;
