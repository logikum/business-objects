'use strict';

const bo = require( '../../source/index.js' );
const Model = bo.ModelComposer;
const F = bo.shared.PropertyFlag;

const BlanketOrderScheduleView = new Model( 'BlanketOrderScheduleView' )
  .readOnlyChildObject( 'dao', __filename )
  // --- Properties
  .integer( 'orderScheduleKey', F.key )
  .integer( 'orderItemKey', F.parentKey )
  .integer( 'quantity' )
  .decimal( 'totalMass' )
  .boolean( 'required' )
  .text( 'shipTo' )
  .dateTime( 'shipDate' )
  // --- Build model class
  .compose();

module.exports = BlanketOrderScheduleView;
