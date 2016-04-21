'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var BlanketOrderScheduleDao = function() {
  BlanketOrderScheduleDao.super_.call(this, 'BlanketOrderScheduleDao');
};
util.inherits(BlanketOrderScheduleDao, DaoBase);

BlanketOrderScheduleDao.prototype.create = function(connection) {
  console.log('--- Blanket order schedule DAO.create');

  return Promise.resolve( {} );
};

/* Special fetch method for test circumstances. */
BlanketOrderScheduleDao.prototype.fetchForItem = function(connection, filter) {
  console.log('--- Blanket order schedule DAO.fetchForItem');

  return new Promise( (fulfill, reject) => {
    var schedules = [];
    for (var key in global.schedules) {
      if (global.schedules.hasOwnProperty(key)) {
        var schedule = global.schedules[key];
        if (schedule.orderItemKey === filter)
          schedules.push(schedule);
      }
    }
    fulfill( schedules );
  });
};

BlanketOrderScheduleDao.prototype.insert = function(connection, data) {
  console.log('--- Blanket order schedule DAO.insert');

  return new Promise( (fulfill, reject) => {
    data.orderScheduleKey = ++global.scheduleKey;
    global.schedules[data.orderScheduleKey] = data;
    fulfill( data );
  });
};

BlanketOrderScheduleDao.prototype.update = function(connection, data) {
  console.log('--- Blanket order schedule DAO.update');

  return new Promise( (fulfill, reject) => {
    if (!global.schedules[data.orderScheduleKey])
      reject(new Error('Blanket order schedule not found.'));
    else {
      global.schedules[data.orderScheduleKey] = data;
      fulfill( data );
    }
  });
};

BlanketOrderScheduleDao.prototype.remove = function(connection, filter) {
  console.log('--- Blanket order schedule DAO.remove');

  return new Promise( (fulfill, reject) => {
    if (global.schedules[filter])
      delete global.schedules[filter];
    fulfill( null );
  });
};

module.exports = BlanketOrderScheduleDao;
