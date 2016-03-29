'use strict';

var bo = require('../../../source/index.js');
var daoBuilder = require('../dao-builder.js');
var Model = bo.ModelComposer;
var F = bo.shared.PropertyFlag;

//region Transfer object methods

function toDto (ctx) {
    return {
        orderScheduleKey: ctx.getValue('orderScheduleKey'),
        orderItemKey:     ctx.getValue('orderItemKey'),
        quantity:         ctx.getValue('quantity'),
        totalMass:        ctx.getValue('totalMass'),
        required:         ctx.getValue('required'),
        shipTo:           ctx.getValue('shipTo'),
        shipDate:         ctx.getValue('shipDate')
    };
}

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
        orderScheduleKey: this.orderScheduleKey,
        orderItemKey:     this.orderItemKey,
        quantity:         this.quantity,
        totalMass:        this.totalMass,
        required:         this.required,
        shipTo:           this.shipTo,
        shipDate:         this.shipDate
    };
}

function fromCto (ctx, dto) {
    //this.orderScheduleKey = dto.orderScheduleKey;
    //this.orderItemKey =     dto.orderItemKey;
    this.quantity =         dto.quantity;
    this.totalMass =        dto.totalMass;
    this.required =         dto.required;
    this.shipTo =           dto.shipTo;
    this.shipDate =         dto.shipDate;
}

//endregion

//region Data portal methods

function dataCreate (ctx, callback) {
    ctx.dao.create(ctx.connection, function (err, dto) {
        if (err)
            callback(err);
        else {
            ctx.setValue('quantity',  dto.quantity);
            ctx.setValue('totalMass', dto.totalMass);
            ctx.setValue('required',  dto.required);
            ctx.setValue('shipTo',    dto.shipTo);
            ctx.setValue('shipDate',  dto.shipDate);
            callback(null);
        }
    });
}

function dataFetch (ctx, dto, method, callback) {
    ctx.setValue('orderScheduleKey', dto.orderScheduleKey);
    ctx.setValue('orderItemKey',     dto.orderItemKey);
    ctx.setValue('quantity',         dto.quantity);
    ctx.setValue('totalMass',        dto.totalMass);
    ctx.setValue('required',         dto.required);
    ctx.setValue('shipTo',           dto.shipTo);
    ctx.setValue('shipDate',         dto.shipDate);
    callback(null, dto);
}

function dataInsert (ctx, callback) {
    var dto = {
        orderItemKey: ctx.getValue('orderItemKey'),
        quantity:     ctx.getValue('quantity'),
        totalMass:    ctx.getValue('totalMass'),
        required:     ctx.getValue('required'),
        shipTo:       ctx.getValue('shipTo'),
        shipDate:     ctx.getValue('shipDate')
    };
    ctx.dao.insert(ctx.connection, dto, function (err, dto) {
        if (err)
            callback(err);
        else {
            ctx.setValue('orderScheduleKey', dto.orderScheduleKey);
            callback(null);
        }
    });
}

function dataUpdate (ctx, callback) {
    if (ctx.isSelfDirty) {
        var dto = {
            orderScheduleKey: ctx.getValue('orderScheduleKey'),
            quantity:         ctx.getValue('quantity'),
            totalMass:        ctx.getValue('totalMass'),
            required:         ctx.getValue('required'),
            shipTo:           ctx.getValue('shipTo'),
            shipDate:         ctx.getValue('shipDate')
        };
        ctx.dao.update(ctx.connection, dto, function (err, dto) {
            if (err)
                callback(err);
            else {
                callback(null);
            }
        });
    }
}

function dataRemove (ctx, callback) {
    var primaryKey = ctx.getValue('orderScheduleKey');
    ctx.dao.remove(ctx.connection, primaryKey, function (err) {
        if (err)
            callback(err);
        else
            callback(null);
    });
}

//endregion

var BlanketOrderSchedule = Model('BlanketOrderSchedule')
    .editableChildObject('async-dal', __filename)
    // --- Properties
    .integer('orderScheduleKey', F.key | F.readOnly)
    .integer('orderItemKey', F.parentKey | F.readOnly)
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

module.exports = BlanketOrderSchedule;
