'use strict';

var bo = require('../../source/index.js');
var daoBuilder = require('../dao-builder.js');
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

var RescheduleShippingResult = Model('RescheduleShippingResult').readOnlyChildModel('sync-dal', __filename)
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
    .daoBuilder(daoBuilder)
    .dataFetch(dataFetch)
    .compose();

module.exports = RescheduleShippingResult;
