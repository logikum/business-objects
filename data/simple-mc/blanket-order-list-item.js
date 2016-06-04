'use strict';

const bo = require( '../../source/index.js' );
const Model = bo.ModelComposer;
const F = bo.common.PropertyFlag;

const BlanketOrderListItem = new Model( 'BlanketOrderListItem' )
  .readOnlyChildObject( 'dao', __filename )
  // --- Properties
  .integer( 'orderKey', F.key )
  .text( 'vendorName' )
  .dateTime( 'contractDate' )
  .decimal( 'totalPrice' )
  .integer( 'schedules' )
  .boolean( 'enabled' )
  .dateTime( 'createdDate' )
  .dateTime( 'modifiedDate' )
  // --- Build model class
  .compose();

module.exports = BlanketOrderListItem;
