'use strict';

var BlanketOrderScheduleDao = function() {

  this.fetch = function(filter) {
    console.log('--- Blanket order schedule view DAO.fetch');
    if (!global.schedules[filter])
      throw new Error('Blanket order schedule not found.');
    return global.schedules[filter];
  };

  this.fetchForItem = function(filter) {
    console.log('--- Blanket order schedule view DAO.fetchForItem');
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

};

module.exports = BlanketOrderScheduleDao;
