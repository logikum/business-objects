'use strict';

var daoAddressCtor = require('./address.js');
var daoOrderItemCtor = require('./blanket-order-item.js');
var daoOrderScheduleCtor = require('./blanket-order-schedule.js');

var daoAddress = new daoAddressCtor();
var daoOrderItem = new daoOrderItemCtor();
var daoOrderSchedule = new daoOrderScheduleCtor();

var BlanketOrderDao = function() {

  this.create = function() {
    console.log('--- Blanket order DAO.create');
    return {
      vendorName:   '',
      contractDate: new Date(1980, 1, 1),
      totalPrice:   0.0,
      schedules:    0,
      enabled:      true
    };
  };

  this.fetch = function(filter) {
    console.log('--- Blanket order DAO.fetch');
    var key = filter;
    if (!global.orders[key])
      throw new Error('Blanket order not found.');

    var order = global.orders[key];
    order.address = daoAddress.fetch(order.orderKey);
    order.items = daoOrderItem.fetchForOrder(order.orderKey);
    for (var i = 0; i < order.items.length; i++) {
      var item = order.items[i];
      item.schedules = daoOrderSchedule.fetchForItem(item.orderItemKey);
    }

    return order;
  };

  this.fetchByName = function(filter) {
    console.log('--- Blanket order DAO.fetchByName');
    for (var key in global.orders) {
      if (global.orders.hasOwnProperty(key)) {
        var order = global.orders[key];
        if (order.vendorName === filter) {

          order.address = daoAddress.fetch(order.orderKey);
          order.items = daoOrderItem.fetchForOrder(order.orderKey);
          for (var i = 0; i < order.items.length; i++) {
            var item = order.items[i];
            item.schedules = daoOrderSchedule.fetchForItem(item.orderItemKey);
          }

          return order;
        }
      }
    }
    throw new Error('Blanket order not found.');
  };

  this.insert = function(data) {
    console.log('--- Blanket order DAO.insert');
    data.orderKey = ++global.orderKey;
    data.createdDate = new Date();
    var key = data.orderKey;
    global.orders[key] = data;
    return data;
  };

  this.update = function(data) {
    console.log('--- Blanket order DAO.update');
    var key = data.orderKey;
    if (!global.orders[key])
      throw new Error('Blanket order not found.');
    data.modifiedDate = new Date();
    global.orders[key] = data;
    return data;
  };

  this.remove = function(filter) {
    console.log('--- Blanket order DAO.remove');
    var key = filter;
    if (global.orders[key])
      delete global.orders[key];
  };

};

module.exports = BlanketOrderDao;
