'use strict';

const bo = require( '../../source/index.js' );
const Model = bo.ModelComposer;

const BlanketOrderScheduleView = require( './blanket-order-schedule-view.js' );

const BlanketOrderSchedulesView = Model( 'BlanketOrderSchedulesView' )
  .readOnlyChildCollection()
  // --- Collection elements
  .itemType( BlanketOrderScheduleView )
  // --- Build model class
  .compose();

module.exports = BlanketOrderSchedulesView;
