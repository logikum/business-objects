'use strict';

var daoAddressCtor = require('./address.dao.js');

global.orderKey = 0;
global.orders = {};

var daoAddress = new daoAddressCtor();

var BlanketOrderDao = function() {

  this.create = function() {
    console.log('--- Blanket order DAO.create');
    return {};
  };

  this.fetch = function(filter) {
    console.log('--- Blanket order DAO.fetch');
    var key = 'key' + filter;
    if (!global.orders[key])
      throw new Error('Blanket order not found.');

    var order = global.orders[key];
    order.address = daoAddress.fetch(order.orderKey);

    return order;
  };

  this.fetchByName = function(filter) {
    console.log('--- Blanket order DAO.fetchByName');
    for (var key in global.orders) {
      if (global.orders.hasOwnProperty(key)) {
        var order = global.orders[key];
        if (order.vendorName === filter) {

          order.address = daoAddress.fetch(order.orderKey);

          return order;
        }
      }
    }
    throw new Error('Blanket order not found.');
  };

  this.insert = function(data) {
    console.log('--- Blanket order DAO.insert');
    data.orderKey = ++global.orderKey;
    var key = 'key' + data.orderKey;
    global.orders[key] = data;
    return data;
  };

  this.update = function(data) {
    console.log('--- Blanket order DAO.update');
    var key = 'key' + data.orderKey;
    if (!global.orders[key])
      throw new Error('Blanket order not found.');
    global.orders[key] = data;
    return data;
  };

  this.remove = function(filter) {
    console.log('--- Blanket order DAO.remove');
    var key = 'key' + filter;
    if (global.orders[key])
      delete global.orders[key];
  };

};

module.exports = BlanketOrderDao;
