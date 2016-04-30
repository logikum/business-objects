'use strict';

var util = require('util');
var DaoBase = require('../../../source/data-access/dao-base.js');

var BlanketOrderItemDao = function() {
  BlanketOrderItemDao.super_.call(this, 'BlanketOrderItemDao');
};
util.inherits(BlanketOrderItemDao, DaoBase);

BlanketOrderItemDao.prototype.create = function( ctx ) {
  console.log('--- Blanket order item DAO.create');

  ctx.fulfill( {
    productName: '',
    obsolete:    false,
    expiry:      new Date(1980, 1, 1),
    quantity:    0,
    unitPrice:   0.0
  });
};

/* Special fetch method for test circumstances. */
BlanketOrderItemDao.prototype.fetchForOrder = function( ctx, filter ) {
  console.log('--- Blanket order item DAO.fetchForOrder');

  var items = [];
  for (var key in global.items) {
    if (global.items.hasOwnProperty(key)) {
      var item = global.items[key];
      if (item.orderKey === filter)
        items.push(item);
    }
  }
  ctx.fulfill( items );
};

BlanketOrderItemDao.prototype.insert = function( ctx, data ) {
  console.log('--- Blanket order item DAO.insert');

  data.orderItemKey = ++global.itemKey;
  global.items[data.orderItemKey] = data;
  ctx.fulfill( data );
};

BlanketOrderItemDao.prototype.update = function( ctx, data ) {
  console.log('--- Blanket order item DAO.update');

  if (!global.items[data.orderItemKey])
    ctx.reject( new Error('Blanket order item not found.' ));
  else {
    global.items[data.orderItemKey] = data;
    ctx.fulfill( data );
  }
};

BlanketOrderItemDao.prototype.remove = function( ctx, filter ) {
  console.log('--- Blanket order item DAO.remove');

  if (global.items[filter])
    delete global.items[filter];
  ctx.fulfill( null );
};

module.exports = BlanketOrderItemDao;
