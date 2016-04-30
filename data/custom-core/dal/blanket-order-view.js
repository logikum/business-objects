'use strict';

var util = require('util');
var DaoBase = require('../../../source/data-access/dao-base.js');

var daoAddressCtor = require('./address.js');
var daoOrderItemCtor = require('./blanket-order-item.js');
var daoOrderScheduleCtor = require('./blanket-order-schedule.js');

var daoAddress = new daoAddressCtor();
var daoOrderItem = new daoOrderItemCtor();
var daoOrderSchedule = new daoOrderScheduleCtor();

var BlanketOrderViewDao = function() {
  BlanketOrderViewDao.super_.call(this, 'BlanketOrderViewDao');
};
util.inherits(BlanketOrderViewDao, DaoBase);

BlanketOrderViewDao.prototype.fetch = function( ctx, filter ) {
  console.log('--- Blanket order view DAO.fetch');

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

BlanketOrderViewDao.prototype.fetchByName = function( ctx, filter ) {
  console.log('--- Blanket order view DAO.fetchByName');

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

module.exports = BlanketOrderViewDao;
