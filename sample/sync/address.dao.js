'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var AddressDao = function() {
  AddressDao.super_.call(this, 'AddressDao');
};
util.inherits(AddressDao, DaoBase);

AddressDao.prototype.create = function(connection) {
  console.log('--- Blanket order address DAO.create');

  return {};
};

AddressDao.prototype.fetch = function(connection, filter) {
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

AddressDao.prototype.insert = function(connection, data) {
  console.log('--- Blanket order address DAO.insert');

  data.addressKey = ++global.addressKey;
  var key = data.addressKey;
  global.addresses[key] = data;
  return data;
};

AddressDao.prototype.update = function(connection, data) {
  console.log('--- Blanket order address DAO.update');

  var key = data.addressKey;
  if (!global.addresses[key])
    throw new Error('Blanket order address not found.');
  global.addresses[key] = data;
  return data;
};

AddressDao.prototype.remove = function(connection, filter) {
  console.log('--- Blanket order address DAO.remove');

  var key = filter;
  if (global.addresses[key])
    delete global.addresses[key];
};

module.exports = AddressDao;
