'use strict';

var util = require('util');
var DaoBase = require('../../../source/data-access/dao-base.js');

var AddressDao = function() {
  AddressDao.super_.call(this, 'AddressDao');
};
util.inherits(AddressDao, DaoBase);

AddressDao.prototype.create = function(connection) {
  console.log('--- Blanket order address DAO.create');

  return Promise.resolve( {} );
};

/* Special fetch method for test circumstances. */
AddressDao.prototype.fetchForOrder = function(connection, filter) {
  console.log('--- Blanket order address DAO.fetch');

  return new Promise( (fulfill, reject) => {
    for (var key in global.addresses) {
      if (global.addresses.hasOwnProperty(key)) {
        var data = global.addresses[key];
        if (data.orderKey === filter){
          fulfill( data );
          return;
        }
      }
    }
    reject( {} );
  });
};

AddressDao.prototype.insert = function(connection, data) {
  console.log('--- Blanket order address DAO.insert');

  return new Promise( (fulfill, reject) => {
    data.addressKey = ++global.addressKey;
    var key = data.addressKey;
    global.addresses[key] = data;
    fulfill( data );
  });
};

AddressDao.prototype.update = function(connection, data) {
  console.log('--- Blanket order address DAO.update');

  return new Promise( (fulfill, reject) => {
    var key = data.addressKey;
    if (!global.addresses[key])
      reject(new Error('Blanket order address not found.'));
    else {
      global.addresses[key] = data;
      fulfill( data );
    }
  });
};

AddressDao.prototype.remove = function(connection, filter) {
  console.log('--- Blanket order address DAO.remove');

  return new Promise( (fulfill, reject) => {
    var key = filter;
    if (global.addresses[key])
      delete global.addresses[key];
    fulfill( null );
  });
};

module.exports = AddressDao;
