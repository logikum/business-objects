'use strict';

const bo = require( '../../../source/index.js' );
const Model = bo.ModelComposer;
const F = bo.common.PropertyFlag;

//region Transfer object methods

function fromDto( ctx, dto ) {
  ctx.setValue( 'orderScheduleKey', dto.orderScheduleKey );
  ctx.setValue( 'orderItemKey', dto.orderItemKey );
  ctx.setValue( 'quantity', dto.quantity );
  ctx.setValue( 'totalMass', dto.totalMass );
  ctx.setValue( 'required', dto.required );
  ctx.setValue( 'shipTo', dto.shipTo );
  ctx.setValue( 'shipDate', dto.shipDate );
}

function toCto( ctx ) {
  return {
    orderScheduleKey: this.orderScheduleKey,
    orderItemKey: this.orderItemKey,
    quantity: this.quantity,
    totalMass: this.totalMass,
    required: this.required,
    shipTo: this.shipTo,
    shipDate: this.shipDate
  };
}

//endregion

//region Data portal methods

function dataFetch( ctx, dto, method ) {
  ctx.setValue( 'orderScheduleKey', dto.orderScheduleKey );
  ctx.setValue( 'orderItemKey', dto.orderItemKey );
  ctx.setValue( 'quantity', dto.quantity );
  ctx.setValue( 'totalMass', dto.totalMass );
  ctx.setValue( 'required', dto.required );
  ctx.setValue( 'shipTo', dto.shipTo );
  ctx.setValue( 'shipDate', dto.shipDate );
  ctx.fulfill( dto );
}

//endregion

const BlanketOrderScheduleView = new Model( 'BlanketOrderScheduleView' )
  .readOnlyChildObject( 'dal', __filename )
  // --- Properties
  .integer( 'orderScheduleKey', F.key )
  .integer( 'orderItemKey', F.parentKey )
  .integer( 'quantity' )
  .decimal( 'totalMass' )
  .boolean( 'required' )
  .text( 'shipTo' )
  .dateTime( 'shipDate' )
  // --- Customization
  .fromDto( fromDto )
  .toCto( toCto )
  .dataFetch( dataFetch )
  // --- Build model class
  .compose();

module.exports = BlanketOrderScheduleView;
