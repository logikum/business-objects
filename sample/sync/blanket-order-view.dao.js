'use strict';

var daoAddressViewCtor = require('./address-view.dao.js');
var daoOrderItemViewCtor = require('./blanket-order-item-view.dao.js');
var daoOrderScheduleViewCtor = require('./blanket-order-schedule-view.dao.js');

var daoAddressView = new daoAddressViewCtor();
var daoOrderItemView = new daoOrderItemViewCtor();
var daoOrderScheduleView = new daoOrderScheduleViewCtor();

var BlanketOrderViewDao = function() {

  this.fetch = function(filter) {
    console.log('--- Blanket order view DAO.fetch');
    var key = 'key' + filter;
    if (!global.orders[key])
      throw new Error('Blanket order not found.');

    var order = global.orders[key];
    order.address = daoAddressView.fetch(order.orderKey);
    order.items = daoOrderItemView.fetchForOrder(order.orderKey);
    for (var i = 0; i < order.items.length; i++) {
      var item = order.items[i];
      item.schedules = daoOrderScheduleView.fetchForItem(item.orderItemKey);
    }

    return order;
  };

  this.fetchByName = function(filter) {
    console.log('--- Blanket order view DAO.fetchByName');
    for (var key in global.orders) {
      if (global.orders.hasOwnProperty(key)) {
        var order = global.orders[key];
        if (order.vendorName === filter) {

          order.address = daoAddressView.fetch(order.orderKey);
          order.items = daoOrderItemView.fetchForOrder(order.orderKey);
          for (var i = 0; i < order.items.length; i++) {
            var item = order.items[i];
            item.schedules = daoOrderScheduleView.fetchForItem(item.orderItemKey);
          }

          return order;
        }
      }
    }
    throw new Error('Blanket order not found.');
  };

};

module.exports = BlanketOrderViewDao;
