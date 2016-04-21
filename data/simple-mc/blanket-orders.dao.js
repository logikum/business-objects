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

  return new Promise( (fulfill, reject) => {
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

    return Promise.all(orders.map( order => {
      return daoAddress.fetchForOrder(connection, order.orderKey);
    }))
    .then( addresses => {
      for(i = 0; i < adresses.length; i++) {
        orders[i].address = addresses[i];

        return daoOrderItem.fetchForOrder(connection, order.orderKey)
        .then( items => {
          orders[i].items = items;

          return Promise.all(items.map( item => {
            return daoOrderSchedule.fetchForItem(connection, item.orderItemKey);
          }))
          .then( values => {
            for (var i = 0; i < values.length; i++) {
              order.items[i].schedules = values[i];
            }
            fulfill( orders );
          })
        });
      }
    });
  });
};

BlanketOrdersDao.prototype.fetchFromTo = function(connection, filter) {
  console.log('--- Blanket orders DAO.fetchFromTo');

  return new Promise( (fulfill, reject) => {
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

    if (orders.length) {
      var xx = orders.map( order => {
        return daoAddress.fetchForOrder(connection, order.orderKey)
        .then( address => {
          order.address = address;

          return daoOrderItem.fetchForOrder(connection, order.orderKey)
          .then( items => {
            order.items = items;

            return Promise.all(items.map(item => {
              return daoOrderSchedule.fetchForItem(connection, item.orderItemKey);
            }))
            .then( schedules => {
              for (var i = 0; i < schedules.length; i++) {
                order.items[i].schedules = schedules[i];
              }
            });
          });
        });
      });
      return Promise.all( xx )
          .then( values => {
            fulfill( orders );
          });
    } else
      fulfill( orders );
  });
};

module.exports = BlanketOrdersDao;
