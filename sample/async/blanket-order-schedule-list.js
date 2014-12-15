'use strict';

var bo = require('../../source/index.js');

var BlanketOrderSchedule = require('./blanket-order-schedule.js');

var BlanketOrderScheduleList = new bo.EditableCollection(
    'BlanketOrderScheduleList',
    BlanketOrderSchedule
);

module.exports = BlanketOrderScheduleList;
