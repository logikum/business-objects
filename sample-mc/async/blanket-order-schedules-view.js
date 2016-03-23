'use strict';

var Model = require('../../source/model-composer.js');

var BlanketOrderScheduleView = require('./blanket-order-schedule-view.js');

var BlanketOrderSchedulesView = Model('BlanketOrderSchedulesView').readOnlyChildCollection()
    .itemType(BlanketOrderScheduleView)
    .Compose();

module.exports = BlanketOrderSchedulesView;
