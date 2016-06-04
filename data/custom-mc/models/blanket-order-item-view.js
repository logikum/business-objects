'use strict';

const bo = require( '../../../source/index.js' );
const Model = bo.ModelComposer;
const F = bo.common.PropertyFlag;

const BlanketOrderSchedulesView = require( './blanket-order-schedules-view.js' );

//region Transfer object methods

function fromDto( ctx, dto ) {
  ctx.setValue( 'orderItemKey', dto.orderItemKey );
  ctx.setValue( 'orderKey', dto.orderKey );
  ctx.setValue( 'productName', dto.productName );
  ctx.setValue( 'obsolete', dto.obsolete );
  ctx.setValue( 'expiry', dto.expiry );
  ctx.setValue( 'quantity', dto.quantity );
  ctx.setValue( 'unitPrice', dto.unitPrice );
}

function toCto( ctx ) {
  return {
    orderItemKey: this.orderItemKey,
    orderKey: this.orderKey,
    productName: this.productName,
    obsolete: this.obsolete,
    expiry: this.expiry,
    quantity: this.quantity,
    unitPrice: this.unitPrice
  };
}

//endregion

//region Data portal methods

function dataFetch( ctx, dto, method ) {
  ctx.setValue( 'orderItemKey', dto.orderItemKey );
  ctx.setValue( 'orderKey', dto.orderKey );
  ctx.setValue( 'productName', dto.productName );
  ctx.setValue( 'obsolete', dto.obsolete );
  ctx.setValue( 'expiry', dto.expiry );
  ctx.setValue( 'quantity', dto.quantity );
  ctx.setValue( 'unitPrice', dto.unitPrice );
  ctx.fulfill( dto );
}

//endregion

const BlanketOrderItemView = new Model( 'BlanketOrderItemView' )
  .readOnlyChildObject( 'dal', __filename )
  // --- Properties
  .integer( 'orderItemKey', F.key )
  .integer( 'orderKey', F.parentKey )
  .text( 'productName' )
  .boolean( 'obsolete' )
  .dateTime( 'expiry' )
  .integer( 'quantity' )
  .decimal( 'unitPrice' )
  .property( 'schedules', BlanketOrderSchedulesView )
  // --- Customization
  .fromDto( fromDto )
  .toCto( toCto )
  .dataFetch( dataFetch )
  // --- Build model class
  .compose();

module.exports = BlanketOrderItemView;
