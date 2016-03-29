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
        orderScheduleCode:  this.orderScheduleCode,
        quantity:           this.quantity,
        totalMass:          this.totalMass,
        required:           this.required,
        shipTo:             this.shipTo,
        shipDate:           this.shipDate
    };
}

function fromCto (ctx, cto) {
    //this.orderScheduleKey =   cto.orderScheduleKey;
    //this.orderScheduleCode =  cto.orderScheduleCode;
    //this.orderItemKey =       cto.orderItemKey;
    this.quantity =           cto.quantity;
    this.totalMass =          cto.totalMass;
    this.required =           cto.required;
    this.shipTo =             cto.shipTo;
    this.shipDate =           cto.shipDate;
}

//endregion

//region Data portal methods

function dataCreate (ctx) {
    var dto = ctx.dao.create(ctx.connection);
    ctx.setValue('quantity',  dto.quantity);
    ctx.setValue('totalMass', dto.totalMass);
    ctx.setValue('required',  dto.required);
    ctx.setValue('shipTo',    dto.shipTo);
    ctx.setValue('shipDate',  dto.shipDate);
}

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

function dataInsert (ctx) {
    var dto = {
        orderItemKey: ctx.getValue('orderItemKey'),
        quantity:     ctx.getValue('quantity'),
        totalMass:    ctx.getValue('totalMass'),
        required:     ctx.getValue('required'),
        shipTo:       ctx.getValue('shipTo'),
        shipDate:     ctx.getValue('shipDate')
    };
    dto = ctx.dao.insert(ctx.connection, dto);
    ctx.setValue('orderScheduleKey', dto.orderScheduleKey);
}

function dataUpdate (ctx) {
    if (ctx.isSelfDirty) {
        var dto = {
            orderScheduleKey: ctx.getValue('orderScheduleKey'),
            quantity:         ctx.getValue('quantity'),
            totalMass:        ctx.getValue('totalMass'),
            required:         ctx.getValue('required'),
            shipTo:           ctx.getValue('shipTo'),
            shipDate:         ctx.getValue('shipDate')
        };
        dto = ctx.dao.update(ctx.connection, dto);
    }
}

function dataRemove (ctx) {
    var primaryKey = ctx.getValue('orderScheduleKey');
    ctx.dao.remove(ctx.connection, primaryKey);
}

//endregion

var BlanketOrderSchedule = Model('BlanketOrderSchedule')
    .editableChildModel('sync-dal', __filename)
    // --- Properties
    .integer('orderScheduleKey', F.key | F.readOnly | F.onDtoOnly)
    .text('orderScheduleCode', F.readOnly | F.onCtoOnly, getScheduleCode)
    .integer('orderItemKey', F.parentKey | F.readOnly | F.onDtoOnly)
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
