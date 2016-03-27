'use strict';

var bo = require('../../source/index.js');
var Model = bo.ModelComposer;

var BlanketOrderScheduleView = require('./blanket-order-schedule-view.js');

var BlanketOrderSchedulesView = Model('BlanketOrderSchedulesView').readOnlyChildCollection()
    .itemType(BlanketOrderScheduleView)
    .compose();

module.exports = BlanketOrderSchedulesView;
