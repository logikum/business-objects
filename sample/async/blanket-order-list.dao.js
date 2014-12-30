'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var BlanketOrderListDao = function() {
  BlanketOrderListDao.super_.call(this, 'BlanketOrderListDao');
};
util.inherits(BlanketOrderListDao, DaoBase);

BlanketOrderListDao.prototype.fetch = function(filter, callback) {
  console.log('--- Blanket order list DAO.fetch');

  var orderList = [];
  for (var key in global.orders) {
    if (global.orders.hasOwnProperty(key)) {
      orderList.push(global.orders[key]);
    }
  }
  callback(null, orderList);
};

BlanketOrderListDao.prototype.fetchByName = function(filter, callback) {
  console.log('--- Blanket order list DAO.fetchByName');

  var orderList = [];
  for (var key in global.orders) {
    if (global.orders.hasOwnProperty(key)) {
      var order = global.orders[key];
      if (order.vendorName === filter)
        orderList.push();
    }
  }
  callback(null, orderList);
};

module.exports = BlanketOrderListDao;
