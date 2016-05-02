'use strict';

var util = require('util');
var DaoBase = require('../../../source/data-access/dao-base.js');

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

BlanketOrderDao.prototype.create = function( ctx ) {
  console.log('--- Blanket order DAO.create');

  ctx.fulfill( {
    vendorName:   '',
    contractDate: new Date(1980, 1, 1),
    totalPrice:   0.0,
    schedules:    0,
    enabled:      true
  });
};

BlanketOrderDao.prototype.fetch = function( ctx, filter ) {
  console.log('--- Blanket order DAO.fetch');

  var key = filter;
  if (!global.orders[key]) {
    ctx.reject( new Error('Blanket order not found.' ));
    return;
  }

  var order = global.orders[key];
  return daoAddress.$runMethod( 'fetchForOrder', ctx.connection, order.orderKey )
    .then( address => {
      order.address = address;

      return daoOrderItem.$runMethod( 'fetchForOrder', ctx.connection, order.orderKey )
        .then( items => {
          order.items = items;

          return Promise.all(items.map(item => {
            return daoOrderSchedule.$runMethod( 'fetchForItem', ctx.connection, item.orderItemKey );
          }))
            .then( values => {
              for (var i = 0; i < values.length; i++) {
                order.items[i].schedules = values[i];
              }
              ctx.fulfill( order );
            });
        });
    });
};

BlanketOrderDao.prototype.fetchByName = function( ctx, filter ) {
  console.log('--- Blanket order DAO.fetchByName');

  var found = false;
  for (var key in global.orders) {
    if (global.orders.hasOwnProperty(key)) {
      var order = global.orders[key];
      if (order.vendorName === filter) {
        found = true;

        return daoAddress.$runMethod( 'fetchForOrder', ctx.connection, order.orderKey )
          .then( address => {
            order.address = address;

            return daoOrderItem.$runMethod( 'fetchForOrder', ctx.connection, order.orderKey )
              .then( items => {
                order.items = items;

                return Promise.all(items.map(item => {
                  return daoOrderSchedule.$runMethod( 'fetchForItem', ctx.connection, item.orderItemKey );
                }))
                  .then( values => {
                    for (var i = 0; i < values.length; i++) {
                      order.items[i].schedules = values[i];
                    }
                    ctx.fulfill( order );
                  });
              });
          });
      }
    }
  }
  if (!found)
    ctx.reject( new Error('Blanket order not found.' ));
};

BlanketOrderDao.prototype.insert = function( ctx, data ) {
  console.log('--- Blanket order DAO.insert');

  data.orderKey = ++global.orderKey;
  data.createdDate = new Date();
  var key = data.orderKey;
  global.orders[key] = data;
  ctx.fulfill( data );
};

BlanketOrderDao.prototype.update = function( ctx, data ) {
  console.log('--- Blanket order DAO.update');

  var key = data.orderKey;
  if (!global.orders[key])
    ctx.reject( new Error('Blanket order not found.' ));
  else {
    data.modifiedDate = new Date();
    global.orders[key] = data;
    ctx.fulfill( data );
  }
};

BlanketOrderDao.prototype.remove = function( ctx, filter ) {
  console.log('--- Blanket order DAO.remove');

  var key = filter;
  if (global.orders[key])
    delete global.orders[key];
  ctx.fulfill( null );
};

module.exports = BlanketOrderDao;
