'use strict';

var bo = require('../../source/index.js');
var Model = bo.ModelComposer;

var BlanketOrderSchedule = require('./blanket-order-schedule.js');

var BlanketOrderSchedules = Model('BlanketOrderSchedules').editableChildCollection()
    .itemType(BlanketOrderSchedule)
    .Compose();

module.exports = BlanketOrderSchedules;
