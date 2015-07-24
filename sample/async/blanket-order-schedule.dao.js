'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var BlanketOrderScheduleDao = function() {
  BlanketOrderScheduleDao.super_.call(this, 'BlanketOrderScheduleDao');
};
util.inherits(BlanketOrderScheduleDao, DaoBase);

BlanketOrderScheduleDao.prototype.create = function(connection, callback) {
  console.log('--- Blanket order schedule DAO.create');

  callback(null, {});
};

/* Special fetch method for test circumstances. */
BlanketOrderScheduleDao.prototype.fetchForItem = function(connection, filter, callback) {
  console.log('--- Blanket order schedule DAO.fetchForItem');

  var schedules = [];
  for (var key in global.schedules) {
    if (global.schedules.hasOwnProperty(key)) {
      var schedule = global.schedules[key];
      if (schedule.orderItemKey === filter)
        schedules.push(schedule);
    }
  }
  callback(null, schedules);
};

BlanketOrderScheduleDao.prototype.insert = function(connection, data, callback) {
  console.log('--- Blanket order schedule DAO.insert');

  data.orderScheduleKey = ++global.scheduleKey;
  global.schedules[data.orderScheduleKey] = data;
  callback(null, data);
};

BlanketOrderScheduleDao.prototype.update = function(connection, data, callback) {
  console.log('--- Blanket order schedule DAO.update');

  if (!global.schedules[data.orderScheduleKey])
    callback(new Error('Blanket order schedule not found.'));
  else {
    global.schedules[data.orderScheduleKey] = data;
    callback(null, data);
  }
};

BlanketOrderScheduleDao.prototype.remove = function(connection, filter, callback) {
  console.log('--- Blanket order schedule DAO.remove');

  if (global.schedules[filter])
    delete global.schedules[filter];
  callback(null);
};

module.exports = BlanketOrderScheduleDao;
