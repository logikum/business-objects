'use strict';

var Model = require('../../source/model-composer.js');

var BlanketOrderSchedule = require('./blanket-order-schedule.js');

var BlanketOrderSchedules = Model('BlanketOrderSchedules').editableChildCollection()
    .itemType(BlanketOrderSchedule)
    .Compose();

module.exports = BlanketOrderSchedules;
