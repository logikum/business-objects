'use strict';

var util = require('util');
var DaoBase = require('../../source/data-access/dao-base.js');

var BlanketOrderScheduleDao = function() {
  BlanketOrderScheduleDao.super_.call(this, 'BlanketOrderScheduleDao');
};
util.inherits(BlanketOrderScheduleDao, DaoBase);

BlanketOrderScheduleDao.prototype.create = function( ctx ) {
  console.log('--- Blanket order schedule DAO.create');

  ctx.fulfill( {} );
};

/* Special fetch method for test circumstances. */
BlanketOrderScheduleDao.prototype.fetchForItem = function( ctx, filter ) {
  console.log('--- Blanket order schedule DAO.fetchForItem');

  var schedules = [];
  for (var key in global.schedules) {
    if (global.schedules.hasOwnProperty(key)) {
      var schedule = global.schedules[key];
      if (schedule.orderItemKey === filter)
        schedules.push(schedule);
    }
  }
  ctx.fulfill( schedules );
};

BlanketOrderScheduleDao.prototype.insert = function( ctx, data ) {
  console.log('--- Blanket order schedule DAO.insert');

  data.orderScheduleKey = ++global.scheduleKey;
  global.schedules[data.orderScheduleKey] = data;
  ctx.fulfill( data );
};

BlanketOrderScheduleDao.prototype.update = function( ctx, data ) {
  console.log('--- Blanket order schedule DAO.update');

  if (!global.schedules[data.orderScheduleKey])
    ctx.reject( new Error('Blanket order schedule not found.' ));
  else {
    global.schedules[data.orderScheduleKey] = data;
    ctx.fulfill( data );
  }
};

BlanketOrderScheduleDao.prototype.remove = function( ctx, filter ) {
  console.log('--- Blanket order schedule DAO.remove');

  if (global.schedules[filter])
    delete global.schedules[filter];
  ctx.fulfill( null );
};

module.exports = BlanketOrderScheduleDao;
