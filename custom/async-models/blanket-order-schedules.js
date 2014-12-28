'use strict';

var bo = require('../../source/index.js');

var BlanketOrderSchedule = require('./blanket-order-schedule.js');

var BlanketOrderSchedules = bo.EditableChildCollection(
  'BlanketOrderSchedules',
  BlanketOrderSchedule
);

module.exports = BlanketOrderSchedules;
