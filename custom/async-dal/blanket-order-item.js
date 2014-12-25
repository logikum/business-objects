'use strict';

var BlanketOrderItemDao = function() {

  this.create = function(callback) {
    console.log('--- Blanket order item DAO.create');
    callback(null, {});
  };

  this.fetch = function(filter, callback) {
    console.log('--- Blanket order item DAO.fetch');
    if (!global.items[filter])
      callback(new Error('Blanket order item not found.'));
    else
      callback(null, global.items[filter]);
  };

  this.fetchForOrder = function(filter, callback) {
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

  this.insert = function(data, callback) {
    console.log('--- Blanket order item DAO.insert');
    data.orderItemKey = ++global.itemKey;
    global.items[data.orderItemKey] = data;
    callback(null, data);
  };

  this.update = function(data, callback) {
    console.log('--- Blanket order item DAO.update');
    if (!global.items[data.orderItemKey])
      callback(new Error('Blanket order item not found.'));
    else {
      global.items[data.orderItemKey] = data;
      callback(null, data);
    }
  };

  this.remove = function(filter, callback) {
    console.log('--- Blanket order item DAO.remove');
    if (global.items[filter])
      delete global.items[filter];
    callback(null);
  };

};

module.exports = BlanketOrderItemDao;
