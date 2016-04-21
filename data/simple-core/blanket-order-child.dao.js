'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var BlanketOrderChildDao = function() {
  BlanketOrderChildDao.super_.call(this, 'BlanketOrderChildDao');
};
util.inherits(BlanketOrderChildDao, DaoBase);

BlanketOrderChildDao.prototype.create = function(connection) {
  console.log('--- Blanket order child DAO.create');

  return Promise.resolve( {} );
};

BlanketOrderChildDao.prototype.insert = function(connection, data) {
  console.log('--- Blanket order child DAO.insert');

  return new Promise( (fulfill, reject) => {
    data.orderKey = ++global.orderKey;
    data.createdDate = new Date();
    var key = data.orderKey;
    global.orders[key] = data;
    fulfill( data );
  });
};

BlanketOrderChildDao.prototype.update = function(connection, data) {
  console.log('--- Blanket order child DAO.update');

  return new Promise( (fulfill, reject) => {
    var key = data.orderKey;
    if (!global.orders[key])
      reject(new Error('Blanket order child not found.'));
    else {
      data.modifiedDate = new Date();
      global.orders[key] = data;
      fulfill( data );
    }
  });
};

BlanketOrderChildDao.prototype.remove = function(connection, filter) {
  console.log('--- Blanket order child DAO.remove');

  return new Promise( (fulfill, reject) => {
    var key = filter;
    if (global.orders[key])
      delete global.orders[key];
    fulfill( null );
  });
};

module.exports = BlanketOrderChildDao;
