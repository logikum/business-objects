'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var daoAddressCtor = require('./address.dao.js');
var daoOrderItemCtor = require('./blanket-order-item.dao.js');
var daoOrderScheduleCtor = require('./blanket-order-schedule.dao.js');

var daoAddress = new daoAddressCtor();
var daoOrderItem = new daoOrderItemCtor();
var daoOrderSchedule = new daoOrderScheduleCtor();

var BlanketOrderDao = function() {
  BlanketOrderDao.super_.call(this, 'BlanketOrderDao');
};
util.inherits(BlanketOrderDao, DaoBase);

BlanketOrderDao.prototype.create = function(connection) {
  console.log('--- Blanket order DAO.create');

  return Promise.resolve( {} );
};

BlanketOrderDao.prototype.fetch = function(connection, filter) {
  console.log('--- Blanket order DAO.fetch');

  return new Promise( (fulfill, reject) => {
    var key = filter;
    if (!global.orders[key]) {
      reject(new Error('Blanket order not found.'));
      return;
    }

    var order = global.orders[key];
    return daoAddress.fetchForOrder(connection, order.orderKey)
    .then( address => {
      order.address = address;

      return daoOrderItem.fetchForOrder(connection, order.orderKey)
      .then( items => {
        order.items = items;

        return Promise.all(items.map(item => {
          return daoOrderSchedule.fetchForItem(connection, item.orderItemKey);
        }))
        .then( values => {
          for (var i = 0; i < values.length; i++) {
            order.items[i].schedules = values[i];
          }
          fulfill( order );
        });
      });
    });
  });
};

BlanketOrderDao.prototype.fetchByName = function(connection, filter) {
  console.log('--- Blanket order DAO.fetchByName');

  return new Promise( (fulfill, reject) => {
    var found = false;
    for (var key in global.orders) {
      if (global.orders.hasOwnProperty(key)) {
        var order = global.orders[key];
        if (order.vendorName === filter) {
          found = true;

          return daoAddress.fetchForOrder(connection, order.orderKey)
          .then( address => {
            order.address = address;

            return daoOrderItem.fetchForOrder(connection, order.orderKey)
            .then( items => {
              order.items = items;

              return Promise.all(items.map(item => {
                return daoOrderSchedule.fetchForItem(connection, item.orderItemKey);
              }))
              .then( values => {
                for (var i = 0; i < values.length; i++) {
                  order.items[i].schedules = values[i];
                }
                fulfill( order );
              });
            });
          });
        }
      }
    }
    if (!found)
      reject(new Error('Blanket order not found.'));
  });
};

BlanketOrderDao.prototype.insert = function(connection, data) {
  console.log('--- Blanket order DAO.insert');

  return new Promise( (fulfill, reject) => {
    data.orderKey = ++global.orderKey;
    data.createdDate = new Date();
    var key = data.orderKey;
    global.orders[key] = data;
    fulfill( data );
  });
};

BlanketOrderDao.prototype.update = function(connection, data) {
  console.log('--- Blanket order DAO.update');

  return new Promise( (fulfill, reject) => {
    var key = data.orderKey;
    if (!global.orders[key])
      reject(new Error('Blanket order not found.'));
    else {
      data.modifiedDate = new Date();
      global.orders[key] = data;
      fulfill( data );
    }
  });
};

BlanketOrderDao.prototype.remove = function(connection, filter) {
  console.log('--- Blanket order DAO.remove');

  return new Promise( (fulfill, reject) => {
    var key = filter;
    if (global.orders[key])
      delete global.orders[key];
    fulfill( null );
  });
};

module.exports = BlanketOrderDao;
