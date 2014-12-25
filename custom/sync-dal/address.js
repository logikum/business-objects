'use strict';

global.addressKey = 0;
global.addresses = {};

var AddressDao = function() {

  this.create = function() {
    console.log('--- Blanket order address DAO.create');
    return {};
  };

  this.fetch = function(filter) {
    console.log('--- Blanket order address DAO.fetch');
    for (var key in global.addresses) {
      if (global.addresses.hasOwnProperty(key)) {
        var data = global.addresses[key];
        if (data.orderKey === filter)
          return data;
      }
    }
    return {};
  };

  this.insert = function(data) {
    console.log('--- Blanket order address DAO.insert');
    data.addressKey = ++global.addressKey;
    var key = data.addressKey;
    global.addresses[key] = data;
    return data;
  };

  this.update = function(data) {
    console.log('--- Blanket order address DAO.update');
    var key = data.addressKey;
    if (!global.addresses[key])
      throw new Error('Blanket order address not found.');
    global.addresses[key] = data;
    return data;
  };

  this.remove = function(filter) {
    console.log('--- Blanket order address DAO.remove');
    var key = filter;
    if (global.addresses[key])
      delete global.addresses[key];
  };

};

module.exports = AddressDao;
