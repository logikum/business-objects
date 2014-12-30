'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var BlanketOrderItemViewDao = function() {
  BlanketOrderItemViewDao.super_.call(this, 'BlanketOrderItemViewDao');
};
util.inherits(BlanketOrderItemViewDao, DaoBase);

BlanketOrderItemViewDao.prototype.fetch = function(filter, callback) {
  console.log('--- Blanket order item view DAO.fetch');

  if (!global.items[filter])
    callback(new Error('Blanket order item not found.'));
  else
    callback(null, global.items[filter]);
};

BlanketOrderItemViewDao.prototype.fetchForOrder = function(filter, callback) {
  console.log('--- Blanket order item view DAO.fetchForOrder');

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

module.exports = BlanketOrderItemViewDao;
