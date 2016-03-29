'use strict';

var bo = require('../../../source/index.js');
var daoBuilder = require('../dao-builder.js');
var Model = bo.ModelComposer;

var bo = require('../../../source/index.js');
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

function dataFetch (ctx, dto, method, callback) {
    ctx.setValue('orderKey',     dto.orderKey);
    ctx.setValue('vendorName',   dto.vendorName);
    ctx.setValue('contractDate', dto.contractDate);
    ctx.setValue('totalPrice',   dto.totalPrice);
    ctx.setValue('schedules',    dto.schedules);
    ctx.setValue('enabled',      dto.enabled);
    ctx.setValue('createdDate',  dto.createdDate);
    ctx.setValue('modifiedDate', dto.modifiedDate);
    callback(null, dto);
}

//endregion

var BlanketOrderListItem = Model('BlanketOrderListItem')
    .readOnlyChildObject('async-dal', __filename)
    // --- Properties
    .integer('orderKey', F.key | F.onDtoOnly)
    .text('orderCode', F.onCtoOnly, getOrderCode)
    .text('vendorName')
    .dateTime('contractDate')
    .decimal('totalPrice')
    .integer('schedules')
    .boolean('enabled')
    .dateTime('createdDate')
    .dateTime('modifiedDate')
    // --- Customization
    .daoBuilder(daoBuilder)
    .fromDto(fromDto)
    .toCto(toCto)
    .dataFetch(dataFetch)
    // --- Build model class
    .compose();

module.exports = BlanketOrderListItem;
