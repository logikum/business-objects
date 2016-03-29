'use strict';

var bo = require('../../../source/index.js');
var daoBuilder = require('../dao-builder.js');
var Model = bo.ModelComposerSync;
var F = bo.shared.PropertyFlag;

//region Property methods

function getAddressCode (ctx) {
    return ctx.getValue('addressKey').toString(2);
}

//endregion

//region Transfer object methods

function toDto (ctx) {
    return {
        addressKey: ctx.getValue('addressKey'),
        orderKey:   ctx.getValue('orderKey'),
        country:    ctx.getValue('country'),
        state:      ctx.getValue('state'),
        city:       ctx.getValue('city'),
        line1:      ctx.getValue('line1'),
        line2:      ctx.getValue('line2'),
        postalCode: ctx.getValue('postalCode')
    };
}

function fromDto (ctx, dto) {
    ctx.setValue('addressKey',  dto.addressKey);
    ctx.setValue('orderKey',    dto.orderKey);
    ctx.setValue('country',     dto.country);
    ctx.setValue('state',       dto.state);
    ctx.setValue('city',        dto.city);
    ctx.setValue('line1',       dto.line1);
    ctx.setValue('line2',       dto.line2);
    ctx.setValue('postalCode',  dto.postalCode);
}

function toCto (ctx) {
    return {
        addressCode: this.addressCode,
        country:     this.country,
        state:       this.state,
        city:        this.city,
        line1:       this.line1,
        line2:       this.line2,
        postalCode:  this.postalCode
    };
}

function fromCto (ctx, cto) {
    //this.addressKey =  cto.addressKey;
    //this.addressCode = cto.addressCode;
    //this.orderKey =    cto.orderKey;
    this.country =     cto.country;
    this.state =       cto.state;
    this.city =        cto.city;
    this.line1 =       cto.line1;
    this.line2 =       cto.line2;
    this.postalCode =  cto.postalCode;
}

//endregion

//region Data portal methods

function dataCreate (ctx) {
    var dto = ctx.dao.create(ctx.connection);
    ctx.setValue('country',    dto.country);
    ctx.setValue('state',      dto.state);
    ctx.setValue('city',       dto.city);
    ctx.setValue('line1',      dto.line1);
    ctx.setValue('line2',      dto.line2);
    ctx.setValue('postalCode', dto.postalCode);
}

function dataFetch (ctx, dto, method) {
    ctx.setValue('addressKey', dto.addressKey);
    ctx.setValue('orderKey',   dto.orderKey);
    ctx.setValue('country',    dto.country);
    ctx.setValue('state',      dto.state);
    ctx.setValue('city',       dto.city);
    ctx.setValue('line1',      dto.line1);
    ctx.setValue('line2',      dto.line2);
    ctx.setValue('postalCode', dto.postalCode);
    return dto;
}

function dataInsert (ctx) {
    var dto = {
        orderKey:   ctx.getValue('orderKey'),
        country:    ctx.getValue('country'),
        state:      ctx.getValue('state'),
        city:       ctx.getValue('city'),
        line1:      ctx.getValue('line1'),
        line2:      ctx.getValue('line2'),
        postalCode: ctx.getValue('postalCode')
    };
    dto = ctx.dao.insert(ctx.connection, dto);
    ctx.setValue('addressKey', dto.addressKey);
}

function dataUpdate (ctx) {
    if (ctx.isSelfDirty) {
        var dto = {
            addressKey: ctx.getValue('addressKey'),
            country:    ctx.getValue('country'),
            state:      ctx.getValue('state'),
            city:       ctx.getValue('city'),
            line1:      ctx.getValue('line1'),
            line2:      ctx.getValue('line2'),
            postalCode: ctx.getValue('postalCode')
        };
        dto = ctx.dao.update(ctx.connection, dto);
    }
}

function dataRemove (ctx) {
    var primaryKey = ctx.getValue('addressKey');
    ctx.dao.remove(ctx.connection, primaryKey);
}

//endregion

var Address = Model('Address')
    .editableChildModel('sync-dal', __filename)
    // --- Properties
    .integer('addressKey', F.key | F.readOnly | F.onDtoOnly)
    .text('addressCode', F.readOnly | F.onCtoOnly, getAddressCode)
    .integer('orderKey', F.parentKey | F.readOnly | F.onDtoOnly)
    .text('country')
        .required()
    .text('state')
    .text('city')
        .required()
    .text('line1')
        .required()
    .text('line2')
    .text('postalCode')
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

module.exports = Address;
