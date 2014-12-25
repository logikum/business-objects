'use strict';

var BlanketOrderScheduleDao = function() {

  this.create = function(callback) {
    console.log('--- Blanket order schedule DAO.create');
    callback(null, {});
  };

  this.fetch = function(filter, callback) {
    console.log('--- Blanket order schedule DAO.fetch');
    if (!global.schedules[filter])
      callback(new Error('Blanket order schedule not found.'));
    else
      callback(null, global.schedules[filter]);
  };

  this.fetchForItem = function(filter, callback) {
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

  this.insert = function(data, callback) {
    console.log('--- Blanket order schedule DAO.insert');
    data.orderScheduleKey = ++global.scheduleKey;
    global.schedules[data.orderScheduleKey] = data;
    callback(null, data);
  };

  this.update = function(data, callback) {
    console.log('--- Blanket order schedule DAO.update');
    if (!global.schedules[data.orderScheduleKey])
      callback(new Error('Blanket order schedule not found.'));
    else {
      global.schedules[data.orderScheduleKey] = data;
      callback(null, data);
    }
  };

  this.remove = function(filter, callback) {
    console.log('--- Blanket order schedule DAO.remove');
    if (global.schedules[filter])
      delete global.schedules[filter];
    callback(null);
  };

};

module.exports = BlanketOrderScheduleDao;
