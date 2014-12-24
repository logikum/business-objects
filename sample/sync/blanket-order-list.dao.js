'use strict';

var BlanketOrderListDao = function() {

  this.fetch = function() {
    console.log('--- Blanket order list DAO.fetch');
    var orderList = [];
    for (var key in global.orders) {
      if (global.orders.hasOwnProperty(key)) {
        orderList.push(global.orders[key]);
      }
    }
    return orderList;
  };

  this.fetchByName = function(filter) {
    console.log('--- Blanket order list DAO.fetchByName');
    var orderList = [];
    for (var key in global.orders) {
      if (global.orders.hasOwnProperty(key)) {
        var order = global.orders[key];
        if (order.vendorName === filter)
          orderList.push();
      }
    }
    return orderList;
  };

};

module.exports = BlanketOrderListDao;
