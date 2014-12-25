'use strict';

var BlanketOrderScheduleViewDao = function() {

  this.fetch = function(filter, callback) {
    console.log('--- Blanket order schedule view DAO.fetch');
    if (!global.schedules[filter])
      callback(new Error('Blanket order schedule not found.'));
    else
      callback(null, global.schedules[filter]);
  };

  this.fetchForItem = function(filter, callback) {
    console.log('--- Blanket order schedule view DAO.fetchForItem');
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

};

module.exports = BlanketOrderScheduleViewDao;
