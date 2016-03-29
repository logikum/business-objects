'use strict';

var bo = require('../../../source/index.js');
var Model = bo.ModelComposerSync;

var BlanketOrderScheduleView = require('./blanket-order-schedule-view.js');

var BlanketOrderSchedulesView = Model('BlanketOrderSchedulesView')
    .readOnlyChildCollection()
    // --- Collection elements
    .itemType(BlanketOrderScheduleView)
    // --- Build model class
    .compose();

module.exports = BlanketOrderSchedulesView;
