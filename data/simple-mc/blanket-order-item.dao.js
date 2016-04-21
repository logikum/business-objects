'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var BlanketOrderItemDao = function() {
  BlanketOrderItemDao.super_.call(this, 'BlanketOrderItemDao');
};
util.inherits(BlanketOrderItemDao, DaoBase);

BlanketOrderItemDao.prototype.create = function(connection) {
  console.log('--- Blanket order item DAO.create');

  return Promise.resolve( {} );
};

/* Special fetch method for test circumstances. */
BlanketOrderItemDao.prototype.fetchForOrder = function(connection, filter) {
  console.log('--- Blanket order item DAO.fetchForOrder');

  return new Promise( (fulfill, reject) => {
    var items = [];
    for (var key in global.items) {
      if (global.items.hasOwnProperty(key)) {
        var item = global.items[key];
        if (item.orderKey === filter)
          items.push(item);
      }
    }
    fulfill( items );
  });
};

BlanketOrderItemDao.prototype.insert = function(connection, data) {
  console.log('--- Blanket order item DAO.insert');

  return new Promise( (fulfill, reject) => {
    data.orderItemKey = ++global.itemKey;
    global.items[data.orderItemKey] = data;
    fulfill( data );
  });
};

BlanketOrderItemDao.prototype.update = function(connection, data) {
  console.log('--- Blanket order item DAO.update');

  return new Promise( (fulfill, reject) => {
    if (!global.items[data.orderItemKey])
      reject(new Error('Blanket order item not found.'));
    else {
      global.items[data.orderItemKey] = data;
      fulfill( data );
    }
  });
};

BlanketOrderItemDao.prototype.remove = function(connection, filter) {
  console.log('--- Blanket order item DAO.remove');

  return new Promise( (fulfill, reject) => {
    if (global.items[filter])
      delete global.items[filter];
    fulfill( null );
  });
};

module.exports = BlanketOrderItemDao;
