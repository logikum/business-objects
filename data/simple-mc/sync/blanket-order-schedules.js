'use strict';

var bo = require('../../../source/index.js');
var Model = bo.ModelComposerSync;

var BlanketOrderSchedule = require('./blanket-order-schedule.js');

var BlanketOrderSchedules = Model('BlanketOrderSchedules').editableChildCollection()
    .itemType(BlanketOrderSchedule)
    .compose();

module.exports = BlanketOrderSchedules;
