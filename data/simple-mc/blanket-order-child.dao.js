'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var BlanketOrderChildDao = function() {
  BlanketOrderChildDao.super_.call(this, 'BlanketOrderChildDao');
};
util.inherits(BlanketOrderChildDao, DaoBase);

BlanketOrderChildDao.prototype.create = function( ctx ) {
  console.log('--- Blanket order child DAO.create');

  ctx.fulfill( {} );
};

BlanketOrderChildDao.prototype.insert = function( ctx, data ) {
  console.log('--- Blanket order child DAO.insert');

  data.orderKey = ++global.orderKey;
  data.createdDate = new Date();
  var key = data.orderKey;
  global.orders[key] = data;
  ctx.fulfill( data );
};

BlanketOrderChildDao.prototype.update = function( ctx, data ) {
  console.log('--- Blanket order child DAO.update');

  var key = data.orderKey;
  if (!global.orders[key])
    ctx.reject( new Error('Blanket order child not found.' ));
  else {
    data.modifiedDate = new Date();
    global.orders[key] = data;
    ctx.fulfill( data );
  }
};

BlanketOrderChildDao.prototype.remove = function( ctx, filter ) {
  console.log('--- Blanket order child DAO.remove');

  var key = filter;
  if (global.orders[key])
    delete global.orders[key];
  ctx.fulfill( null );
};

module.exports = BlanketOrderChildDao;
