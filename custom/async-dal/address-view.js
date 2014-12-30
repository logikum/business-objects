'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var AddressViewDao = function() {
  AddressViewDao.super_.call(this, 'AddressViewDao');
};
util.inherits(AddressViewDao, DaoBase);

AddressViewDao.prototype.fetch = function(filter, callback) {
  console.log('--- Blanket order address view DAO.fetch');

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

module.exports = AddressViewDao;
