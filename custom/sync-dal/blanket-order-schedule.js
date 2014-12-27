'use strict';

var BlanketOrderScheduleDao = function() {

  this.create = function() {
    console.log('--- Blanket order schedule DAO.create');
    return {
      quantity:  0,
      totalMass: 0.0,
      required:  true,
      shipTo:    '',
      shipDate:  new Date(1980, 1, 1)
    };
  };

  this.fetch = function(filter) {
    console.log('--- Blanket order schedule DAO.fetch');
    if (!global.schedules[filter])
      throw new Error('Blanket order schedule not found.');
    return global.schedules[filter];
  };

  this.fetchForItem = function(filter) {
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

  this.insert = function(data) {
    console.log('--- Blanket order schedule DAO.insert');
    data.orderScheduleKey = ++global.scheduleKey;
    global.schedules[data.orderScheduleKey] = data;
    return data;
  };

  this.update = function(data) {
    console.log('--- Blanket order schedule DAO.update');
    if (!global.schedules[data.orderScheduleKey])
      throw new Error('Blanket order schedule not found.');
    global.schedules[data.orderScheduleKey] = data;
    return data;
  };

  this.remove = function(filter) {
    console.log('--- Blanket order schedule DAO.remove');
    if (global.schedules[filter])
      delete global.schedules[filter];
  };

};

module.exports = BlanketOrderScheduleDao;
