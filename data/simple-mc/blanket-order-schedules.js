'use strict';

const bo = require( '../../source/index.js' );
const Model = bo.ModelComposer;

const BlanketOrderSchedule = require( './blanket-order-schedule.js' );

const BlanketOrderSchedules = Model( 'BlanketOrderSchedules' )
  .editableChildCollection()
  // --- Collection elements
  .itemType( BlanketOrderSchedule )
  // --- Build model class
  .compose();

module.exports = BlanketOrderSchedules;
