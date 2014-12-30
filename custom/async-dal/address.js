'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var AddressDao = function() {
  AddressDao.super_.call(this, 'AddressDao');
};
util.inherits(AddressDao, DaoBase);

AddressDao.prototype.create = function(callback) {
  console.log('--- Blanket order address DAO.create');

  callback(null, {
    country:    '',
    state:      '',
    city:       '',
    line1:      '',
    line2:      '',
    postalCode: ''
  });
};

AddressDao.prototype.fetch = function(filter, callback) {
  console.log('--- Blanket order address DAO.fetch');

  for (var key in global.addresses) {
    if (global.addresses.hasOwnProperty(key)) {
      var data = global.addresses[key];
      if (data.orderKey === filter){
        callback(null, data);
        return;
      }
    }
  }
  callback(null, {});
};

AddressDao.prototype.insert = function(data, callback) {
  console.log('--- Blanket order address DAO.insert');

  data.addressKey = ++global.addressKey;
  var key = data.addressKey;
  global.addresses[key] = data;
  callback(null, data);
};

AddressDao.prototype.update = function(data, callback) {
  console.log('--- Blanket order address DAO.update');

  var key = data.addressKey;
  if (!global.addresses[key])
    callback(new Error('Blanket order address not found.'));
  else {
    global.addresses[key] = data;
    callback(null, data);
  }
};

AddressDao.prototype.remove = function(filter, callback) {
  console.log('--- Blanket order address DAO.remove');

  var key = filter;
  if (global.addresses[key])
    delete global.addresses[key];
  callback(null);
};

module.exports = AddressDao;
