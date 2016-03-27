'use strict';

var bo = require('../../source/index.js');
var daoBuilder = require('../dao-builder.js');
var Model = bo.ModelComposerSync;
var F = bo.shared.PropertyFlag;

var BlanketOrderSchedulesView = require('./blanket-order-schedules-view.js');

//region Property methods

function getItemCode (ctx) {
    return ctx.getValue('orderItemKey').toString(2);
}

//endregion

//region Transfer object methods

function fromDto (ctx, dto) {
    ctx.setValue('orderItemKey',  dto.orderItemKey);
    ctx.setValue('orderKey',      dto.orderKey);
    ctx.setValue('productName',   dto.productName);
    ctx.setValue('obsolete',      dto.obsolete);
    ctx.setValue('expiry',        dto.expiry);
    ctx.setValue('quantity',      dto.quantity);
    ctx.setValue('unitPrice',     dto.unitPrice);
}

function toCto (ctx) {
    return {
        orderItemCode:  this.orderItemCode,
        productName:    this.productName,
        obsolete:       this.obsolete,
        expiry:         this.expiry,
        quantity:       this.quantity,
        unitPrice:      this.unitPrice
    };
}

//endregion

//region Data portal methods

function dataFetch (ctx, dto, method) {
    ctx.setValue('orderItemKey', dto.orderItemKey);
    ctx.setValue('orderKey',     dto.orderKey);
    ctx.setValue('productName',  dto.productName);
    ctx.setValue('obsolete',     dto.obsolete);
    ctx.setValue('expiry',       dto.expiry);
    ctx.setValue('quantity',     dto.quantity);
    ctx.setValue('unitPrice',    dto.unitPrice);
    return dto;
}

//endregion

var BlanketOrderItemView = Model('BlanketOrderItemView').readOnlyChildModel('sync-dal', __filename)
    .integer('orderItemKey', F.key | F.onDtoOnly)
    .text('orderItemCode', F.onCtoOnly, getItemCode)
    .integer('orderKey', F.parentKey | F.onDtoOnly)
    .text('productName')
    .boolean('obsolete')
    .dateTime('expiry')
    .integer('quantity')
    .decimal('unitPrice')
    .property('schedules', BlanketOrderSchedulesView)
    .daoBuilder(daoBuilder)
    .fromDto(fromDto)
    .toCto(toCto)
    .dataFetch(dataFetch)
    .compose();

module.exports = BlanketOrderItemView;
