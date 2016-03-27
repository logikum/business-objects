'use strict';

var bo = require('../../source/index.js');
var Model = bo.ModelComposerSync;

var BlanketOrderScheduleView = require('./blanket-order-schedule-view.js');

var BlanketOrderSchedulesView = Model('BlanketOrderSchedulesView').readOnlyChildCollection()
    .itemType(BlanketOrderScheduleView)
    .compose();

module.exports = BlanketOrderSchedulesView;
