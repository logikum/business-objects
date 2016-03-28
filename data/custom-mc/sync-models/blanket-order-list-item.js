'use strict';

var bo = require('../../../source/index.js');
var daoBuilder = require('../dao-builder.js');
var Model = bo.ModelComposerSync;
var F = bo.shared.PropertyFlag;

//region Property methods

function getOrderCode (ctx) {
    return ctx.getValue('orderKey').toString(2);
}

//endregion

//region Transfer object methods

function fromDto (ctx, dto) {
    ctx.setValue('orderKey',     dto.orderKey);
    ctx.setValue('vendorName',   dto.vendorName);
    ctx.setValue('contractDate', dto.contractDate);
    ctx.setValue('totalPrice',   dto.totalPrice);
    ctx.setValue('schedules',    dto.schedules);
    ctx.setValue('enabled',      dto.enabled);
    ctx.setValue('createdDate',  dto.createdDate);
    ctx.setValue('modifiedDate', dto.modifiedDate);
}

function toCto (ctx) {
    return {
        orderCode:    this.orderCode,
        vendorName:   this.vendorName,
        contractDate: this.contractDate,
        totalPrice:   this.totalPrice,
        schedules:    this.schedules,
        enabled:      this.enabled,
        createdDate:  this.createdDate,
        modifiedDate: this.modifiedDate
    };
}

//endregion

//region Data portal methods

function dataFetch (ctx, dto, method) {
    ctx.setValue('orderKey',     dto.orderKey);
    ctx.setValue('vendorName',   dto.vendorName);
    ctx.setValue('contractDate', dto.contractDate);
    ctx.setValue('totalPrice',   dto.totalPrice);
    ctx.setValue('schedules',    dto.schedules);
    ctx.setValue('enabled',      dto.enabled);
    ctx.setValue('createdDate',  dto.createdDate);
    ctx.setValue('modifiedDate', dto.modifiedDate);
    return dto;
}

//endregion

var BlanketOrderListItem = Model('BlanketOrderListItem').readOnlyChildModel('sync-dal', __filename)
    .integer('orderKey', F.key | F.onDtoOnly)
    .text('orderCode', F.onCtoOnly, getOrderCode)
    .text('vendorName')
    .dateTime('contractDate')
    .decimal('totalPrice')
    .integer('schedules')
    .boolean('enabled')
    .dateTime('createdDate')
    .dateTime('modifiedDate')
    .daoBuilder(daoBuilder)
    .fromDto(fromDto)
    .toCto(toCto)
    .dataFetch(dataFetch)
    .compose();

module.exports = BlanketOrderListItem;
