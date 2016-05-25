'use strict';

const bo = require( '../../../source/index.js' );
const Model = bo.ModelComposer;

const BlanketOrderSchedule = require( './blanket-order-schedule.js' );

const BlanketOrderSchedules = new Model( 'BlanketOrderSchedules' )
  .editableChildCollection()
  // --- Collection elements
  .itemType( BlanketOrderSchedule )
  // --- Build model class
  .compose();

module.exports = BlanketOrderSchedules;
