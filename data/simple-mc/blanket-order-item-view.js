'use strict';

const bo = require( '../../source/index.js' );
const Model = bo.ModelComposer;
const F = bo.common.PropertyFlag;

const BlanketOrderSchedulesView = require( './blanket-order-schedules-view.js' );

const BlanketOrderItemView = new Model( 'BlanketOrderItemView' )
  .readOnlyChildObject( 'dao', __filename )
  // --- Properties
  .integer( 'orderItemKey', F.key )
  .integer( 'orderKey', F.parentKey )
  .text( 'productName' )
  .boolean( 'obsolete' )
  .dateTime( 'expiry' )
  .integer( 'quantity' )
  .decimal( 'unitPrice' )
  .property( 'schedules', BlanketOrderSchedulesView )
  // --- Build model class
  .compose();

module.exports = BlanketOrderItemView;
