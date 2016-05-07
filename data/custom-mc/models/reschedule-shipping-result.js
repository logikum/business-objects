'use strict';

const bo = require( '../../../source/index.js' );
const Model = bo.ModelComposer;

//region Data portal methods

function dataFetch( ctx, dto, method ) {
  ctx.setValue( 'quantity', dto.quantity );
  ctx.setValue( 'totalMass', dto.totalMass );
  ctx.setValue( 'required', dto.required );
  ctx.setValue( 'shipTo', dto.shipTo );
  ctx.setValue( 'shipDate', dto.shipDate );
  ctx.fulfill( dto );
}

//endregion

const RescheduleShippingResult = Model( 'RescheduleShippingResult' )
  .readOnlyChildObject( 'dal', __filename )
  // --- Properties
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
  // --- Customization
  .dataFetch( dataFetch )
  // --- Build model class
  .compose();

module.exports = RescheduleShippingResult;
