'use strict';

var daoAddressCtor = require('./address.js');
var daoOrderItemCtor = require('./blanket-order-item.js');
var daoOrderScheduleCtor = require('./blanket-order-schedule.js');

var daoAddress = new daoAddressCtor();
var daoOrderItem = new daoOrderItemCtor();
var daoOrderSchedule = new daoOrderScheduleCtor();

var BlanketOrderDao = function() {

  this.create = function(callback) {
    console.log('--- Blanket order DAO.create');
    callback(null, {});
  };

  this.fetch = function(filter, callback) {
    console.log('--- Blanket order DAO.fetch');
    var key = filter;
    if (!global.orders[key]) {
      callback(new Error('Blanket order not found.'));
      return;
    }

    var order = global.orders[key];
    daoAddress.fetch(order.orderKey, function (err, address) {
      if (err) {
        callback(err);
        return;
      }
      order.address = address;

      daoOrderItem.fetchForOrder(order.orderKey, function (err, items) {
        if (err) {
          callback(err);
          return;
        }
        order.items = items;

        var count = 0;
        for (var i = 0; i < order.items.length; i++) {
          var item = order.items[i];
          daoOrderSchedule.fetchForItem(item.orderItemKey, function (err, schedules) {
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
    console.log('--- Blanket order DAO.fetchByName');
    var found = false;
    for (var key in global.orders) {
      if (global.orders.hasOwnProperty(key)) {
        var order = global.orders[key];
        if (order.vendorName === filter) {
          found = true;

          daoAddress.fetch(order.orderKey, function (err, address) {
            if (err) {
              callback(err);
              return;
            }
            order.address = address;

            daoOrderItem.fetchForOrder(order.orderKey, function (err, items) {
              if (err) {
                callback(err);
                return;
              }
              order.items = items;

              var count = 0;
              for (var i = 0; i < order.items.length; i++) {
                var item = order.items[i];
                daoOrderSchedule.fetchForItem(item.orderItemKey, function (err, schedules) {
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

  this.insert = function(data, callback) {
    console.log('--- Blanket order DAO.insert');
    data.orderKey = ++global.orderKey;
    data.createdDate = new Date();
    var key = data.orderKey;
    global.orders[key] = data;
    callback(null, data);
  };

  this.update = function(data, callback) {
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

  this.remove = function(filter, callback) {
    console.log('--- Blanket order DAO.remove');
    var key = filter;
    if (global.orders[key])
      delete global.orders[key];
    callback(null);
  };

};

module.exports = BlanketOrderDao;
