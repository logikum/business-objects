'use strict';

var bo = require('../../source/index.js');
var daoBuilder = require('../dao-builder.js');
var Model = bo.ModelComposer;
var F = bo.shared.PropertyFlag;

var BlanketOrderSchedules = require('./blanket-order-schedules.js');

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
        orderItemKey: this.orderItemKey,
        orderKey:     this.orderKey,
        productName:  this.productName,
        obsolete:     this.obsolete,
        expiry:       this.expiry,
        quantity:     this.quantity,
        unitPrice:    this.unitPrice
    };
}

function fromCto (ctx, cto) {
    //this.orderItemKey = cto.orderItemKey;
    //this.orderKey =     cto.orderKey;
    this.productName =  cto.productName;
    this.obsolete =     cto.obsolete;
    this.expiry =       cto.expiry;
    this.quantity =     cto.quantity;
    this.unitPrice =    cto.unitPrice;
}

//endregion

//region Data portal methods

function dataCreate (ctx, callback) {
    ctx.dao.create(ctx.connection, function (err, dto) {
        if (err)
            callback(err);
        else {
            ctx.setValue('productName', dto.productName);
            ctx.setValue('obsolete',    dto.obsolete);
            ctx.setValue('expiry',      dto.expiry);
            ctx.setValue('quantity',    dto.quantity);
            ctx.setValue('unitPrice',   dto.unitPrice);
            callback(null);
        }
    });
}

function dataFetch (ctx, dto, method, callback) {
    ctx.setValue('orderItemKey', dto.orderItemKey);
    ctx.setValue('orderKey',     dto.orderKey);
    ctx.setValue('productName',  dto.productName);
    ctx.setValue('obsolete',     dto.obsolete);
    ctx.setValue('expiry',       dto.expiry);
    ctx.setValue('quantity',     dto.quantity);
    ctx.setValue('unitPrice',    dto.unitPrice);
    callback(null, dto);
}

function dataInsert (ctx, callback) {
    var dto = {
        orderKey:     ctx.getValue('orderKey'),
        productName:  ctx.getValue('productName'),
        obsolete:     ctx.getValue('obsolete'),
        expiry:       ctx.getValue('expiry'),
        quantity:     ctx.getValue('quantity'),
        unitPrice:    ctx.getValue('unitPrice')
    };
    ctx.dao.insert(ctx.connection, dto, function (err, dto) {
        if (err)
            callback(err);
        else {
            ctx.setValue('orderItemKey', dto.orderItemKey);
            callback(null);
        }
    });
}

function dataUpdate (ctx, callback) {
    if (ctx.isSelfDirty) {
        var dto = {
            orderItemKey: ctx.getValue('orderItemKey'),
            productName:  ctx.getValue('productName'),
            obsolete:     ctx.getValue('obsolete'),
            expiry:       ctx.getValue('expiry'),
            quantity:     ctx.getValue('quantity'),
            unitPrice:    ctx.getValue('unitPrice')
        };
        ctx.dao.update(ctx.connection, dto, function (err, dto) {
            if (err)
                callback(err);
            else
                callback(null);
        });
    }
}

function dataRemove (ctx, callback) {
    var primaryKey = ctx.getValue('orderItemKey');
    ctx.dao.remove(ctx.connection, primaryKey, function (err) {
        if (err)
            callback(err);
        else
            callback(null);
    });
}

//endregion

var BlanketOrderItem = Model('BlanketOrderItem').editableChildModel('async-dal', __filename)
    .integer('orderItemKey', F.key | F.readOnly)
    .integer('orderKey', F.parentKey | F.readOnly)
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
    .compose();

module.exports = BlanketOrderItem;
