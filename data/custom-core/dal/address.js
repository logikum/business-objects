'use strict';

var util = require('util');
var DaoBase = require('../../../source/data-access/dao-base.js');

var AddressDao = function() {
  AddressDao.super_.call(this, 'AddressDao');
};
util.inherits(AddressDao, DaoBase);

AddressDao.prototype.create = function( ctx ) {
  console.log('--- Blanket order address DAO.create');

  ctx.fulfill( {
    country:    '',
    state:      '',
    city:       '',
    line1:      '',
    line2:      '',
    postalCode: ''
  });
};

/* Special fetch method for test circumstances. */
AddressDao.prototype.fetchForOrder = function( ctx, filter ) {
  console.log('--- Blanket order address DAO.fetch');

  for (var key in global.addresses) {
    if (global.addresses.hasOwnProperty(key)) {
      var data = global.addresses[key];
      if (data.orderKey === filter){
        ctx.fulfill( data );
        return;
      }
    }
  }
  ctx.reject( {} );
};

AddressDao.prototype.insert = function( ctx, data ) {
  console.log('--- Blanket order address DAO.insert');

  data.addressKey = ++global.addressKey;
  var key = data.addressKey;
  global.addresses[key] = data;
  ctx.fulfill( data );
};

AddressDao.prototype.update = function( ctx, data ) {
  console.log('--- Blanket order address DAO.update');

  var key = data.addressKey;
  if (!global.addresses[key])
    ctx.reject( new Error('Blanket order address not found.' ));
  else {
    global.addresses[key] = data;
    ctx.fulfill( data );
  }
};

AddressDao.prototype.remove = function( ctx, filter ) {
  console.log('--- Blanket order address DAO.remove');

  var key = filter;
  if (global.addresses[key])
    delete global.addresses[key];
  ctx.fulfill( null );
};

module.exports = AddressDao;
