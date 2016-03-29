'use strict';

var bo = require('../../../source/index.js');
var daoBuilder = require('../dao-builder.js');
var Model = bo.ModelComposerSync;
var F = bo.shared.PropertyFlag;

var BlanketOrderSchedules = require('./blanket-order-schedules.js');

//region Property methods

function getItemCode (ctx) {
    return ctx.getValue('orderItemKey').toString(2);
}

//endregion

//region Transfer object methods

function toDto (ctx) {
    return {
        orderItemKey: ctx.getValue('orderItemKey'),
        orderKey:     ctx.getValue('orderKey'),
        productName:  ctx.getValue('productName'),
        obsolete:     ctx.getValue('obsolete'),
        expiry:       ctx.getValue('expiry'),
        quantity:     ctx.getValue('quantity'),
        unitPrice:    ctx.getValue('unitPrice')
    };
}

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

function fromCto (ctx, cto) {
    //this.orderItemKey =  cto.orderItemKey;
    //this.orderItemCode = cto.orderItemCode;
    //this.orderKey =      cto.orderKey;
    this.productName =   cto.productName;
    this.obsolete =      cto.obsolete;
    this.expiry =        cto.expiry;
    this.quantity =      cto.quantity;
    this.unitPrice =     cto.unitPrice;
}

//endregion

//region Data portal methods

function dataCreate (ctx) {
    var dto = ctx.dao.create(ctx.connection);
    ctx.setValue('productName', dto.productName);
    ctx.setValue('obsolete',    dto.obsolete);
    ctx.setValue('expiry',      dto.expiry);
    ctx.setValue('quantity',    dto.quantity);
    ctx.setValue('unitPrice',   dto.unitPrice);
}

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

function dataInsert (ctx) {
    var dto = {
        orderKey:     ctx.getValue('orderKey'),
        productName:  ctx.getValue('productName'),
        obsolete:     ctx.getValue('obsolete'),
        expiry:       ctx.getValue('expiry'),
        quantity:     ctx.getValue('quantity'),
        unitPrice:    ctx.getValue('unitPrice')
    };
    dto = ctx.dao.insert(ctx.connection, dto);
    ctx.setValue('orderItemKey', dto.orderItemKey);
}

function dataUpdate (ctx) {
    if (ctx.isSelfDirty) {
        var dto = {
            orderItemKey: ctx.getValue('orderItemKey'),
            productName:  ctx.getValue('productName'),
            obsolete:     ctx.getValue('obsolete'),
            expiry:       ctx.getValue('expiry'),
            quantity:     ctx.getValue('quantity'),
            unitPrice:    ctx.getValue('unitPrice')
        };
        dto = ctx.dao.update(ctx.connection, dto);
    }
}

function dataRemove (ctx) {
    var primaryKey = ctx.getValue('orderItemKey');
    ctx.dao.remove(ctx.connection, primaryKey);
}

//endregion

var BlanketOrderItem = Model('BlanketOrderItem')
    .editableChildObject('sync-dal', __filename)
    // --- Properties
    .integer('orderItemKey', F.key | F.readOnly | F.onDtoOnly)
    .text('orderItemCode', F.readOnly | F.onCtoOnly, getItemCode)
    .integer('orderKey', F.parentKey | F.readOnly | F.onDtoOnly)
    .text('productName')
        .required()
    .boolean('obsolete')
        .required()
    .dateTime('expiry')
        .required()
    .integer('quantity')
        .required()
    .decimal('unitPrice')
        .required()
    .property('schedules', BlanketOrderSchedules)
    // --- Customization
    .daoBuilder(daoBuilder)
    .toDto(toDto)
    .fromDto(fromDto)
    .toCto(toCto)
    .fromCto(fromCto)
    .dataCreate(dataCreate)
    .dataFetch(dataFetch)
    .dataInsert(dataInsert)
    .dataUpdate(dataUpdate)
    .dataRemove(dataRemove)
    // --- Build model class
    .compose();

module.exports = BlanketOrderItem;
