'use strict';

const bo = require( '../../source/index.js' );
const Model = bo.ModelComposer;
const F = bo.shared.PropertyFlag;

const BlanketOrderSchedules = require( './blanket-order-schedules.js' );

const BlanketOrderItem = new Model( 'BlanketOrderItem' )
  .editableChildObject( 'dao', __filename )
  // --- Properties
  .integer( 'orderItemKey', F.key | F.readOnly )
  .integer( 'orderKey', F.parentKey | F.readOnly )
  .text( 'productName' )
    .required()
  .boolean( 'obsolete' )
    .required()
  .dateTime( 'expiry' )
    .required()
  .integer( 'quantity' )
    .required()
  .decimal( 'unitPrice' )
    .required()
  .property( 'schedules', BlanketOrderSchedules )
  // --- Build model class
  .compose();

module.exports = BlanketOrderItem;
