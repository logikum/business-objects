'use strict';

const bo = require( '../../source/index.js' );
const Model = bo.ModelComposer;
const F = bo.shared.PropertyFlag;

const BlanketOrderSchedule = new Model( 'BlanketOrderSchedule' )
  .editableChildObject( 'dao', __filename )
  // --- Properties
  .integer( 'orderScheduleKey', F.key | F.readOnly )
  .integer( 'orderItemKey', F.parentKey | F.readOnly )
  .integer( 'quantity' )
    .required()
  .decimal( 'totalMass' )
    .required()
  .boolean( 'required' )
    .required()
  .text( 'shipTo' )
    .required()
  .dateTime( 'shipDate' )
    .required()
  // --- Build model class
  .compose();

module.exports = BlanketOrderSchedule;
