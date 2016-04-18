'use strict';

var util = require('util');
var DaoBase = require('../../../source/data-access/dao-base.js');

var BlanketOrderListDao = function() {
  BlanketOrderListDao.super_.call(this, 'BlanketOrderListDao');
};
util.inherits(BlanketOrderListDao, DaoBase);

BlanketOrderListDao.prototype.fetch = function(connection, filter) {
  console.log('--- Blanket order list DAO.fetch');

  return new Promise( (fulfill, reject) => {
    var orderList = [];
    for (var key in global.orders) {
      if (global.orders.hasOwnProperty(key)) {
        orderList.push(global.orders[key]);
      }
    }
    orderList.totalItems = 2015;
    fulfill( orderList );
  });
};

BlanketOrderListDao.prototype.fetchByName = function(connection, filter) {
  console.log('--- Blanket order list DAO.fetchByName');

  return new Promise( (fulfill, reject) => {
    var orderList = [];
    for (var key in global.orders) {
      if (global.orders.hasOwnProperty(key)) {
        var order = global.orders[key];
        if (order.vendorName === filter)
          orderList.push();
      }
    }
    fulfill( orderList );
  });
};

module.exports = BlanketOrderListDao;
