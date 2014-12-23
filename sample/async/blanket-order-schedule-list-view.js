'use strict';

var bo = require('../../source/index.js');

var BlanketOrderScheduleView = require('./blanket-order-schedule-view.js');

var BlanketOrderScheduleListView = bo.ReadOnlyCollection(
  'BlanketOrderScheduleListView',
  BlanketOrderScheduleView
);

module.exports = BlanketOrderScheduleListView;
