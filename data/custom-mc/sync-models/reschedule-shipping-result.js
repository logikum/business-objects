'use strict';

var bo = require('../../../source/index.js');
var Model = bo.ModelComposerSync;

//region Data portal methods

function dataFetch (ctx, dto, method) {
  ctx.setValue('quantity',  dto.quantity);
  ctx.setValue('totalMass', dto.totalMass);
  ctx.setValue('required',  dto.required);
  ctx.setValue('shipTo',    dto.shipTo);
  ctx.setValue('shipDate',  dto.shipDate);
  return dto;
}

//endregion

var RescheduleShippingResult = Model('RescheduleShippingResult')
    .readOnlyChildObject('sync-dal', __filename)
    // --- Properties
    .integer('quantity')
        .required()
    .decimal('totalMass')
        .required()
    .boolean('required')
        .required()
    .text('shipTo')
        .required()
    .dateTime('shipDate')
        .required()
    // --- Customization
    .dataFetch(dataFetch)
    // --- Build model class
    .compose();

module.exports = RescheduleShippingResult;
