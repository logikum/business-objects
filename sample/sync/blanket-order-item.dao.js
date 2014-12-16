'use strict';

global.itemKey = 0;
global.items = {};

var BlanketOrderItemDao = function() {

  this.create = function() {
    console.log('--- Blanket order item DAO.create');
    return {};
  };

  this.fetch = function(filter) {
    console.log('--- Blanket order item DAO.fetch');
    if (!global.items[filter])
      throw new Error('Blanket order item not found.');
    return global.items[filter];
  };

  this.insert = function(data) {
    console.log('--- Blanket order item DAO.insert');
    data.orderItemKey = ++global.itemKey;
    global.items[data.orderItemKey] = data;
    return data;
  };

  this.update = function(data) {
    console.log('--- Blanket order item DAO.update');
    if (!global.items[data.orderItemKey])
      throw new Error('Blanket order item not found.');
    global.items[data.orderItemKey] = data;
    return data;
  };

  this.remove = function(filter) {
    console.log('--- Blanket order item DAO.remove');
    if (global.items[filter])
      delete global.items[filter];
  };

};

module.exports = BlanketOrderItemDao;
