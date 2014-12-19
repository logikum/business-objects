'use strict';

global.addressKey = 0;
global.addresses = {};

var AddressDao = function() {

  this.create = function(callback) {
    console.log('--- Blanket order address DAO.create');
    callback(null, {});
  };

  this.fetch = function(filter, callback) {
    console.log('--- Blanket order address DAO.fetch');
    for (var key in global.addresses) {
      if (global.addresses.hasOwnProperty(key)) {
        var data = global.addresses[key];
        if (data.orderKey === filter)
          callback(null, data);
      }
    }
    callback(null, {});
  };

  this.insert = function(data, callback) {
    console.log('--- Blanket order address DAO.insert');
    data.addressKey = ++global.addressKey;
    var key = 'key' + data.addressKey;
    global.addresses[key] = data;
    callback(null, data);
  };

  this.update = function(data, callback) {
    console.log('--- Blanket order address DAO.update');
    var key = 'key' + data.addressKey;
    if (!global.addresses[key])
      callback(new Error('Blanket order address not found.'));
    global.addresses[key] = data;
    callback(null, data);
  };

  this.remove = function(filter, callback) {
    console.log('--- Blanket order address DAO.remove');
    var key = 'key' + filter;
    if (global.addresses[key])
      delete global.addresses[key];
    callback(null);
  };

};

module.exports = AddressDao;
