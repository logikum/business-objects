'use strict';

var bo = require('../../../source/index.js');
var daoBuilder = require('../dao-builder.js');
var Model = bo.ModelComposerSync;
var F = bo.shared.PropertyFlag;

//region Property methods

function getScheduleCode (ctx) {
    return ctx.getValue('orderScheduleKey').toString(2);
}

//endregion

//region Transfer object methods

function fromDto (ctx, dto) {
    ctx.setValue('orderScheduleKey',  dto.orderScheduleKey);
    ctx.setValue('orderItemKey',      dto.orderItemKey);
    ctx.setValue('quantity',          dto.quantity);
    ctx.setValue('totalMass',         dto.totalMass);
    ctx.setValue('required',          dto.required);
    ctx.setValue('shipTo',            dto.shipTo);
    ctx.setValue('shipDate',          dto.shipDate);
}

function toCto (ctx) {
    return {
        orderScheduleCode:  this.orderScheduleCode,
        quantity:           this.quantity,
        totalMass:          this.totalMass,
        required:           this.required,
        shipTo:             this.shipTo,
        shipDate:           this.shipDate
    };
}

//endregion

//region Data portal methods

function dataFetch (ctx, dto, method) {
    ctx.setValue('orderScheduleKey', dto.orderScheduleKey);
    ctx.setValue('orderItemKey',     dto.orderItemKey);
    ctx.setValue('quantity',         dto.quantity);
    ctx.setValue('totalMass',        dto.totalMass);
    ctx.setValue('required',         dto.required);
    ctx.setValue('shipTo',           dto.shipTo);
    ctx.setValue('shipDate',         dto.shipDate);
    return dto;
}

//endregion

var BlanketOrderScheduleView = Model('BlanketOrderScheduleView').readOnlyChildModel('sync-dal', __filename)
    .integer('orderScheduleKey', F.key | F.onDtoOnly)
    .text('orderScheduleCode', F.onCtoOnly, getScheduleCode)
    .integer('orderItemKey', F.parentKey | F.onDtoOnly)
    .integer('quantity')
    .decimal('totalMass')
    .boolean('required')
    .text('shipTo')
    .dateTime('shipDate')
    .daoBuilder(daoBuilder)
    .fromDto(fromDto)
    .toCto(toCto)
    .dataFetch(dataFetch)
    .compose();

module.exports = BlanketOrderScheduleView;
