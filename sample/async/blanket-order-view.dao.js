'use strict';

var daoAddressViewCtor = require('./address-view.dao.js');
var daoOrderItemViewCtor = require('./blanket-order-item-view.dao.js');
var daoOrderScheduleViewCtor = require('./blanket-order-schedule-view.dao.js');

var daoAddressView = new daoAddressViewCtor();
var daoOrderItemView = new daoOrderItemViewCtor();
var daoOrderScheduleView = new daoOrderScheduleViewCtor();

var BlanketOrderViewDao = function() {

  this.fetch = function(filter, callback) {
    console.log('--- Blanket order view DAO.fetch');
    var key = 'key' + filter;
    if (!global.orders[key]) {
      callback(new Error('Blanket order not found.'));
      return;
    }

    var order = global.orders[key];
    daoAddressView.fetch(order.orderKey, function (err, address) {
      if (err) {
        callback(err);
        return;
      }
      order.address = address;

      daoOrderItemView.fetchForOrder(order.orderKey, function (err, items) {
        if (err) {
          callback(err);
          return;
        }
        order.items = items;

        var count = 0;
        for (var i = 0; i < order.items.length; i++) {
          var item = order.items[i];
          daoOrderScheduleView.fetchForItem(item.orderItemKey, function (err, schedules) {
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

  this.fetchByName = function(filter, callback) {
    console.log('--- Blanket order view DAO.fetchByName');
    var found = false;
    for (var key in global.orders) {
      if (global.orders.hasOwnProperty(key)) {
        var order = global.orders[key];
        if (order.vendorName === filter) {
          found = true;

          daoAddressView.fetch(order.orderKey, function (err, address) {
            if (err) {
              callback(err);
              return;
            }
            order.address = address;

            daoOrderItemView.fetchForOrder(order.orderKey, function (err, items) {
              if (err) {
                callback(err);
                return;
              }
              order.items = items;

              var count = 0;
              for (var i = 0; i < order.items.length; i++) {
                var item = order.items[i];
                daoOrderScheduleView.fetchForItem(item.orderItemKey, function (err, schedules) {
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

};

module.exports = BlanketOrderViewDao;
