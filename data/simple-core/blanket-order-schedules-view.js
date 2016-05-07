'use strict';

const bo = require( '../../source/index.js' );
const BlanketOrderScheduleView = require( './blanket-order-schedule-view.js' );

const BlanketOrderSchedulesView = bo.ReadOnlyChildCollection(
  'BlanketOrderSchedulesView',
  BlanketOrderScheduleView
);

module.exports = BlanketOrderSchedulesView;
