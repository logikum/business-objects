'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var BlanketOrderItemDao = function() {
  BlanketOrderItemDao.super_.call(this, 'BlanketOrderItemDao');
};
util.inherits(BlanketOrderItemDao, DaoBase);

BlanketOrderItemDao.prototype.create = function(callback) {
  console.log('--- Blanket order item DAO.create');

  callback(null, {
    productName: '',
    obsolete:    false,
    expiry:      new Date(1980, 1, 1),
    quantity:    0,
    unitPrice:   0.0
  });
};

BlanketOrderItemDao.prototype.fetch = function(filter, callback) {
  console.log('--- Blanket order item DAO.fetch');

  if (!global.items[filter])
    callback(new Error('Blanket order item not found.'));
  else
    callback(null, global.items[filter]);
};

BlanketOrderItemDao.prototype.fetchForOrder = function(filter, callback) {
  console.log('--- Blanket order item DAO.fetchForOrder');

  var items = [];
  for (var key in global.items) {
    if (global.items.hasOwnProperty(key)) {
      var item = global.items[key];
      if (item.orderKey === filter)
        items.push(item);
    }
  }
  callback(null, items);
};

BlanketOrderItemDao.prototype.insert = function(data, callback) {
  console.log('--- Blanket order item DAO.insert');

  data.orderItemKey = ++global.itemKey;
  global.items[data.orderItemKey] = data;
  callback(null, data);
};

BlanketOrderItemDao.prototype.update = function(data, callback) {
  console.log('--- Blanket order item DAO.update');

  if (!global.items[data.orderItemKey])
    callback(new Error('Blanket order item not found.'));
  else {
    global.items[data.orderItemKey] = data;
    callback(null, data);
  }
};

BlanketOrderItemDao.prototype.remove = function(filter, callback) {
  console.log('--- Blanket order item DAO.remove');

  if (global.items[filter])
    delete global.items[filter];
  callback(null);
};

module.exports = BlanketOrderItemDao;
