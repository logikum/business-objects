'use strict';

var BlanketOrderItemViewDao = function() {

  this.fetch = function(filter) {
    console.log('--- Blanket order item view DAO.fetch');
    if (!global.items[filter])
      throw new Error('Blanket order item not found.');
    return global.items[filter];
  };

  this.fetchForOrder = function(filter) {
    console.log('--- Blanket order item view DAO.fetchForOrder');
    var items = [];
    for (var key in global.items) {
      if (global.items.hasOwnProperty(key)) {
        var item = global.items[key];
        if (item.orderKey === filter)
          items.push(item);
      }
    }
    return items;
  };

};

module.exports = BlanketOrderItemViewDao;
