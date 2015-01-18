'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var BlanketOrderScheduleDao = function() {
  BlanketOrderScheduleDao.super_.call(this, 'BlanketOrderScheduleDao');
};
util.inherits(BlanketOrderScheduleDao, DaoBase);

BlanketOrderScheduleDao.prototype.create = function(connection) {
  console.log('--- Blanket order schedule DAO.create');

  return {};
};

BlanketOrderScheduleDao.prototype.fetch = function(connection, filter) {
  console.log('--- Blanket order schedule DAO.fetch');

  if (!global.schedules[filter])
    throw new Error('Blanket order schedule not found.');
  return global.schedules[filter];
};

BlanketOrderScheduleDao.prototype.fetchForItem = function(connection, filter) {
  console.log('--- Blanket order schedule DAO.fetchForItem');

  var schedules = [];
  for (var key in global.schedules) {
    if (global.schedules.hasOwnProperty(key)) {
      var schedule = global.schedules[key];
      if (schedule.orderItemKey === filter)
        schedules.push(schedule);
    }
  }
  return schedules;
};

BlanketOrderScheduleDao.prototype.insert = function(connection, data) {
  console.log('--- Blanket order schedule DAO.insert');

  data.orderScheduleKey = ++global.scheduleKey;
  global.schedules[data.orderScheduleKey] = data;
  return data;
};

BlanketOrderScheduleDao.prototype.update = function(connection, data) {
  console.log('--- Blanket order schedule DAO.update');

  if (!global.schedules[data.orderScheduleKey])
    throw new Error('Blanket order schedule not found.');
  global.schedules[data.orderScheduleKey] = data;
  return data;
};

BlanketOrderScheduleDao.prototype.remove = function(connection, filter) {
  console.log('--- Blanket order schedule DAO.remove');

  if (global.schedules[filter])
    delete global.schedules[filter];
};

module.exports = BlanketOrderScheduleDao;
